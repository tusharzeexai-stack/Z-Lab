import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout, TopBar } from '../../components/Layout'
import { StatusBadge } from '../../components/StatusBadge'
import { safeList, internshipApi } from '../../api'
import { toast } from '../../components/Toast'
import { useAuth } from '../../contexts/AuthContext'
import { ArrowRight, ExternalLink } from 'lucide-react'

export const InternsPage = () => {
  const navigate = useNavigate()
  const { role } = useAuth()
  const [interns, setInterns] = useState([])
  const [loading, setLoading] = useState(true)
  const [migratingId, setMigratingId] = useState(null)

  const load = () => {
    setLoading(true)
    internshipApi.interns().then(r => setInterns(safeList(r.data))).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleRowClick = (id) => {
    let prefix = '/team'
    if (role === 'admin' || role === 'super_admin') prefix = '/admin'
    if (role === 'team_head') prefix = '/team-head'
    navigate(`${prefix}/interns/${id}`)
  }

  const handlePromoteToTeamLeader = async (id) => {
    try {
      if (!window.confirm('Are you sure you want to promote this intern to a Team Leader?')) return
      await internshipApi.convert(id, { role: 'team_head' })
      toast.success('Intern promoted to Team Leader successfully!')
      load()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to promote intern')
    }
  }

  const handleMigrate = async (intern, e) => {
    e.stopPropagation()
    const name = intern.user ? `${intern.user.first_name} ${intern.user.last_name}` : (intern.application?.name || 'Intern')
    if (!window.confirm(`Migrate ${name} to Z-Hajirii attendance portal (z-hajirii.vercel.app)?`)) return
    setMigratingId(intern.id)
    try {
      await internshipApi.migrateToZHajirii(intern.id, 'http://43.204.218.180:3001')
      toast.success(`Migrated ${name} to Z-Hajirii attendance portal!`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Migration failed')
    } finally {
      setMigratingId(null)
    }
  }

  return (
    <Layout>
      <TopBar 
        title="Interns Directory" 
        subtitle={`${interns.length} active interns registered`} 
        actions={
          role !== 'intern' && (
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => navigate('/admin/enroll')} className="btn btn-primary btn-sm">
                + Enroll Intern
              </button>
            </div>
          )
        }
      />
      <div className="page slide-up">
        <div className="table-wrapper">
          <table className="interactive-table">
            <thead>
              <tr>
                <th>Intern Detail</th>
                <th>Focus Domain</th>
                <th>Skills</th>
                <th>Assigned Mentor</th>
                <th>Task Progress</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading records...</td></tr>
              ) : interns.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>No interns found.</td></tr>
              ) : interns.map(intern => {
                const pct = intern.tasks_count > 0 ? Math.round((intern.completed_tasks / intern.tasks_count) * 100) : 0
                return (
                  <tr key={intern.id} onClick={() => handleRowClick(intern.id)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {intern.user ? `${intern.user.first_name} ${intern.user.last_name}` : (intern.application?.name || 'Unknown')}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {intern.user ? intern.user.email : intern.application?.email}
                      </div>
                    </td>
                    <td>
                        <span className="badge badge-submitted">{intern.domain || 'General'}</span>
                    </td>
                    <td>
                      <div style={{ fontSize: 12, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }} title={intern.application?.skills}>
                        {intern.application?.skills || '—'}
                      </div>
                    </td>
                    <td>
                      {intern.mentor ? (
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
                            {intern.mentor.first_name} {intern.mentor.last_name}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--red)', fontSize: 12, fontWeight: 700 }}>Unassigned</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="progress-bar" style={{ width: 100 }}>
                            <div className="progress-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{pct}%</span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{intern.completed_tasks} of {intern.tasks_count} tasks done</div>
                    </td>
                    <td>
                      {intern.converted_at ? (
                        <StatusBadge 
                          status="completed" 
                          label={`Converted to ${intern.user?.profile?.role === 'team_head' ? 'Team Head' : 'Member'}`} 
                        />
                      ) : intern.is_ready_for_team ? (
                        <StatusBadge status="reviewed" label="Ready" />
                      ) : (
                        <StatusBadge status="in_progress" label="Ongoing" />
                      )}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => handleRowClick(intern.id)}>
                            View Profile <ArrowRight size={14} />
                        </button>
                        {['admin', 'super_admin'].includes(role) && (
                          <button 
                            className="btn btn-outline btn-sm" 
                            style={{ color: '#2563eb', borderColor: '#2563eb', fontSize: 11, padding: '4px 8px', height: 28, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                            onClick={(e) => handleMigrate(intern, e)}
                            title="Migrate intern to z-hajirii.vercel.app attendance portal"
                          >
                            <ExternalLink size={12} /> {migratingId === intern.id ? 'Migrating...' : 'Migrate'}
                          </button>
                        )}
                        {role === 'mentor' && !intern.converted_at && (
                          <button 
                            className="btn btn-primary btn-sm" 
                            style={{ background: 'var(--green)', borderColor: 'var(--green)', fontSize: 11, padding: '4px 10px', height: 28 }}
                            onClick={() => handlePromoteToTeamLeader(intern.id)}
                          >
                            Promote to Team Leader
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}


