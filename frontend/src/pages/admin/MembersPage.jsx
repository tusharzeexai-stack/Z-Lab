import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Layout, TopBar } from '../../components/Layout'
import { RoleBadge } from '../../components/StatusBadge'
import { Modal } from '../../components/Modal'
import { toast } from '../../components/Toast'
import { authApi } from '../../api'
import { useAuth } from '../../contexts/AuthContext'
import { Eye, Settings } from 'lucide-react'

export const MembersPage = ({ defaultRole }) => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState(defaultRole || '')
  const [editingUser, setEditingUser] = useState(null)
  const [newRole, setNewRole] = useState('')
  const { role: currentUserRole } = useAuth()
  const [acting, setActing] = useState(false)

  const loadUsers = () => {
    setLoading(true)
    let effectiveRole = roleFilter
    if (!effectiveRole) {
      effectiveRole = defaultRole === 'admin' ? 'admin,super_admin' : (defaultRole || 'mentor,team_head')
    } else if (effectiveRole === 'admin') {
      effectiveRole = 'admin,super_admin'
    }

    authApi.users({ search, role: effectiveRole })
      .then(r => {
        let data = r.data.results || r.data
        if (roleFilter !== 'intern' && defaultRole !== 'intern') {
          data = data.filter(u => u.profile?.role !== 'intern')
        }
        setUsers(data)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    setRoleFilter(defaultRole || '')
  }, [defaultRole])

  useEffect(() => {
    loadUsers()
  }, [search, roleFilter, defaultRole])

  const handleUpdateRole = async () => {
    setActing(true)
    try {
      await authApi.updateUser(editingUser.id, { role: newRole })
      toast.success('User role updated successfully')
      setEditingUser(null)
      loadUsers()
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.detail || 'Failed to update user role')
    } finally {
      setActing(false)
    }
  }

  const getHeaderInfo = () => {
    const role = roleFilter || defaultRole
    if (role === 'admin') return { title: 'Admins', subtitle: 'configured administrator accounts' }
    if (role === 'mentor') return { title: 'Mentors', subtitle: 'program mentors & advisors' }
    if (role === 'team_head') return { title: 'Team Leaders', subtitle: 'team heads & supervisors' }
    return { title: 'Team Members', subtitle: 'professional staff members' }
  }
  const headerInfo = getHeaderInfo()

  return (
    <Layout>
      <TopBar 
        title={headerInfo.title} 
        subtitle={`${users.length} ${headerInfo.subtitle}`} 
        actions={
          (currentUserRole === 'admin' || currentUserRole === 'super_admin') && (
            <button onClick={() => navigate('/admin/enroll')} className="btn btn-primary btn-sm">
              + Enroll Member
            </button>
          )
        }
      />
      <div className="page slide-up">
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <input className="input" placeholder="Search name or email..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ maxWidth: 260 }} />
          {!defaultRole && (
            <select className="input" value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ maxWidth: 180 }}>
              <option value="">All Members</option>
              {['mentor', 'team_head'].map(r => <option key={r} value={r}>{r === 'team_head' ? 'TEAM LEADER' : r.toUpperCase()}</option>)}
            </select>
          )}
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                 <th>Member</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                {(currentUserRole === 'admin' || currentUserRole === 'super_admin') && <th>Credentials</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={(currentUserRole === 'admin' || currentUserRole === 'super_admin') ? 6 : 5} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading records...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={(currentUserRole === 'admin' || currentUserRole === 'super_admin') ? 6 : 5} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No members found.</td></tr>
              ) : users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {u.profile?.avatar ? (
                        <img src={u.profile.avatar} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: 'white' }}>
                          {u.first_name?.[0] || u.username?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        {(currentUserRole === 'admin' || currentUserRole === 'super_admin') ? (
                          <Link to={`/admin/members/${u.id}`} style={{ fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none' }} className="hover-link">
                            {u.first_name} {u.last_name}
                          </Link>
                        ) : (
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                            {u.first_name} {u.last_name}
                          </span>
                        )}
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>@{u.username}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td><RoleBadge role={u.profile?.role} /></td>
                  <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{u.profile?.phone || '—'}</td>
                  {(currentUserRole === 'admin' || currentUserRole === 'super_admin') && (
                    <td>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        <div>User: <strong style={{ fontFamily: 'monospace' }}>{u.username}</strong></div>
                        {u.profile?.temp_password && (
                          <div>Pass: <span style={{ fontFamily: 'monospace', color: 'var(--blue)' }}>{u.profile.temp_password}</span></div>
                        )}
                      </div>
                    </td>
                  )}
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {(currentUserRole === 'admin' || currentUserRole === 'super_admin') ? (
                        <>
                          <Link 
                              to={`/admin/members/${u.id}`}
                              className="btn btn-ghost btn-sm" 
                              style={{ padding: '0 8px', height: 28, fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                              <Eye size={12} /> Profile
                          </Link>
                          <button 
                              className="btn btn-ghost btn-sm" 
                              style={{ padding: '0 8px', height: 28, fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
                              onClick={() => { setEditingUser(u); setNewRole(u.profile?.role) }}
                          >
                              <Settings size={12} /> Manage
                          </button>
                        </>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!editingUser} onClose={() => setEditingUser(null)} title="Manage Staff Account">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
                <label className="section-label">Member Details</label>
                <div style={{ padding: 14, background: 'var(--bg-raised)', borderRadius: 10 }}>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{editingUser?.first_name} {editingUser?.last_name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{editingUser?.email}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>
                      Username: <strong style={{ fontFamily: 'monospace' }}>{editingUser?.username}</strong>
                    </div>
                    {editingUser?.profile?.temp_password && (
                      <div style={{ fontSize: 12, color: 'var(--blue)', marginTop: 4 }}>
                        Temporary Password: <strong style={{ fontFamily: 'monospace' }}>{editingUser.profile.temp_password}</strong>
                      </div>
                    )}
                </div>
            </div>

            <div>
                <label className="section-label">Update Role / Position</label>
                <select className="input" value={newRole} onChange={e => setNewRole(e.target.value)}>
                    <option value="admin">Admin</option>
                    <option value="mentor">Mentor</option>
                    <option value="team_head">Team Leader</option>
                    <option value="intern">Intern (Demote)</option>
                </select>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.5 }}>
                    Changing a user's role will immediately update their access permissions across the portal.
                </p>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <button className="btn btn-ghost" onClick={() => setEditingUser(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleUpdateRole} disabled={acting}>Save Changes</button>
            </div>
        </div>
      </Modal>
    </Layout>
  )
}
