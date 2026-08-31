import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Public pages
import LoginPage from './pages/LoginPage'
import { LandingPage } from './pages/LandingPage'
import CareersPage from './pages/CareersPage'
import { PublicSubmitPage } from './pages/PublicSubmitPage'

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { ApplicantsPage } from './pages/admin/ApplicantsPage'
import { InternsPage } from './pages/admin/InternsPage'
import { InternProfilePage } from './pages/admin/InternProfilePage'
import { UsersPage } from './pages/admin/UsersPage'
import { MembersPage } from './pages/admin/MembersPage'
import { MemberProfilePage } from './pages/admin/MemberProfilePage'
import { EnrollPage } from './pages/admin/EnrollPage'
import { PositionsPage } from './pages/admin/PositionsPage'

// Shared
import { ProfilePage } from './pages/ProfilePage'

// Team Member & Mentor
import { TeamMemberDashboard } from './pages/member/TeamMemberDashboard'
import { TeamHeadDashboard } from './pages/teamhead/TeamHeadDashboard'

// Intern
import { InternDashboard } from './pages/intern/InternDashboard'

// ── Protected Route ─────────────────────────────────────────────────────────
const Protected = ({ children, roles }) => {
  const { user, loading, role } = useAuth()
  
  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', color: '#64748b', fontSize: 14 }}>
      Verifying session...
    </div>
  )

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return children
}

const HomeRedirect = () => {
  const { user, loading, role } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  const routes = { super_admin: '/admin', admin: '/admin', mentor: '/team', team_member: '/team', team_head: '/team-head', intern: '/intern-portal' }
  return <Navigate to={routes[role] || '/login'} replace />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/profile" element={<Protected><ProfilePage /></Protected>} />
          <Route path="/zportal" element={<LandingPage />} />
          <Route path="/home" element={<HomeRedirect />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/submit/:token" element={<PublicSubmitPage />} />

          {/* ── Admin ──────────────────────────────────────────────── */}
          <Route path="/admin" element={<Protected roles={['admin', 'super_admin']}><AdminDashboard /></Protected>} />
          <Route path="/admin/applicants" element={<Protected roles={['admin', 'super_admin']}><ApplicantsPage /></Protected>} />
          <Route path="/admin/positions" element={<Protected roles={['admin', 'super_admin']}><PositionsPage /></Protected>} />
          <Route path="/admin/interns" element={<Protected roles={['admin', 'super_admin']}><InternsPage /></Protected>} />
          <Route path="/admin/members" element={<Protected roles={['admin', 'super_admin']}><MembersPage /></Protected>} />
          <Route path="/admin/admins" element={<Protected roles={['admin', 'super_admin']}><MembersPage defaultRole="admin" /></Protected>} />
          <Route path="/admin/mentors" element={<Protected roles={['admin', 'super_admin']}><MembersPage defaultRole="mentor" /></Protected>} />
          <Route path="/admin/team-leaders" element={<Protected roles={['admin', 'super_admin']}><MembersPage defaultRole="team_head" /></Protected>} />
          <Route path="/admin/members/:id" element={<Protected roles={['admin', 'super_admin']}><MemberProfilePage /></Protected>} />
          <Route path="/admin/interns/:id" element={<Protected roles={['admin', 'super_admin']}><InternProfilePage /></Protected>} />
          <Route path="/admin/users" element={<Protected roles={['admin', 'super_admin']}><UsersPage /></Protected>} />
          <Route path="/admin/enroll" element={<Protected roles={['admin', 'super_admin', 'mentor', 'team_member', 'team_head']}><EnrollPage /></Protected>} />

          {/* ── Team Member / Mentor ───────────────────────────────── */}
          <Route path="/team" element={<Protected roles={['team_member', 'mentor']}><TeamMemberDashboard /></Protected>} />
          <Route path="/team/interns" element={<Protected roles={['team_member', 'mentor']}><InternsPage /></Protected>} />
          <Route path="/team/interns/:id" element={<Protected roles={['team_member', 'mentor']}><InternProfilePage /></Protected>} />

          {/* ── Team Head ──────────────────────────────────────────── */}
          <Route path="/team-head" element={<Protected roles={['team_head']}><TeamHeadDashboard /></Protected>} />
          <Route path="/team-head/interns" element={<Protected roles={['team_head']}><InternsPage /></Protected>} />
          <Route path="/team-head/interns/:id" element={<Protected roles={['team_head']}><InternProfilePage /></Protected>} />

          <Route path="/intern-portal" element={<Protected roles={['intern']}><InternDashboard /></Protected>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
