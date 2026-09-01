import { useState, useEffect } from 'react'
import { Layout, TopBar } from '../../components/Layout'
import { StatusBadge } from '../../components/StatusBadge'
import { Modal } from '../../components/Modal'
import { toast } from '../../components/Toast'
import { safeList, getMediaUrl, internshipApi, authApi } from '../../api'
import { Briefcase, GraduationCap, MessageCircle, Calendar, Check, X } from 'lucide-react'

const ROLE_MAP = {
  // Technical
  aiml_engineer: 'AI/ML Engineering Intern',
  aiml_intern: 'AI/ML Engineering Intern',
  fullstack_dev: 'Full-Stack Development Intern',
  backend_engineer: 'Backend Engineering Intern',
  computer_vision: 'Computer Vision Intern',
  devops_cloud: 'Cloud & DevOps Intern',
  data_science: 'Data Science & Analytics Intern',
  data_intern: 'Data Science & Analytics Intern',
  dev_intern: 'Full-Stack Development Intern',
  // Non-Technical
  product_management: 'Product Management Intern',
  uiux_design: 'UI/UX & Product Design Intern',
  design_intern: 'UI/UX & Product Design Intern',
  business_dev: 'Business Development & Growth Intern',
  bde_intern: 'Business Development & Growth Intern',
  social_media_content: 'Social Media & Content Intern',
  marketing_intern: 'Digital Marketing Intern',
  content_intern: 'Content Writing Intern',
  hr_intern: 'HR Intern',
}

const formatRoleTitle = (rawRole, rawDisplay) => {
  if (rawRole && ROLE_MAP[rawRole]) return ROLE_MAP[rawRole]
  if (rawDisplay && rawDisplay !== 'General') return rawDisplay
  if (!rawRole) return 'General'
  return rawRole.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const ROLES = [
  { value: 'aiml_engineer', label: 'AI/ML Engineering' },
  { value: 'fullstack_dev', label: 'Full-Stack Development' },
  { value: 'backend_engineer', label: 'Backend Engineering' },
  { value: 'computer_vision', label: 'Computer Vision' },
  { value: 'devops_cloud', label: 'Cloud & DevOps' },
  { value: 'data_science', label: 'Data Science & Analytics' },
  { value: 'product_management', label: 'Product Management' },
  { value: 'uiux_design', label: 'UI/UX & Product Design' },
  { value: 'business_dev', label: 'Business Development & Growth' },
  { value: 'social_media_content', label: 'Social Media & Content' },
]

export const ApplicantsPage = () => {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [appTypeFilter, setAppTypeFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [search, setSearch] = useState('')
  const [rejectModal, setRejectModal] = useState(null)
  const [reason, setReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const load = () => {
    setLoading(true)
    internshipApi.applications({ status: filter, app_type: appTypeFilter, role: roleFilter, search }).then(r => {
      setApps(safeList(r.data))
    }).finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [filter, appTypeFilter, roleFilter, search])

  const handleDirectAccept = async (appId) => {
    setActionLoading(true)
    try {
      await internshipApi.accept(appId, '')
      toast.success('Application accepted! Intern Profile created.')
      load()
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to accept application.')
    } finally { setActionLoading(false) }
  }

  const handleWhatsAppInterview = (app) => {
    const rawPhone = app.phone || ''
    let cleanPhone = rawPhone.replace(/[^\d+]/g, '')
    if (cleanPhone.startsWith('+')) {
      cleanPhone = cleanPhone.substring(1)
    } else if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone
    }

    if (!cleanPhone) {
      toast.error('No phone number available for this applicant.')
      return
    }

    const roleName = formatRoleTitle(app.role_applied_for, app.role_applied_for_display)
    const message = `Hi ${app.name},\n\n` +
      `Thank you for applying for the ${roleName} position at Z-Lab.\n\n` +
      `We would like to schedule an interview with you. Please let us know your availability for a quick introductory call.\n\n` +
      `Best regards,\nZ-Lab Recruitment Team`

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
    window.open(waUrl, '_blank')
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
      <TopBar title="Applicants" subtitle={`${apps.length} applications registered`} />
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
          <select className="input" value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ maxWidth: 200 }}>
            <option value="">All Roles</option>
            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <button className="btn btn-ghost btn-sm" onClick={() => { setFilter(''); setAppTypeFilter(''); setRoleFilter(''); setSearch('') }}>Reset</button>
        </div>

        <div className="table-wrapper">
          <table style={{ minWidth: 1050 }}>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>App Type</th>
                <th>Contact Info</th>
                <th>Role Applied</th>
                <th>Skills</th>
                <th style={{ textAlign: 'center' }}>Resume</th>
                <th>Applied Date</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ paddingLeft: 16 }}>Actions & WhatsApp Schedule</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading records...</td></tr>
              ) : apps.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No applications found</td></tr>
              ) : apps.map(app => {
                const formattedRole = formatRoleTitle(app.role_applied_for, app.role_applied_for_display)
                return (
                  <tr key={app.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>{app.name}</div>
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
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>📱 {app.phone || 'No phone'}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--purple)', background: 'var(--purple-muted)', padding: '4px 12px', borderRadius: 999, whiteSpace: 'nowrap', display: 'inline-block' }}>
                        {formattedRole}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: 13, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }} title={app.skills}>
                        {app.skills || '—'}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {app.resume ? (
                        <a href={getMediaUrl(app.resume)} target="_blank" rel="noreferrer"
                          style={{ color: 'var(--blue)', fontSize: 13, textDecoration: 'none', fontWeight: 700, background: 'var(--bg-raised)', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)' }}>PDF</a>
                      ) : '—'}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(app.applied_at).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'center' }}><StatusBadge status={app.status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        {app.status === 'pending' && (
                          <>
                            <button className="btn btn-success btn-sm" onClick={() => handleDirectAccept(app.id)} disabled={actionLoading} style={{ fontSize: 12, padding: '4px 10px', height: 30 }}>
                              Accept
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => setRejectModal(app.id)} disabled={actionLoading} style={{ fontSize: 12, padding: '4px 10px', height: 30 }}>
                              Reject
                            </button>
                          </>
                        )}
                        {app.status !== 'rejected' && (
                          <button 
                            className="btn btn-sm" 
                            onClick={() => handleWhatsAppInterview(app)} 
                            style={{ 
                              background: '#25D366', 
                              color: '#fff', 
                              border: 'none', 
                              fontWeight: 700, 
                              fontSize: 11, 
                              padding: '5px 10px', 
                              height: 30, 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: 6,
                              borderRadius: 6,
                              boxShadow: '0 2px 4px rgba(37, 211, 102, 0.2)'
                            }}
                            title="Schedule Interview via WhatsApp"
                          >
                            <MessageCircle size={14} /> Schedule Interview (WhatsApp)
                          </button>
                        )}
                        {app.status === 'rejected' && (
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Application Rejected</span>
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

    </Layout>
  )
}
