import { useState, useEffect } from 'react'
import { Layout, TopBar } from '../../components/Layout'
import { StatusBadge } from '../../components/StatusBadge'
import { Modal } from '../../components/Modal'
import { toast } from '../../components/Toast'
import { safeList, internshipApi } from '../../api'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Briefcase, CheckCircle2, ChevronRight, Edit2, Trash2, HelpCircle, 
  Terminal, Code, Palette, Rocket, BarChart, FileText, Users, Clock, Globe, Plus, Target, Eye
} from 'lucide-react'

const ROLE_ICONS = {
  aiml_engineer: Terminal,
  fullstack_dev: Code,
  backend_engineer: Terminal,
  computer_vision: Eye,
  devops_cloud: Globe,
  data_science: BarChart,
  product_management: Target,
  uiux_design: Palette,
  business_dev: Briefcase,
  social_media_content: Rocket,
}

const TECH_ROLES = [
  { value: 'aiml_engineer', label: 'AI/ML Engineering Intern' },
  { value: 'fullstack_dev', label: 'Full-Stack Development Intern' },
  { value: 'backend_engineer', label: 'Backend Engineering Intern' },
  { value: 'computer_vision', label: 'Computer Vision Intern' },
  { value: 'devops_cloud', label: 'Cloud & DevOps Intern' },
  { value: 'data_science', label: 'Data Science & Analytics Intern' },
]

const NON_TECH_ROLES = [
  { value: 'product_management', label: 'Product Management Intern' },
  { value: 'uiux_design', label: 'UI/UX & Product Design Intern' },
  { value: 'business_dev', label: 'Business Development & Growth Intern' },
  { value: 'social_media_content', label: 'Social Media & Content Intern' },
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
    role: 'aiml_engineer',
    position_type: 'internship',
    duration: '3 - 6 months',
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
      role: 'aiml_engineer',
      position_type: 'internship',
      duration: '3 - 6 months',
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
      role: pos.role || 'aiml_engineer',
      position_type: pos.position_type || 'internship',
      duration: pos.duration || '3 - 6 months',
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
    if (!confirm('Are you sure you want to delete this position?')) return
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
      toast.error('Failed to update status')
    }
  }

  const isTechRole = (roleKey) => {
    return TECH_ROLES.some(r => r.value === roleKey) || ['dev', 'ai', 'cloud', 'data', 'vision', 'backend', 'fullstack'].some(k => (roleKey || '').toLowerCase().includes(k))
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
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>No Job Openings Configured</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 420, margin: '0 auto 20px', lineHeight: 1.5 }}>
              Create open positions so visitors can view and apply for internships or jobs directly from your public landing page.
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
                  <th>Domain</th>
                  <th>Duration</th>
                  <th>Key Skills / Requirements</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                  <th style={{ textAlign: 'right', paddingRight: 24 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {positions.map(pos => {
                  const Icon = ROLE_ICONS[pos.role] || Briefcase
                  const isTech = isTechRole(pos.role)
                  return (
                    <tr key={pos.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: isTech ? 'rgba(99, 102, 241, 0.1)' : 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isTech ? '#6366f1' : '#f59e0b' }}>
                            <Icon size={20} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>{pos.title}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{pos.role}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${isTech ? 'badge-submitted' : 'badge-pending'}`} style={{ fontWeight: 600 }}>
                          {isTech ? '💻 Technical' : '📈 Non-Technical'}
                        </span>
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Clock size={14} className="text-secondary" />
                          <span>{pos.duration || '3 - 6 months'}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--text-secondary)', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={pos.requirements}>
                        {pos.requirements || '—'}
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
        title={form.id ? 'Edit Internship Position' : 'Post New Internship Position'}
        size="lg"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Position Title *</label>
              <input 
                className="input" 
                placeholder="e.g. AI/ML Engineering Intern" 
                value={form.title} 
                onChange={e => setForm({ ...form, title: e.target.value })} 
                required 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Category Role Preset *</label>
              <select 
                className="input" 
                value={form.role} 
                onChange={e => {
                  const val = e.target.value
                  const preset = [...TECH_ROLES, ...NON_TECH_ROLES].find(r => r.value === val)
                  setForm({ 
                    ...form, 
                    role: val,
                    title: form.title || (preset ? preset.label : '')
                  })
                }}
                required
              >
                <optgroup label="💻 TECHNICAL INTERNSHIPS">
                  {TECH_ROLES.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </optgroup>
                <optgroup label="📈 NON-TECHNICAL INTERNSHIPS">
                  {NON_TECH_ROLES.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </optgroup>
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
                placeholder="e.g. 3 - 6 months" 
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
              placeholder="Describe core responsibilities, project scope, and team impact..." 
              value={form.description} 
              onChange={e => setForm({ ...form, description: e.target.value })} 
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Required Skills / Tech Stack</label>
            <textarea 
              className="input" 
              rows={3} 
              placeholder="e.g. Python, PyTorch, Scikit-learn, React, FastAPI, SQL..." 
              value={form.requirements} 
              onChange={e => setForm({ ...form, requirements: e.target.value })} 
            />
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
            <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={acting}>
              {acting ? 'Saving...' : form.id ? 'Save Changes' : 'Publish Position'}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
