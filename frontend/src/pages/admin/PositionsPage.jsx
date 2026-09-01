import { useState, useEffect } from 'react'
import { Layout, TopBar } from '../../components/Layout'
import { StatusBadge } from '../../components/StatusBadge'
import { Modal } from '../../components/Modal'
import { toast } from '../../components/Toast'
import { safeList, internshipApi } from '../../api'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Briefcase, CheckCircle2, ChevronRight, Edit2, Trash2, HelpCircle, 
  Terminal, Code, Palette, Rocket, BarChart, FileText, Users, Clock, Globe, Plus, ToggleLeft, ToggleRight
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

const CATEGORY_PRESETS = [
  { value: 'dev_intern', label: 'Software Development' },
  { value: 'aiml_intern', label: 'AI & Machine Learning' },
  { value: 'design_intern', label: 'UI/UX Design' },
  { value: 'marketing_intern', label: 'Digital Marketing' },
  { value: 'bde_intern', label: 'Business Development' },
  { value: 'data_intern', label: 'Data Analytics' },
  { value: 'content_intern', label: 'Content Writing' },
  { value: 'hr_intern', label: 'Human Resources' },
  { value: 'full_stack_dev', label: 'Full Stack Development' },
  { value: 'backend_dev', label: 'Backend Engineering' },
  { value: 'frontend_dev', label: 'Frontend Engineering' },
]

export const PositionsPage = () => {
  const { role: userRole } = useAuth()
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [acting, setActing] = useState(false)
  const [form, setForm] = useState({
    id: null,
    title: '',
    role: 'dev_intern',
    position_type: 'internship',
    duration: '3 months',
    is_open: true,
    description: '',
    requirements: ''
  })

  const load = () => {
    setLoading(true)
    internshipApi.positions()
      .then(r => setPositions(safeList(r.data)))
      .catch(() => toast.error('Failed to load job positions.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleOpenCreate = () => {
    setForm({
      id: null,
      title: '',
      role: 'dev_intern',
      position_type: 'internship',
      duration: '3 months',
      is_open: true,
      description: '',
      requirements: ''
    })
    setModalOpen(true)
  }

  const handleOpenEdit = (pos) => {
    setForm({
      id: pos.id,
      title: pos.title,
      role: pos.role || 'dev_intern',
      position_type: pos.position_type || 'internship',
      duration: pos.duration || '3 months',
      is_open: pos.is_open,
      description: pos.description || '',
      requirements: pos.requirements || ''
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      toast.error('Position title is required.')
      return
    }
    if (!form.description.trim()) {
      toast.error('Position description is required.')
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
      toast.error(err.response?.data?.detail || err.response?.data?.error || 'Failed to save position.')
    } finally {
      setActing(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this job position? It will be removed from the landing page.')) return
    try {
      await internshipApi.deletePosition(id)
      toast.success('Position deleted successfully')
      load()
    } catch {
      toast.error('Failed to delete position')
    }
  }

  const handleToggleStatus = async (pos) => {
    try {
      await internshipApi.updatePosition(pos.id, { is_open: !pos.is_open })
      toast.success(`Position "${pos.title}" is now ${!pos.is_open ? 'Open & Visible' : 'Closed'}`)
      load()
    } catch {
      toast.error('Failed to update position status')
    }
  }

  return (
    <Layout>
      <TopBar 
        title="Job Openings" 
        subtitle={`${positions.length} total positions configured · ${positions.filter(p => p.is_open).length} currently active on landing page`} 
        actions={
          <button className="btn btn-primary btn-sm" onClick={handleOpenCreate} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Plus size={16} /> Add Position
          </button>
        }
      />
      <div className="page slide-up">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
            Loading job positions...
          </div>
        ) : positions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 40px', background: 'var(--bg-surface)', borderRadius: 24, border: '1px solid var(--border)' }}>
            <div style={{ width: 64, height: 64, background: 'var(--bg-raised)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text-muted)' }}>
              <Briefcase size={32} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>No Job Openings Created</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 420, margin: '0 auto 20px', lineHeight: 1.5 }}>
              Create open positions so applicants can view and apply for internships or jobs directly from your public landing page.
            </p>
            <button className="btn btn-primary" onClick={handleOpenCreate} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Plus size={16} /> Create First Position
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Job Title & Category</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th style={{ textAlign: 'center' }}>Live Landing Page</th>
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
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-raised)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}>
                            <Icon size={20} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>{pos.title}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Category: {pos.role}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${pos.position_type === 'employee' ? 'badge-submitted' : 'badge-pending'}`} style={{ textTransform: 'capitalize' }}>
                          {pos.position_type === 'employee' ? 'Full-Time Job' : 'Internship'}
                        </span>
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Clock size={14} className="text-secondary" />
                          <span>{pos.duration || '3 months'}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <a href="/#positions" target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--blue)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                          View on Site <Globe size={13} />
                        </a>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          onClick={() => handleToggleStatus(pos)}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', outline: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                          title="Click to toggle Open / Closed"
                        >
                          <StatusBadge status={pos.is_open ? 'active' : 'closed'} label={pos.is_open ? 'Open' : 'Closed'} />
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingRight: 12 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => handleOpenEdit(pos)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <Edit2 size={14} /> Edit
                          </button>
                          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={() => handleDelete(pos.id)} title="Delete Position">
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
        title={form.id ? 'Edit Job Opening' : 'Post New Job Opening'}
        size="lg"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Position Title *</label>
              <input 
                className="input" 
                placeholder="e.g. Full Stack Developer, AI/ML Intern" 
                value={form.title} 
                onChange={e => setForm({ ...form, title: e.target.value })} 
                required 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Category Domain *</label>
              <select 
                className="input" 
                value={form.role} 
                onChange={e => setForm({ ...form, role: e.target.value })}
                required
              >
                {CATEGORY_PRESETS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label} ({opt.value})</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Position Type</label>
              <select 
                className="input" 
                value={form.position_type} 
                onChange={e => setForm({ ...form, position_type: e.target.value })}
              >
                <option value="internship">Internship</option>
                <option value="employee">Full-Time Job</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Duration</label>
              <input 
                className="input" 
                placeholder="e.g. 3 months, Permanent" 
                value={form.duration} 
                onChange={e => setForm({ ...form, duration: e.target.value })} 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Publish Status</label>
              <select 
                className="input" 
                value={form.is_open ? 'open' : 'closed'} 
                onChange={e => setForm({ ...form, is_open: e.target.value === 'open' })}
              >
                <option value="open">Open (Visible on Landing Page)</option>
                <option value="closed">Closed (Hidden on Landing Page)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Role Description *</label>
            <textarea 
              className="input" 
              rows={4} 
              placeholder="Describe the responsibilities, project scope, and learning outcomes..." 
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
              placeholder="e.g. Proficient in React, Node.js, Python. Strong communication skills..." 
              value={form.requirements} 
              onChange={e => setForm({ ...form, requirements: e.target.value })} 
            />
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
            <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={acting}>
              {acting ? 'Saving...' : form.id ? 'Save Changes' : 'Publish Job Opening'}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
