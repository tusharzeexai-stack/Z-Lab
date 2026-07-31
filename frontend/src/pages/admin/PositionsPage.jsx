import { useState, useEffect } from 'react'
import { Layout, TopBar } from '../../components/Layout'
import { StatusBadge } from '../../components/StatusBadge'
import { Modal } from '../../components/Modal'
import { toast } from '../../components/Toast'
import { internshipApi } from '../../api'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Briefcase, CheckCircle2, ChevronRight, Edit2, Trash2, HelpCircle, 
  Terminal, Code, Palette, Rocket, BarChart, FileText, Users, Clock, Globe
} from 'lucide-react'

const ROLE_ICONS = {
  aiml_intern: Terminal,
  bde_intern: Briefcase,
  dev_intern: Code,
  design_intern: Palette,
  marketing_intern: Rocket,
  data_intern: BarChart,
  content_intern: FileText,
  hr_intern: Users,
}

const ROLE_OPTIONS = [
  { value: 'aiml_intern', label: 'AI/ML Intern' },
  { value: 'bde_intern', label: 'Business Development Intern' },
  { value: 'dev_intern', label: 'Software Development Intern' },
  { value: 'design_intern', label: 'UI/UX Design Intern' },
  { value: 'marketing_intern', label: 'Digital Marketing Intern' },
  { value: 'data_intern', label: 'Data Analyst Intern' },
  { value: 'content_intern', label: 'Content Writing Intern' },
  { value: 'hr_intern', label: 'HR Intern' },
]

export const PositionsPage = () => {
  const { role: userRole } = useAuth()
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [acting, setActing] = useState(false)
  const [form, setForm] = useState({ id: null, title: '', role: '', duration: '3 months', is_open: true, description: '', requirements: '' })

  const load = () => {
    setLoading(true)
    internshipApi.positions()
      .then(r => setPositions(r.data.results || r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleOpenCreate = () => {
    // Find first role that is not already created
    const createdRoles = positions.map(p => p.role)
    const availableRole = ROLE_OPTIONS.find(opt => !createdRoles.includes(opt.value))?.value || ''
    
    setForm({ id: null, title: '', role: availableRole, duration: '3 months', is_open: true, description: '', requirements: '' })
    setModalOpen(true)
  }

  const handleOpenEdit = (pos) => {
    setForm({
      id: pos.id,
      title: pos.title,
      role: pos.role,
      duration: pos.duration || '3 months',
      is_open: pos.is_open,
      description: pos.description || '',
      requirements: pos.requirements || ''
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.role) {
      toast.error('Please select a role')
      return
    }
    setActing(true)
    try {
      if (form.id) {
        await internshipApi.updatePosition(form.id, form)
        toast.success('Position updated successfully!')
      } else {
        await internshipApi.createPosition(form)
        toast.success('Position created successfully!')
      }
      setModalOpen(false)
      load()
    } catch (err) {
      const errData = err.response?.data
      if (errData?.role) {
        toast.error('A position with this role already exists.')
      } else {
        toast.error('Failed to save position.')
      }
    } finally {
      setActing(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this position?')) return
    try {
      await internshipApi.deletePosition(id)
      toast.success('Position deleted')
      load()
    } catch {
      toast.error('Failed to delete position')
    }
  }

  const handleToggleStatus = async (pos) => {
    try {
      await internshipApi.updatePosition(pos.id, { is_open: !pos.is_open })
      toast.success(`Position ${!pos.is_open ? 'opened' : 'closed'} successfully`)
      load()
    } catch {
      toast.error('Failed to update status')
    }
  }

  // Pre-calculate unused roles for the create dropdown (excluding current editing role)
  const createdRoles = positions.map(p => p.role)
  const filteredRoleOptions = ROLE_OPTIONS.filter(opt => 
    !createdRoles.includes(opt.value) || opt.value === form.role
  )

  return (
    <Layout>
      <TopBar 
        title="Job Openings" 
        subtitle={`${positions.length} active positions configured`} 
        actions={
          <button className="btn btn-primary btn-sm" onClick={handleOpenCreate}>
            + Add Position
          </button>
        }
      />
      <div className="page slide-up">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
            Loading positions...
          </div>
        ) : positions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 40px', background: 'var(--bg-surface)', borderRadius: 24, border: '1px solid var(--border)' }}>
            <div style={{ width: 56, height: 56, background: 'var(--bg-raised)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text-muted)' }}>
              <Briefcase size={28} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>No Positions Configured</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 360, margin: '0 auto 20px' }}>
              Create open positions so visitors can view and apply for internships directly from the landing page.
            </p>
            <button className="btn btn-primary" onClick={handleOpenCreate}>
              Create First Position
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Role Name / Title</th>
                  <th>Duration</th>
                  <th>Category</th>
                  <th style={{ textAlign: 'center' }}>Applications URL</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                  <th style={{ textAlign: 'right', paddingRight: 24 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {positions.map(pos => {
                  const Icon = ROLE_ICONS[pos.role] || Briefcase
                  return (
                    <tr key={pos.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg-raised)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                            <Icon size={18} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{pos.title}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{pos.role}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Clock size={14} className="text-secondary" />
                          <span>{pos.duration || '3 months'}</span>
                        </div>
                      </td>
                      <td>
                        <span className="tag">Technology</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <a href="/#positions" target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--blue)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          View on Site <Globe size={12} />
                        </a>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          onClick={() => handleToggleStatus(pos)}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', outline: 'none' }}
                          title="Click to toggle status"
                        >
                          <StatusBadge status={pos.is_open ? 'active' : 'closed'} />
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingRight: 12 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => handleOpenEdit(pos)}>
                            <Edit2 size={14} /> Edit
                          </button>
                          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={() => handleDelete(pos.id)}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      <Modal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={form.id ? 'Edit Internship Position' : 'Create New Internship Position'}
        size="lg"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Position Title *</label>
              <input 
                className="input" 
                placeholder="e.g. AI/ML Intern" 
                value={form.title} 
                onChange={e => setForm({ ...form, title: e.target.value })} 
                required 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Role Category *</label>
              <select 
                className="input" 
                value={form.role} 
                onChange={e => setForm({ ...form, role: e.target.value })}
                disabled={!!form.id}
                required
              >
                <option value="" disabled>Select role key...</option>
                {filteredRoleOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label} ({opt.value})</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Duration</label>
              <input 
                className="input" 
                placeholder="e.g. 3 months" 
                value={form.duration} 
                onChange={e => setForm({ ...form, duration: e.target.value })} 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Status</label>
              <select 
                className="input" 
                value={form.is_open ? 'open' : 'closed'} 
                onChange={e => setForm({ ...form, is_open: e.target.value === 'open' })}
              >
                <option value="open">Open (Accepting Applications)</option>
                <option value="closed">Closed (Hidden on Site)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Role Description *</label>
            <textarea 
              className="input" 
              rows={4} 
              placeholder="Provide job details, responsibilities, etc..." 
              value={form.description} 
              onChange={e => setForm({ ...form, description: e.target.value })} 
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Requirements (Optional)</label>
            <textarea 
              className="input" 
              rows={3} 
              placeholder="e.g. Proficient in Python, familiar with React..." 
              value={form.requirements} 
              onChange={e => setForm({ ...form, requirements: e.target.value })} 
            />
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
            <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={acting}>
              {form.id ? 'Save Changes' : 'Create Position'}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
