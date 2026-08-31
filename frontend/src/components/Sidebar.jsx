import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  LayoutDashboard, 
  UserPlus, 
  GraduationCap, 
  Users, 
  Briefcase,
  User,
  LogOut,
} from 'lucide-react'
import { Menu, X } from 'lucide-react'

const NAV = {
  admin: [
    { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/admin/applicants', label: 'Applicants', icon: <UserPlus size={18} /> },
    { to: '/admin/enroll', label: 'Enroll Member', icon: <UserPlus size={18} /> },
    { to: '/admin/positions', label: 'Job Openings', icon: <Briefcase size={18} /> },
    { to: '/admin/interns', label: 'Interns', icon: <GraduationCap size={18} /> },
    { to: '/admin/members', label: 'Employees', icon: <Users size={18} /> },
    { to: '/admin/users', label: 'Settings', icon: <User size={18} /> },
  ],
  team_member: [
    { to: '/team', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/team/interns', label: 'My Interns', icon: <GraduationCap size={18} /> },
    { to: '/profile', label: 'My Profile', icon: <User size={18} /> },
  ],
  mentor: [
    { to: '/team', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/team/interns', label: 'My Interns', icon: <GraduationCap size={18} /> },
    { to: '/profile', label: 'My Profile', icon: <User size={18} /> },
  ],
  team_head: [
    { to: '/team-head', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/team-head/interns', label: 'My Interns', icon: <GraduationCap size={18} /> },
    { to: '/profile', label: 'My Profile', icon: <User size={18} /> },
  ],
  intern: [
    { to: '/intern-portal', label: 'Intern Portal', icon: <LayoutDashboard size={18} /> },
    { to: '/profile', label: 'My Profile', icon: <User size={18} /> },
  ],
}
NAV.super_admin = NAV.admin

const ROLE_LABELS = {
  super_admin: 'Super Admin',
  admin: 'Administrator',
  mentor: 'Team Member',
  team_member: 'Team Member',
  team_head: 'Team Head',
  intern: 'Intern',
}

import { toast } from './Toast'

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, role, logout } = useAuth()
  const links = NAV[role] || []

  const initials = user?.first_name
    ? `${user.first_name[0]}${user.last_name?.[0] || ''}`.toUpperCase()
    : user?.username?.[0]?.toUpperCase() || 'U'

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" alt="Logo" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Z-Lab Portal</span>
        </div>
        {/* Close button for mobile */}
        <button className="mobile-sidebar-close" onClick={onClose} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border-sub)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px', borderRadius: 10, background: 'var(--bg-raised)' }}>
          <div className="avatar avatar-sm" style={{ background: '#fff', color: 'var(--blue)', border: '1px solid var(--border)', fontWeight: 800, fontSize: 10, overflow: 'hidden' }}>
            {user?.profile?.avatar ? (
              <img src={user.profile.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              initials
            )}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.first_name} {user?.last_name?.[0] || ''}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{ROLE_LABELS[role]}</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        <div style={{ padding: '0 10px 8px 20px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Menu
        </div>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to.split('/').length <= 2}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span style={{ fontSize: 14, width: 22, display: 'flex', alignItems: 'center' }}>{link.icon}</span>
            <span style={{ flex: 1 }}>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '12px 12px 24px', borderTop: '1px solid var(--border)' }}>
        <button onClick={logout} className="sidebar-link" style={{ width: '100%', textAlign: 'left', color: 'var(--red)', fontWeight: 600 }}>
          <span style={{ fontSize: 14, width: 22 }}>→</span>
          <span>Log Out</span>
        </button>
      </div>
    </div>
  )
}
