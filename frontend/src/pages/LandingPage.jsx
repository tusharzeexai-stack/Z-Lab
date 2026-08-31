import { useState, useEffect, useRef } from 'react'
import {
  ArrowRight, ChevronRight, CheckCircle, Star, Shield, Zap, BarChart, Users, Clock, Award, Target, RefreshCw, Menu, X,
  Eye, UserCheck, Layers, TrendingUp, Globe, Camera, Phone, Mail, MapPin, Upload, Briefcase, Terminal, Code, Palette, Rocket, FileText
} from 'lucide-react'
import './LandingPage.css'
import { internshipApi } from '../api'
import { toast, ToastContainer } from '../components/Toast'
import { Modal } from '../components/Modal'

const useInView = (threshold = 0.15) => {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

const steps = [
  {
    num: '01',
    label: 'Application',
    title: 'Apply with Confidence',
    body: 'Submit your profile through our intelligent application system. Get real-time visibility into your status — no more silence, no black holes. Our smart-match engine evaluates your skills and connects you with the most relevant opportunities.',
    points: ['Automated skill assessment', 'Real-time application tracking', 'Instant feedback on profile gaps'],
    color: '#6366f1',
  },
  {
    num: '02',
    label: 'Internship',
    title: 'Grow Through Real Work',
    body: 'Join a structured internship with direct project ownership from day one. Dedicated senior mentors guide your development every week. Your progress, milestones, and performance are tracked transparently through your personal dashboard.',
    points: ['1-on-1 weekly mentor sessions', 'Live project ownership', 'Weekly performance reviews'],
    color: '#0ea5e9',
  },
  {
    num: '03',
    label: 'Employment',
    title: 'Earn Your Permanent Role',
    body: 'Top performers receive direct, data-backed offers for full-time positions. Your internship performance record eliminates ambiguity and fast-tracks the hiring decision. A new career, built on proven results.',
    points: ['Data-driven conversion decisions', 'Full benefits from day one', 'Clear career ladder visibility'],
    color: '#10b981',
  },
]

const features = [
  { icon: BarChart, title: 'Live Performance Dashboards', body: 'Every milestone is tracked and visualised in real time. Both interns and managers have full transparency on growth metrics.' },
  { icon: Target, title: 'Precision Role Matching', body: 'Our algorithm analyses competency profiles to ensure every placement is a meaningful fit — not just a vacancy fill.' },
  { icon: Shield, title: 'Verified Credentials', body: 'Earn certified endorsements upon completion of each phase. Build an official portfolio of recognised professional milestones.' },
  { icon: RefreshCw, title: 'Seamless Conversion Flow', body: 'The move from intern to employee is frictionless. Zero repeated paperwork, automatic benefit activation, and a warm handoff.' },
  { icon: Users, title: 'Team Visibility', body: 'Full hierarchy visibility across projects and departments. Everyone knows who they report to and how teams are structured.' },
  { icon: Clock, title: '24/7 Support Access', body: 'Our support team and knowledge base are always available, so you are never blocked on important transitions or questions.' },
]

const testimonials = [
  { quote: 'Z-Lab turned our internship program from a chaotic spreadsheet into a professional talent pipeline. The conversion rate is up 40% in one quarter.', name: 'Priya Mehta', title: 'Head of People, Z-Lab', rating: 5 },
  { quote: 'As an intern, I always knew exactly where I stood. The dashboard made the whole process feel fair and transparent. I got converted to full-time after 3 months.', name: 'Aryan Kapoor', title: 'Software Engineer (ex-Intern)', rating: 5 },
  { quote: 'The matching system placed me in a team perfectly aligned with my skills. The mentorship structure is exceptional — structured but not rigid.', name: 'Sara Hussain', title: 'Design Lead (ex-Intern)', rating: 5 },
]

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

export const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [heroRef, heroVisible] = useInView(0.05)

  const [positions, setPositions] = useState([])
  const [posLoading, setPosLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState(null)
  const [applyModalOpen, setApplyModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', skills: '', cover_letter: '' })
  const [resume, setResume] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    internshipApi.positions({ open: 'true' })
      .then(r => {
        const data = r.data.results ?? r.data
        setPositions(Array.isArray(data) ? data : [])
      })
      .catch(() => setPositions([]))
      .finally(() => setPosLoading(false))
  }, [])

  const handleApplyClick = (pos) => {
    setSelectedRole(pos)
    setSubmitted(false)
    setForm({ name: '', email: '', phone: '', skills: '', cover_letter: '' })
    setResume(null)
    setApplyModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!resume) { toast.error('Please upload your resume (PDF)'); return }
    setSubmitting(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    fd.append('resume', resume)
    fd.append('role_applied_for', selectedRole?.role || 'dev_intern')
    try {
      await internshipApi.apply(fd)
      setSubmitted(true)
      toast.success('Application submitted successfully!')
    } catch (err) {
      const errors = err.response?.data
      if (typeof errors === 'object') {
        Object.values(errors).forEach(e => toast.error(Array.isArray(e) ? e[0] : e))
      } else {
        toast.error('Submission failed.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Fixed hook calls — must never be in loops or conditionals (Rules of Hooks)
  const fRef0 = useInView(); const fRef1 = useInView(); const fRef2 = useInView()
  const fRef3 = useInView(); const fRef4 = useInView(); const fRef5 = useInView()
  const featureRefs = [fRef0, fRef1, fRef2, fRef3, fRef4, fRef5]

  const tRef0 = useInView(); const tRef1 = useInView(); const tRef2 = useInView()
  const testiRefs = [tRef0, tRef1, tRef2]

  const bRef0 = useInView(); const bRef1 = useInView(); const bRef2 = useInView()
  const bRef3 = useInView(); const bRef4 = useInView(); const bRef5 = useInView()
  const benefitRefs = [bRef0, bRef1, bRef2, bRef3, bRef4, bRef5]

  // Data (not hooks — safe to define anywhere)
  const benefitItems = [
    { icon: Eye,        title: 'Full Transparency, Always',          body: 'No ghosting. No ambiguity. Your application status, performance score, and next steps are always visible on your personal dashboard.' },
    { icon: UserCheck,  title: 'A Mentor Committed to You',           body: 'Every intern is paired with a senior Z-Lab professional. Weekly 1-on-1 sessions keep your growth structured and consistent.' },
    { icon: Layers,     title: 'Real Work. Production Impact.',       body: 'From week one you own deliverables that ship to live products. No busywork — every task is tied to a real business outcome.' },
    { icon: Award,      title: 'Certified Professional Credentials',  body: 'Complete each phase and earn an officially verified Z-Lab credential that is recognised inside and outside the organisation.' },
    { icon: TrendingUp, title: 'A Clear Path to Full-Time',           body: 'Top performers receive direct conversion offers backed by internship data. No re-interview loop — your track record speaks for itself.' },
    { icon: Globe,      title: 'Access to an Elite Network',          body: 'Join the Z-Lab alumni ecosystem — engineers, designers, and leaders who continue to build and collaborate long after conversion.' },
  ]

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setActiveStep(p => (p + 1) % 3), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="lp">
      <ToastContainer />
      {/* ────────── NAV ────────── */}
      <header className={`lp-nav${scrolled ? ' lp-nav--solid' : ''}`}>
        <div className="lp-nav__inner">
          <a href="/" className="lp-logo">
            <img src="/logo.png" alt="Z-Lab" className="lp-logo__img" />
            <span className="lp-logo__text">Z-Lab</span>
          </a>
          <nav className={`lp-nav__links${menuOpen ? ' open' : ''}`}>
            <a href="/#how-it-works" onClick={() => setMenuOpen(false)}>How it Works</a>
            <a href="/#benefits" onClick={() => setMenuOpen(false)}>Benefits</a>
            <a href="/#positions" onClick={() => setMenuOpen(false)}>Careers</a>
            <a href="/#testimonials" onClick={() => setMenuOpen(false)}>Stories</a>
            <a href="/login" onClick={() => setMenuOpen(false)}>Sign In</a>
          </nav>
          <div className="lp-nav__actions">
            <a href="/#positions" className="lp-btn lp-btn--dark">View Openings</a>
          </div>
          <button className="lp-nav__burger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* ────────── HERO ────────── */}
      <section className="lp-hero" ref={heroRef}>
        <div className={`lp-hero__content${heroVisible ? ' visible' : ''}`}>
          <div className="lp-eyebrow">
            <span className="lp-eyebrow__dot" />
            Professional Career Management Platform
          </div>
          <h1 className="lp-hero__h1">
            From First Application<br />
            to <em>Full-Time Member.</em>
          </h1>
          <p className="lp-hero__p">
            Z-Lab is the complete career management ecosystem. Apply, grow as an intern, and convert to a permanent role — all through one transparent, data-driven platform.
          </p>
          <div className="lp-hero__cta">
            <a href="/#positions" className="lp-btn lp-btn--primary">
              Explore Open Roles <ArrowRight size={18} />
            </a>
            <a href="/#how-it-works" className="lp-btn lp-btn--subtle">
              See How it Works
            </a>
          </div>
          <div className="lp-hero__social-proof">
            <div className="lp-avatars">
              {['#6366f1','#0ea5e9','#10b981','#f59e0b'].map((c, i) => (
                <div key={i} className="lp-avatar" style={{ background: c, zIndex: 10 - i }} />
              ))}
            </div>
            <span>Trusted by <strong>500+</strong> professionals across Z-Lab</span>
          </div>
        </div>
        <div className={`lp-hero__visual${heroVisible ? ' visible' : ''}`}>
          <div className="lp-laptop">
            <div className="lp-laptop__screen-outer">
              <div className="lp-laptop__camera" />
              <div className="lp-laptop__screen">
                {/* Dashboard Preview */}
                <div className="lp-dash">
                  <aside className="lp-dash__side">
                    <div className="lp-dash__logo-sq" />
                    <div className="lp-dash__nav-icons">
                      {[1,2,3,4].map(i => <div key={i} className={`lp-dash__ico${i===1?' lp-dash__ico--active':''}`} />)}
                    </div>
                  </aside>
                  <main className="lp-dash__body">
                    <div className="lp-dash__topbar">
                      <div className="lp-dash__searchbar" />
                      <div className="lp-dash__avatar" />
                    </div>
                    <div className="lp-dash__title-row">
                      <div>
                        <div className="lp-dash__greeting">Good morning, Admin</div>
                        <div className="lp-dash__sub">Evolution Overview · May 2025</div>
                      </div>
                      <div className="lp-dash__report-btn" />
                    </div>
                    <div className="lp-dash__stats">
                      {[
                        { label: 'Applicants', val: '1,284', color: '#6366f1' },
                        { label: 'Active Interns', val: '42', color: '#0ea5e9' },
                        { label: 'New Members', val: '8', color: '#10b981' },
                      ].map(s => (
                        <div key={s.label} className="lp-dash__stat" style={{ '--sc': s.color }}>
                          <div className="lp-dash__stat-icon" />
                          <div className="lp-dash__stat-info">
                            <span className="lp-dash__stat-label">{s.label}</span>
                            <span className="lp-dash__stat-val">{s.val}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="lp-dash__lower">
                      <div className="lp-dash__chart-card">
                        <div className="lp-dash__chart-title">Performance Lifecycle</div>
                        <div className="lp-dash__chart-area">
                          <div className="lp-dash__chart-bar" style={{ height: '40%' }} />
                          <div className="lp-dash__chart-bar" style={{ height: '60%' }} />
                          <div className="lp-dash__chart-bar" style={{ height: '50%' }} />
                          <div className="lp-dash__chart-bar" style={{ height: '80%' }} />
                          <div className="lp-dash__chart-bar" style={{ height: '70%' }} />
                          <div className="lp-dash__chart-bar lp-dash__chart-bar--active" style={{ height: '90%' }} />
                        </div>
                      </div>
                      <div className="lp-dash__recent-card">
                        <div className="lp-dash__chart-title">Recent Conversions</div>
                        {['Intern - Dev', 'Intern - Design', 'Applicant - Intern'].map((r, i) => (
                          <div key={i} className="lp-dash__row">
                            <div className="lp-dash__row-dot" />
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </main>
                </div>
              </div>
            </div>
            <div className="lp-laptop__chin">
              <div className="lp-laptop__notch" />
            </div>
          </div>
        </div>
      </section>

      {/* ────────── STATS BAR ────────── */}
      <section className="lp-statsbar">
        <div className="lp-statsbar__inner">
          {[
            { val: '12,000+', label: 'Applications Processed' },
            { val: '94%', label: 'Intern Conversion Rate' },
            { val: '500+', label: 'Active Mentors' },
            { val: '3x', label: 'Faster Role Matching' },
          ].map(s => (
            <div key={s.label} className="lp-statsbar__item">
              <strong>{s.val}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ────────── HOW IT WORKS ────────── */}
      <section id="how-it-works" className="lp-steps">
        <div className="lp-container">
          <div className="lp-section-head">
            <span className="lp-label">The Three-Phase Journey</span>
            <h2>Every step, handled with precision.</h2>
            <p>Z-Lab manages the complete arc of your professional transition — from the first submission to your first day as a permanent employee.</p>
          </div>

          <div className="lp-steps__tabs">
            {steps.map((s, i) => (
              <button
                key={i}
                className={`lp-steps__tab${activeStep === i ? ' active' : ''}`}
                style={{ '--tc': s.color }}
                onClick={() => setActiveStep(i)}
              >
                <span className="lp-steps__tab-num">{s.num}</span>
                {s.label}
              </button>
            ))}
          </div>

          <div className="lp-steps__panel" style={{ '--tc': steps[activeStep].color }}>
            <div className="lp-steps__panel-text">
              <h3>{steps[activeStep].title}</h3>
              <p>{steps[activeStep].body}</p>
              <ul className="lp-steps__points">
                {steps[activeStep].points.map((pt, i) => (
                  <li key={i}>
                    <CheckCircle size={18} />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lp-steps__panel-visual">
              <div className="lp-phase-card" style={{ '--tc': steps[activeStep].color }}>
                <div className="lp-phase-card__num">{steps[activeStep].num}</div>
                <div className="lp-phase-card__label">{steps[activeStep].label}</div>
                <div className="lp-phase-card__title">{steps[activeStep].title}</div>
                <div className="lp-phase-card__bar-wrap">
                  <div className="lp-phase-card__bar-label">Progress</div>
                  <div className="lp-phase-card__bar">
                    <div className="lp-phase-card__bar-fill" style={{ width: activeStep === 0 ? '35%' : activeStep === 1 ? '70%' : '100%' }} />
                  </div>
                </div>
                <div className="lp-phase-card__tags">
                  {steps[activeStep].points.map((pt, i) => (
                    <span key={i} className="lp-phase-card__tag">{pt.split(' ').slice(0, 2).join(' ')}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ────────── BENEFITS ────────── */}
      <section id="benefits" className="lp-benefits">
        <div className="lp-container">
          <div className="lp-section-head lp-section-head--light">
            <span className="lp-label lp-label--light">Why Join Z-Lab?</span>
            <h2>Built around your growth.</h2>
            <p>Z-Lab is a structured launchpad — not just a job board. Here is exactly what you gain from the moment you apply.</p>
          </div>
          <div className="lp-benefits__grid">
            {benefitItems.map((b, i) => {
              const [ref, vis] = benefitRefs[i]
              return (
                <div key={i} ref={ref} className={`lp-benefit-card${vis ? ' visible' : ''}`} style={{ transitionDelay: `${i * 70}ms` }}>
                  <div className="lp-benefit-card__top">
                    <div className="lp-benefit-card__icon">
                      <b.icon size={20} strokeWidth={1.5} />
                    </div>
                    <span className="lp-benefit-card__num">0{i + 1}</span>
                  </div>
                  <h4>{b.title}</h4>
                  <p>{b.body}</p>
                </div>
              )
            })}
          </div>
          <div className="lp-benefits__cta">
            <a href="/#positions" className="lp-btn lp-btn--primary">
              Explore Open Roles <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* ────────── OPEN POSITIONS ────────── */}
      <section id="positions" className="lp-positions">
        <div className="lp-container">
          <div className="lp-positions__header">
            <div className="lp-positions__title-area">
              <span className="lp-label">Opportunities</span>
              <h2>Open Positions</h2>
            </div>
            <div className="lp-positions__count">
              Showing {positions.length} active {positions.length === 1 ? 'role' : 'roles'}
            </div>
          </div>

          {posLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--slate)' }}>
              <div style={{ width: 30, height: 30, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
              <span style={{ fontSize: 14, fontWeight: 500 }}>Loading active positions...</span>
            </div>
          ) : positions.length > 0 ? (
            <div className="lp-positions__grid">
              {positions.map((pos, i) => {
                const Icon = ROLE_ICONS[pos.role] || Briefcase
                return (
                  <div 
                    key={i} 
                    className="lp-pos-card"
                    onClick={() => handleApplyClick(pos)}
                  >
                    <div>
                      <div className="lp-pos-card__header">
                        <div className="lp-pos-card__icon-box">
                          <Icon size={18} />
                        </div>
                        <span className="lp-pos-card__tag">Technology</span>
                      </div>
                      <h3 className="lp-pos-card__title">{pos.title}</h3>
                      <div className="lp-pos-card__meta">
                        <div className="lp-pos-card__meta-item">
                          <MapPin size={14} />
                          <span>Remote / Hybrid</span>
                        </div>
                        <div className="lp-pos-card__meta-item">
                          <Clock size={14} />
                          <span>Full-time</span>
                        </div>
                      </div>
                    </div>
                    <div className="lp-pos-card__footer">
                      Apply to Role <ChevronRight size={16} />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 40px', background: 'var(--bg-soft)', borderRadius: 24, border: `1px solid var(--border)` }}>
              <p style={{ color: 'var(--slate)', fontSize: 15 }}>No open positions currently available. Please check back later!</p>
            </div>
          )}
        </div>
      </section>

      {/* ────────── TESTIMONIALS ────────── */}
      <section id="testimonials" className="lp-testi">
        <div className="lp-container">
          <div className="lp-section-head">
            <span className="lp-label">Voices from Z-Lab</span>
            <h2>Real results. Real people.</h2>
          </div>
          <div className="lp-testi__grid">
            {testimonials.map((t, i) => {
              const [ref, vis] = testiRefs[i]
              return (
                <div key={i} ref={ref} className={`lp-testi-card${vis ? ' visible' : ''}`} style={{ transitionDelay: `${i * 120}ms` }}>
                  <div className="lp-testi-card__stars">
                    {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />)}
                  </div>
                  <p className="lp-testi-card__quote">"{t.quote}"</p>
                  <div className="lp-testi-card__author">
                    <div className="lp-testi-card__av" />
                    <div>
                      <strong>{t.name}</strong>
                      <span>{t.title}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ────────── CTA ────────── */}
      <section className="lp-cta">
        <div className="lp-container">
          <div className="lp-cta__box">
            <img src="/logo.png" alt="Logo" className="lp-cta__logo" />
            <h2>Your next chapter starts here.</h2>
            <p>
              Whether you are a student looking for a structured launch, or a professional evaluating your next opportunity — Z-Lab gives you the clearest path forward.
            </p>
            <div className="lp-cta__actions">
              <a href="/#positions" className="lp-btn lp-btn--primary">
                Browse Open Roles <ArrowRight size={18} />
              </a>
              <a href="/login" className="lp-btn lp-btn--light">
                Sign In to Portal
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ────────── FOOTER ────────── */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer__main">
            <div className="lp-footer__brand">
              <a href="/" className="lp-logo lp-logo--light">
                <img src="/logo.png" alt="ZeexAI" className="lp-logo__img" />
                <span className="lp-logo__text" style={{ color: '#fff' }}>ZeexAI</span>
              </a>
              <p className="lp-footer__desc">
                Harnessing the power of data and artificial intelligence, Zeex AI empowers organizations to predict risks, ensure safety, and optimize Daily operations—before issues escalate.
              </p>
              <div className="lp-footer__socials">
                <a href="#"><Globe size={20} /></a>
                <a href="#"><Globe size={20} /></a>
                <a href="#"><Globe size={20} /></a>
                <a href="#"><Camera size={20} /></a>
              </div>
            </div>

            <div className="lp-footer__col">
              <h6>Quick Links</h6>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/#how-it-works">How it Works</a></li>
                <li><a href="/#benefits">Benefits</a></li>
                <li><a href="/#testimonials">Stories</a></li>
                <li><a href="/#positions">Careers</a></li>
                <li><a href="/login">Staff Portal</a></li>
              </ul>
            </div>

            <div className="lp-footer__col">
              <h6>Our Services</h6>
              <ul>
                <li><a href="#">Retail & High-Risk Shop Security</a></li>
                <li><a href="#">Bank & ATM Security Solutions</a></li>
                <li><a href="#">Industrial Safety Monitoring</a></li>
                <li><a href="#">Smart City Surveillance</a></li>
              </ul>
            </div>

            <div className="lp-footer__col">
              <h6>Contact Us</h6>
              <ul className="lp-footer__contact">
                <li><Phone size={18} /> <span>+91 8709221636</span></li>
                <li><Mail size={18} /> <span>admin@zeexai.com</span></li>
                <li><MapPin size={18} /> <span>Nirmaan, CFI, IIT Madras</span></li>
              </ul>
            </div>
          </div>

          <div className="lp-footer__bottom">
            <span>© 2026 ZeexAI. All rights reserved.</span>
            <div className="lp-footer__legal">
              <a href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginLeft: 24 }}>Privacy Policy</a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginLeft: 24 }}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ────────── APPLICATION MODAL ────────── */}
      <Modal 
        open={applyModalOpen} 
        onClose={() => setApplyModalOpen(false)} 
        title={selectedRole ? `Apply for ${selectedRole.title}` : 'Apply for Role'}
        size="lg"
      >
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ width: 56, height: 56, background: '#dcfce7', color: '#15803d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle size={28} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, color: 'var(--navy)' }}>Application Sent!</h3>
            <p style={{ color: 'var(--slate)', fontSize: 14, maxWidth: 360, margin: '0 auto 24px', lineHeight: 1.6 }}>
              Thank you for applying to Z-Lab. Our team will review your profile and contact you soon.
            </p>
            <button className="lp-btn lp-btn--dark" onClick={() => setApplyModalOpen(false)}>Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label className="section-label" style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Full Name</label>
                <input className="input" placeholder="e.g. Jane Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div>
                <label className="section-label" style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Email Address</label>
                <input className="input" type="email" placeholder="e.g. jane@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
            </div>
            <div>
              <label className="section-label" style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Phone Number</label>
              <input className="input" type="tel" placeholder="e.g. +91 9876543210" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
            </div>
            <div>
              <label className="section-label" style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Core Skills</label>
              <input className="input" placeholder="e.g. React, Node.js, Python" value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} required />
            </div>
            <div>
              <label className="section-label" style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Cover Letter (Brief)</label>
              <textarea className="input" rows={3} placeholder="Why do you want to join Z-Lab?" value={form.cover_letter} onChange={e => setForm({...form, cover_letter: e.target.value})} required />
            </div>
            <div>
              <label className="section-label" style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Resume (PDF Only)</label>
              <div 
                onClick={() => fileRef.current?.click()}
                style={{ width: '100%', padding: '14px', borderRadius: 12, border: '2px dashed var(--border)', background: 'var(--bg-soft)', color: 'var(--navy)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}
              >
                <Upload size={20} style={{ marginBottom: 6, opacity: 0.7 }} />
                <div style={{ fontSize: 13, fontWeight: 600 }}>{resume ? resume.name : 'Click to upload resume'}</div>
                <input type="file" hidden ref={fileRef} accept=".pdf" onChange={e => setResume(e.target.files[0])} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 10 }}>
              <button type="button" className="lp-btn lp-btn--ghost" onClick={() => setApplyModalOpen(false)}>Cancel</button>
              <button type="submit" className="lp-btn lp-btn--dark" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}


