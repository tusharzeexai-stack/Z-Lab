import { useState, useEffect } from 'react'
import { Layout, TopBar } from '../../components/Layout'
import { StatusBadge } from '../../components/StatusBadge'
import { Modal } from '../../components/Modal'
import { toast } from '../../components/Toast'
import { internshipApi, authApi } from '../../api'
import { Briefcase, GraduationCap } from 'lucide-react'

const ROLES = [
  { value: 'aiml_intern', label: 'AI/ML Intern' },
  { value: 'bde_intern', label: 'BDE Intern' },
  { value: 'dev_intern', label: 'Dev Intern' },
  { value: 'design_intern', label: 'Design Intern' },
  { value: 'marketing_intern', label: 'Marketing Intern' },
  { value: 'data_intern', label: 'Data Intern' },
  { value: 'content_intern', label: 'Content Intern' },
  { value: 'hr_intern', label: 'HR Intern' },
]

export const ApplicantsPage = () => {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [appTypeFilter, setAppTypeFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [search, setSearch] = useState('')
  const [rejectModal, setRejectModal] = useState(null)
  const [acceptModal, setAcceptModal] = useState(null)
  const [interviewModal, setInterviewModal] = useState(null)
  const [interviewDetails, setInterviewDetails] = useState('')
  const [mentors, setMentors] = useState([])
  const [selectedMentorId, setSelectedMentorId] = useState('')
  const [reason, setReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const handleOpenInterviewModal = (app) => {
    setInterviewModal(app)
    setInterviewDetails(
      `Date & Time: \n` +
      `Platform: Google Meet\n` +
      `Meeting Link: https://meet.google.com/...\n` +
      `Interviewer: `
    )
  }

  const handleSendInterview = async () => {
    if (!interviewDetails.trim()) {
      toast.error('Please enter interview details.')
      return
    }
    setActionLoading(true)
    try {
      await internshipApi.sendInterviewMail(interviewModal.id, interviewDetails)
      toast.success('Interview email sent successfully!')
      setInterviewModal(null)
      setInterviewDetails('')
      load()
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to send interview invitation.')
    } finally { setActionLoading(false) }
  }

  const load = () => {
    setLoading(true)
    internshipApi.applications({ status: filter, app_type: appTypeFilter, role: roleFilter, search }).then(r => {
      setApps(r.data.results || r.data)
    }).finally(() => setLoading(false))
  }

  const loadMentors = () => {
    authApi.mentors().then(r => setMentors(r.data.results || r.data))
  }

  useEffect(() => {
    load()
    loadMentors()
  }, [filter, appTypeFilter, roleFilter, search])

  const handleAccept = async () => {
    if (!acceptModal) return
    setActionLoading(true)
    try {
      await internshipApi.accept(acceptModal, selectedMentorId)
      toast.success('Application accepted. Account created.')
      setAcceptModal(null)
      setSelectedMentorId('')
      load()
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed')
    } finally { setActionLoading(false) }
  }

  const handleReject = async () => {
    setActionLoading(true)
    try {
      await internshipApi.reject(rejectModal, reason)
      toast.success('Application rejected')
      setRejectModal(null)
      setReason('')
      load()
    } catch { toast.error('Failed') } finally { setActionLoading(false) }
  }

  return (
    <Layout>
      <TopBar title="Applicants" subtitle={`${apps.length} applications`} />
      <div className="page slide-up">
        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <input className="input" placeholder="Search name or email..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ maxWidth: 220 }} />
          <select className="input" value={appTypeFilter} onChange={e => setAppTypeFilter(e.target.value)} style={{ maxWidth: 180, fontWeight: 600 }}>
            <option value="">All App Types</option>
            <option value="internship">Internship</option>
            <option value="employee">Full-Time Job</option>
          </select>
          <select className="input" value={filter} onChange={e => setFilter(e.target.value)} style={{ maxWidth: 140 }}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
          <select className="input" value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ maxWidth: 180 }}>
            <option value="">All Roles</option>
            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <button className="btn btn-ghost btn-sm" onClick={() => { setFilter(''); setAppTypeFilter(''); setRoleFilter(''); setSearch('') }}>Reset</button>
        </div>

        <div className="table-wrapper">
          <table style={{ minWidth: 950 }}>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>App Type</th>
                <th>Contact</th>
                <th>Role Applied</th>
                <th>Skills</th>
                <th style={{ textAlign: 'center' }}>Resume</th>
                <th>Applied</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ paddingLeft: 30 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading...</td></tr>
              ) : apps.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No applications found</td></tr>
              ) : apps.map(app => (
                <tr key={app.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{app.name}</div>
                  </td>
                  <td>
                    {app.app_type === 'employee' ? (
                      <span className="badge" style={{ background: 'var(--amber-muted)', color: 'var(--amber)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Briefcase size={12} /> Full-Time
                      </span>
                    ) : (
                      <span className="badge" style={{ background: 'var(--blue-muted)', color: 'var(--blue)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <GraduationCap size={12} /> Internship
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{app.email}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{app.phone}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--purple)', background: 'var(--purple-muted)', padding: '2px 10px', borderRadius: 999, whiteSpace: 'nowrap' }}>
                      {app.role_applied_for_display || app.role_applied_for?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: 13, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }} title={app.skills}>
                      {app.skills}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {app.resume ? (
                      <a href={app.resume} target="_blank" rel="noreferrer"
                        style={{ color: 'var(--blue)', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>PDF</a>
                    ) : '—'}
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(app.applied_at).toLocaleDateString()}
                  </td>
                  <td style={{ textAlign: 'center' }}><StatusBadge status={app.status} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, minWidth: 100 }}>
                      {app.status === 'pending' && (
                        <>
                          <button className="btn btn-success btn-sm" onClick={() => setAcceptModal(app.id)} disabled={actionLoading}>
                            Accept
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={() => handleOpenInterviewModal(app)} disabled={actionLoading} style={{ color: 'var(--blue)' }}>
                            Invite
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => setRejectModal(app.id)} disabled={actionLoading}>
                            Reject
                          </button>
                        </>
                      )}
                      {app.status === 'accepted' && (
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Intern Profile Created</span>
                      )}
                      {app.status === 'rejected' && (
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Application Closed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!rejectModal} onClose={() => setRejectModal(null)} title="Reject Application">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14 }}>Provide a reason for rejection (optional):</p>
          <textarea className="input" rows={4} placeholder="e.g. Missing required skills" value={reason}
            onChange={e => setReason(e.target.value)} />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost" onClick={() => setRejectModal(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleReject} disabled={actionLoading}>Reject Application</button>
          </div>
        </div>
      </Modal>

      <Modal open={!!acceptModal} onClose={() => setAcceptModal(null)} title="Accept Application">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14 }}>
            Accept this application to create an intern profile. <strong>Note:</strong> A user account will be created immediately, and an email with login credentials will be sent to the intern.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Assign Mentor (Optional)</label>
            <select
              className="input"
              value={selectedMentorId}
              onChange={e => setSelectedMentorId(e.target.value)}
            >
              <option value="">No mentor assigned yet</option>
              {mentors.map(m => (
                <option key={m.id} value={m.id}>{m.first_name} {m.last_name} (@{m.username})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
            <button className="btn btn-ghost" onClick={() => setAcceptModal(null)}>Cancel</button>
            <button className="btn btn-success" onClick={handleAccept} disabled={actionLoading}>Confirm & Accept</button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}
