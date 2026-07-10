import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, MessageCircle, ArrowRight, Clock, Loader2 } from 'lucide-react'
import { submitEnquiry } from '../lib/api'

const SPACE_TYPES = ['Residential', 'Commercial', 'Office', 'Retail', 'Villa/Bungalow', 'Other']
const REFERRAL_OPTIONS = ['Instagram', 'Google', 'Word of Mouth', 'Facebook', 'Other']
const LOCATIONS = ['Ambernath', 'Kalyan', 'Pune', 'Mumbai', 'Other']
const PROJECT_TYPES = ['1BHK/2BHK', '3BHK+', 'Villa/Bungalow', 'Office', 'Retail/Commercial']
const BUDGETS = ['₹5L–₹10L', '₹10L–₹20L', '₹20L+']

export default function Contact() {
  const [form, setForm] = useState({
    fullName: '',
    phone: '+91 ',
    email: '',
    spaceType: '',
    location: '',
    projectType: '',
    budget: '',
    referral: '',
    requirements: '',
  })

  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const headingRef = useRef<HTMLElement>(null)
  const sectionRef  = useRef<HTMLElement>(null)
  const [headingInView, setHeadingInView] = useState(false)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = headingRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => setHeadingInView(e.isIntersecting), { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const toggle = (field: 'location' | 'projectType' | 'budget') => (value: string) =>
    setForm(f => ({ ...f, [field]: f[field] === value ? '' : value }))

  /* ── animation helpers ── */
  const fieldEl = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 500ms ease-out ${delay}ms, transform 500ms ease-out ${delay}ms`,
  })

  const chipEl = (delay: number): React.CSSProperties => ({
    display: 'inline-block',
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateX(0)' : 'translateX(-14px)',
    transition: `opacity 400ms ease-out ${delay}ms, transform 400ms ease-out ${delay}ms`,
  })

  const iconEl = (index: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'scale(1)' : 'scale(0.35)',
    transition: `opacity 350ms ease-out ${280 + index * 150}ms, transform 450ms cubic-bezier(0.34,1.56,0.64,1) ${280 + index * 150}ms`,
  })

  return (
    <div style={{ background: '#F5F0E8' }}>
      <style>{`
        /* ── cards ── */
        .contact-form-card {
          background: #FFFFFF;
          border: 1px solid #E8E0D0;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 24px rgba(60,50,30,0.05);
          height: 100%;
          box-sizing: border-box;
        }
        .contact-info-card {
          background: #FFFFFF;
          border: 1px solid #E8E0D0;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(60,50,30,0.05);
          padding: 36px 32px;
          height: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        /* ── form labels ── */
        .form-label {
          display: block;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          letter-spacing: 0.12em;
          color: #888880;
          text-transform: uppercase;
          font-weight: 400;
          margin-bottom: 8px;
        }

        /* ── inputs ── */
        .form-input, .form-select {
          border: none;
          border-bottom: 1px solid #C8C0B0;
          border-radius: 0;
          background: transparent;
          padding: 8px 0;
          font-family: 'Jost', sans-serif;
          font-size: 15px;
          color: #2C2C2A;
          width: 100%;
          outline: none;
          appearance: none;
          -webkit-appearance: none;
        }
        .form-input::placeholder { color: #AAAAAA; }
        .form-select {
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7' viewBox='0 0 12 7'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23AAAAAA' stroke-width='1.2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 2px center;
          padding-right: 20px;
        }
        .form-select option[value=''] { color: #AAAAAA; }

        /* ── animated focus underline ── */
        .form-field-wrap { position: relative; }
        .form-field-wrap::after {
          content: '';
          position: absolute;
          bottom: 0; left: 50%;
          width: 0; height: 1.5px;
          background: #C9A96E;
          transition: width 0.28s ease, left 0.28s ease;
        }
        .form-field-wrap:focus-within::after { left: 0; width: 100%; }

        /* ── textarea ── */
        .form-textarea {
          border: 1px solid #C8C0B0;
          border-radius: 8px;
          padding: 12px;
          font-family: 'Jost', sans-serif;
          font-size: 15px;
          color: #2C2C2A;
          width: 100%;
          min-height: 120px;
          outline: none;
          background: transparent;
          resize: vertical;
          transition: border-color 0.28s ease;
          box-sizing: border-box;
        }
        .form-textarea:focus { border-color: #C9A96E; }
        .form-textarea::placeholder { color: #AAAAAA; }

        /* ── form grid ── */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px 40px;
        }
        .form-field-full { grid-column: 1 / -1; }

        /* ── chip buttons ── */
        .chip-group { display: flex; flex-wrap: wrap; gap: 10px; }
        .chip-btn {
          font-family: 'Jost', sans-serif;
          font-size: 12.5px;
          letter-spacing: 0.03em;
          color: #6b6258;
          background: #FBF9F5;
          border: 1px solid #DDD3C0;
          border-radius: 999px;
          padding: 9px 18px;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.15s ease;
        }
        .chip-btn:hover { border-color: #C9A96E; color: #2C2C2A; }
        .chip-btn.selected {
          background: #C9A96E;
          border-color: #C9A96E;
          color: #FFFFFF;
          transform: translateY(-1px);
        }

        /* ── submit button shimmer ── */
        .contact-submit-btn {
          position: relative;
          overflow: hidden;
        }
        .contact-submit-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -80%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.18) 50%, transparent 100%);
          transform: skewX(-15deg);
          pointer-events: none;
        }
        .contact-submit-btn:hover::after {
          animation: submitShimmer 0.75s ease-in-out;
        }
        @keyframes submitShimmer {
          0%   { left: -80%; }
          100% { left: 120%; }
        }
        .contact-spin { animation: contactSpin 0.9s linear infinite; }
        @keyframes contactSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* ── WhatsApp button pulse glow ── */
        .contact-wa-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1.5px solid #25D366;
          color: #25D366;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 11px 20px;
          text-decoration: none;
          border-radius: 8px;
          position: relative;
          transition: background 0.25s ease, color 0.25s ease;
          animation: waGlow 3s ease-in-out infinite;
        }
        .contact-wa-btn:hover { background: #25D366; color: #fff; }
        @keyframes waGlow {
          0%, 60%, 100% { box-shadow: none; }
          30% { box-shadow: 0 0 14px rgba(37,211,102,0.55), 0 0 32px rgba(37,211,102,0.25); }
        }
        .contact-wa-btn::before {
          content: '';
          position: absolute;
          inset: -4px;
          border: 1.5px solid #25D366;
          border-radius: 10px;
          opacity: 0;
          animation: waPulse 3s ease-out infinite;
        }
        @keyframes waPulse {
          0%   { inset: -2px; opacity: 0.5; }
          40%  { inset: -10px; opacity: 0; }
          100% { inset: -10px; opacity: 0; }
        }

        /* ── responsive ── */
        @media (max-width: 640px) {
          .form-grid { grid-template-columns: 1fr; }
          .form-field-full { grid-column: 1; }
          .contact-form-card { padding: 24px; }
        }
        @media (max-width: 900px) {
          .contact-two-col { grid-template-columns: 1fr !important; }
          .contact-form-card, .contact-info-card { height: auto !important; }
        }
      `}</style>

      {/* ── Heading ── */}
      <section ref={headingRef} style={{ padding: '104px 24px 48px', textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
        <div style={{
          opacity: headingInView ? 1 : 0,
          transform: headingInView ? 'translateY(0)' : 'translateY(-28px)',
          transition: 'opacity 700ms ease-out, transform 700ms ease-out',
        }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#C9A96E', marginBottom: 16 }}>
            Reach Out
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: 'clamp(1.9rem, 4vw, 3.2rem)', color: '#262421', margin: '0 0 16px', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
            Let's Talk
          </h1>
          <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 15, color: '#7a7268', lineHeight: 1.8, maxWidth: 500, margin: '0 auto' }}>
            Every great project begins with a conversation. Tell us about your space and let's explore what's possible.
          </p>
        </div>
      </section>

      {/* ── Two-col layout ── */}
      <section ref={sectionRef} style={{ padding: '0 24px 96px' }}>
        <div
          className="contact-two-col"
          style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'stretch' }}
        >

          {/* ── LEFT — Enquiry Form ── */}
          <div style={{ height: '100%' }}>
            <div className="contact-form-card">
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888880', marginBottom: 32, ...fieldEl(0) }}>
                Enquiry Form
              </p>

              <form
                onSubmit={async e => {
                  e.preventDefault()
                  if (status === 'submitting') return
                  setStatus('submitting')
                  setErrorMsg('')
                  try {
                    await submitEnquiry(form)
                    window.location.href = '/thank-you'
                  } catch (err) {
                    setStatus('error')
                    setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
                  }
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: 0 }}
              >
                <div className="form-grid" style={{ marginBottom: 36 }}>

                  {/* Full Name */}
                  <div style={fieldEl(80)}>
                    <label className="form-label">Full Name <span style={{ color: '#C9A96E' }}>*</span></label>
                    <div className="form-field-wrap">
                      <input className="form-input" type="text" required placeholder="Jane Doe" value={form.fullName} onChange={set('fullName')} />
                    </div>
                  </div>

                  {/* Phone */}
                  <div style={fieldEl(180)}>
                    <label className="form-label">Phone Number <span style={{ color: '#C9A96E' }}>*</span></label>
                    <div className="form-field-wrap">
                      <input className="form-input" type="tel" required placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
                    </div>
                  </div>

                  {/* Email */}
                  <div style={fieldEl(280)}>
                    <label className="form-label">Email Address <span style={{ color: '#C9A96E' }}>*</span></label>
                    <div className="form-field-wrap">
                      <input className="form-input" type="email" required placeholder="jane@example.com" value={form.email} onChange={set('email')} />
                    </div>
                  </div>

                  {/* Type of Space */}
                  <div style={fieldEl(380)}>
                    <label className="form-label">Type of Space <span style={{ color: '#C9A96E' }}>*</span></label>
                    <div className="form-field-wrap">
                      <select className="form-select" required value={form.spaceType} onChange={set('spaceType')} style={{ color: form.spaceType === '' ? '#AAAAAA' : '#2C2C2A' }}>
                        <option value="" disabled>Select a space type</option>
                        {SPACE_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Project Location chips */}
                  <div className="form-field-full" style={fieldEl(460)}>
                    <label className="form-label" style={{ marginBottom: 12 }}>Project Location</label>
                    <div className="chip-group">
                      {LOCATIONS.map((opt, idx) => (
                        <span key={opt} style={chipEl(460 + idx * 70)}>
                          <button type="button" className={`chip-btn${form.location === opt ? ' selected' : ''}`} onClick={() => toggle('location')(opt)}>
                            {opt}
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Project Type chips */}
                  <div className="form-field-full" style={fieldEl(560)}>
                    <label className="form-label" style={{ marginBottom: 12 }}>Project Type</label>
                    <div className="chip-group">
                      {PROJECT_TYPES.map((opt, idx) => (
                        <span key={opt} style={chipEl(560 + idx * 70)}>
                          <button type="button" className={`chip-btn${form.projectType === opt ? ' selected' : ''}`} onClick={() => toggle('projectType')(opt)}>
                            {opt}
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Estimated Budget chips */}
                  <div className="form-field-full" style={fieldEl(680)}>
                    <label className="form-label" style={{ marginBottom: 12 }}>Estimated Budget</label>
                    <div className="chip-group">
                      {BUDGETS.map((opt, idx) => (
                        <span key={opt} style={chipEl(680 + idx * 70)}>
                          <button type="button" className={`chip-btn${form.budget === opt ? ' selected' : ''}`} onClick={() => toggle('budget')(opt)}>
                            {opt}
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* How Did You Hear */}
                  <div className="form-field-full" style={{ maxWidth: 340, ...fieldEl(780) }}>
                    <label className="form-label">How Did You Hear About Us?</label>
                    <div className="form-field-wrap">
                      <select className="form-select" value={form.referral} onChange={set('referral')} style={{ color: form.referral === '' ? '#AAAAAA' : '#2C2C2A' }}>
                        <option value="" disabled>Select an option</option>
                        {REFERRAL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Brief Requirements */}
                  <div className="form-field-full" style={fieldEl(860)}>
                    <label className="form-label">Brief Requirements</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Tell us about your project, style preferences, timeline..."
                      value={form.requirements}
                      onChange={set('requirements')}
                    />
                  </div>

                </div>

                {/* Submit */}
                <div style={fieldEl(1000)}>
                  <motion.button
                    type="submit"
                    className="contact-submit-btn"
                    disabled={status === 'submitting'}
                    whileHover={status === 'submitting' ? {} : { scale: 1.02, boxShadow: '0 8px 28px rgba(45,59,45,0.22)' }}
                    whileTap={status === 'submitting' ? {} : { scale: 0.97 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    style={{
                      width: '100%',
                      background: '#2D3B2D',
                      color: '#C9A96E',
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 13,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      fontWeight: 500,
                      padding: '18px 24px',
                      border: 'none',
                      cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                      opacity: status === 'submitting' ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      borderRadius: 8,
                    }}
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 size={14} className="contact-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        Claim My Free Layout Design <ArrowRight size={14} />
                      </>
                    )}
                  </motion.button>
                </div>

                {status === 'error' && (
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12.5, color: '#B85A4A', textAlign: 'center', marginTop: 14, marginBottom: 0 }}>
                    {errorMsg}
                  </p>
                )}

                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: '#9a9186', textAlign: 'center', marginTop: 16, marginBottom: 0, ...fieldEl(1080) }}>
                  We respect your privacy. No spam, just great design.
                </p>
              </form>
            </div>
          </div>

          {/* ── RIGHT — Info Card ── */}
          <div style={{
            height: '100%',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateX(0)' : 'translateX(52px)',
            transition: 'opacity 800ms cubic-bezier(0.22,1,0.36,1) 200ms, transform 800ms cubic-bezier(0.22,1,0.36,1) 200ms',
          }}>
            <div className="contact-info-card">

              {/* top section */}
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: 26, color: '#262421', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                  Nivora Interiors
                </h2>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 14, color: '#C9A96E', margin: '0 0 32px' }}>
                  From Vision to Execution
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <ContactRow icon={<MapPin size={13} />} iconStyle={iconEl(0)}>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888880', margin: '0 0 4px' }}>Location</p>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#2C2C2A', margin: 0, lineHeight: 1.5 }}>
                      Shop No. 01, New Dhavalgiri Building,<br />above Hindustan Co-Op Bank,<br />Ambernath East, Maharashtra 421501
                    </p>
                  </ContactRow>

                  <ContactRow icon={<Phone size={13} />} iconStyle={iconEl(1)}>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888880', margin: '0 0 4px' }}>Phone</p>
                    <a href="tel:+917276687805" style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#2C2C2A', textDecoration: 'none' }}>
                      +91 72766 87805
                    </a>
                  </ContactRow>

                  <ContactRow icon={<Mail size={13} />} iconStyle={iconEl(2)}>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888880', margin: '0 0 4px' }}>Email</p>
                    <a href="mailto:nivora.inbox@gmail.com" style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#2C2C2A', textDecoration: 'none' }}>
                      nivora.inbox@gmail.com
                    </a>
                  </ContactRow>
                </div>
              </div>

              {/* middle — WhatsApp + Hours */}
              <div>
                <div style={{ borderTop: '1px solid #E8E0D0', paddingTop: 28 }}>
                  <a
                    href="https://wa.me/917276687805?text=Hello%2C%20I%20am%20interested%20in%20your%20interior%20design%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-wa-btn"
                  >
                    <MessageCircle size={13} />
                    Chat on WhatsApp <ArrowRight size={11} />
                  </a>
                </div>

                <div style={{ borderTop: '1px solid #E8E0D0', marginTop: 28, paddingTop: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <Clock size={13} style={{ color: '#C9A96E', flexShrink: 0 }} />
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888880', margin: 0 }}>
                      Studio Hours
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: '#2C2C2A', margin: 0 }}>
                      Monday – Saturday: 10:00 AM – 7:00 PM
                    </p>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: '#888880', margin: 0, fontStyle: 'italic' }}>
                      Sunday: By appointment only
                    </p>
                  </div>
                </div>
              </div>

              {/* bottom — privacy note */}
              <div style={{ padding: '14px 18px', border: '1px solid #E8E0D0', borderRadius: 12, background: 'rgba(245,240,232,0.5)' }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 13, color: '#888880', margin: 0, lineHeight: 1.6 }}>
                  "We respect your privacy. No spam, just great design."
                </p>
              </div>

              {/* Google Maps embed — fills remaining card height */}
              <div style={{ flex: 1, minHeight: 220, borderRadius: 12, overflow: 'hidden', marginTop: 8 }}>
                <iframe
                  title="Nivora Interiors Location"
                  src="https://maps.google.com/maps?q=New+Dhavalgiri+Building,+Ambernath+East,+Maharashtra+421501,+India&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: 'block', minHeight: 220 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

            </div>
          </div>

        </div>
      </section>
    </div>
  )
}

/* ── Contact detail row with animated icon ── */
function ContactRow({ icon, children, iconStyle }: { icon: React.ReactNode; children: React.ReactNode; iconStyle?: React.CSSProperties }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
      <motion.div
        whileHover={{ rotate: [0, -8, 8, -4, 0], transition: { duration: 0.4, ease: 'easeInOut' } }}
        style={{
          width: 36,
          height: 36,
          border: '1px solid rgba(201,169,110,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          borderRadius: 8,
          color: '#C9A96E',
          cursor: 'default',
          ...iconStyle,
        }}
      >
        {icon}
      </motion.div>
      <div>{children}</div>
    </div>
  )
}
