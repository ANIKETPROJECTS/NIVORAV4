import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, MessageCircle, ArrowRight, Clock } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

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

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const toggle = (field: 'location' | 'projectType' | 'budget') => (value: string) =>
    setForm(f => ({ ...f, [field]: f[field] === value ? '' : value }))

  return (
    <div className="contact-page" style={{ background: '#F5F0E8' }}>
      <style>{`
        .contact-form-card, .contact-info-card {
          background-color: #FFFFFF;
          border: 1px solid #E8E0D0;
          border-radius: 16px;
        }
        .contact-form-card { padding: 40px; box-shadow: 0 4px 24px rgba(60,50,30,0.05); }
        .contact-info-card { box-shadow: 0 4px 24px rgba(60,50,30,0.05); }

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

        .form-field-wrap {
          position: relative;
          padding-bottom: 0;
        }
        .form-field-wrap::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 1.5px;
          background: #C9A96E;
          transition: width 0.28s ease, left 0.28s ease;
        }
        .form-field-wrap:focus-within::after {
          left: 0;
          width: 100%;
        }

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
        }
        .form-textarea:focus { border-color: #C9A96E; }
        .form-textarea::placeholder { color: #AAAAAA; }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px 40px;
        }
        .form-field-full { grid-column: 1 / -1; }

        /* ── chip / toggle buttons ── */
        .chip-group {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
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

        @media (max-width: 640px) {
          .form-grid { grid-template-columns: 1fr; }
          .form-field-full { grid-column: 1; }
          .contact-form-card { padding: 24px; }
        }
        @media (max-width: 900px) {
          .contact-two-col { grid-template-columns: 1fr !important; }
        }

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
        }
        .contact-wa-btn:hover { background: #25D366; color: #fff; }
        .contact-wa-btn::before {
          content: '';
          position: absolute;
          inset: -4px;
          border: 1.5px solid #25D366;
          border-radius: 10px;
          opacity: 0;
          animation: waPulse 2.8s ease-out infinite;
        }
        @keyframes waPulse {
          0%   { inset: -2px; opacity: 0.6; }
          100% { inset: -10px; opacity: 0; }
        }
      `}</style>

      {/* ── Header ── */}
      <section style={{ padding: '104px 24px 48px', textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }}>
          <motion.p variants={fadeUp} custom={0}
            style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#C9A96E', marginBottom: 16 }}>
            Reach Out
          </motion.p>
          <motion.h1 variants={fadeUp} custom={0.1}
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 'clamp(1.9rem, 4vw, 3.2rem)', color: '#21291a', margin: '0 0 16px', lineHeight: 1.1 }}>
            Let's Talk
          </motion.h1>
          <motion.p variants={fadeUp} custom={0.2}
            style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 15, color: '#7a7268', lineHeight: 1.8, maxWidth: 500, margin: '0 auto' }}>
            Every great project begins with a conversation. Tell us about your space and let's explore what's possible.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Form + Info card ── */}
      <section style={{ padding: '0 24px 96px' }}>
        <div
          className="contact-two-col"
          style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}
        >

          {/* LEFT — Enquiry Form */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUp} custom={0}>
            <div className="contact-form-card">
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888880', marginBottom: 32 }}>
                Enquiry Form
              </p>

              <form
                onSubmit={e => { e.preventDefault(); window.location.href = '/thank-you' }}
                style={{ display: 'flex', flexDirection: 'column', gap: 0 }}
              >
                <div className="form-grid" style={{ marginBottom: 36 }}>

                  {/* Full Name / Phone */}
                  <div>
                    <label className="form-label">Full Name <span style={{ color: '#C9A96E' }}>*</span></label>
                    <div className="form-field-wrap">
                      <input className="form-input" type="text" required placeholder="Jane Doe" value={form.fullName} onChange={set('fullName')} />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Phone Number <span style={{ color: '#C9A96E' }}>*</span></label>
                    <div className="form-field-wrap">
                      <input className="form-input" type="tel" required placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
                    </div>
                  </div>

                  {/* Email / Type of Space */}
                  <div>
                    <label className="form-label">Email Address <span style={{ color: '#C9A96E' }}>*</span></label>
                    <div className="form-field-wrap">
                      <input className="form-input" type="email" required placeholder="jane@example.com" value={form.email} onChange={set('email')} />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Type of Space <span style={{ color: '#C9A96E' }}>*</span></label>
                    <div className="form-field-wrap">
                      <select className="form-select" required value={form.spaceType} onChange={set('spaceType')} style={{ color: form.spaceType === '' ? '#AAAAAA' : '#2C2C2A' }}>
                        <option value="" disabled>Select a space type</option>
                        {SPACE_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Project Location — chips */}
                  <div className="form-field-full">
                    <label className="form-label">Project Location</label>
                    <div className="chip-group">
                      {LOCATIONS.map(opt => (
                        <button
                          type="button"
                          key={opt}
                          className={`chip-btn${form.location === opt ? ' selected' : ''}`}
                          onClick={() => toggle('location')(opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Project Type — chips */}
                  <div className="form-field-full">
                    <label className="form-label">Project Type</label>
                    <div className="chip-group">
                      {PROJECT_TYPES.map(opt => (
                        <button
                          type="button"
                          key={opt}
                          className={`chip-btn${form.projectType === opt ? ' selected' : ''}`}
                          onClick={() => toggle('projectType')(opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Estimated Budget — chips */}
                  <div className="form-field-full">
                    <label className="form-label">Estimated Budget</label>
                    <div className="chip-group">
                      {BUDGETS.map(opt => (
                        <button
                          type="button"
                          key={opt}
                          className={`chip-btn${form.budget === opt ? ' selected' : ''}`}
                          onClick={() => toggle('budget')(opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* How Did You Hear About Us */}
                  <div className="form-field-full" style={{ maxWidth: 340 }}>
                    <label className="form-label">How Did You Hear About Us?</label>
                    <div className="form-field-wrap">
                      <select className="form-select" value={form.referral} onChange={set('referral')} style={{ color: form.referral === '' ? '#AAAAAA' : '#2C2C2A' }}>
                        <option value="" disabled>Select an option</option>
                        {REFERRAL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Brief Requirements */}
                  <div className="form-field-full">
                    <label className="form-label">Brief Requirements</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Tell us about your project, style preferences, timeline..."
                      value={form.requirements}
                      onChange={set('requirements')}
                    />
                  </div>

                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03, boxShadow: '0 8px 28px rgba(45,59,45,0.22)' }}
                  whileTap={{ scale: 0.97 }}
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
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    borderRadius: 8,
                  }}
                >
                  Claim My Free Layout Design <ArrowRight size={14} />
                </motion.button>

                <p style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 12,
                  color: '#9a9186',
                  textAlign: 'center',
                  marginTop: 16,
                  marginBottom: 0,
                }}>
                  We respect your privacy. No spam, just great design.
                </p>
              </form>
            </div>
          </motion.div>

          {/* RIGHT — Info Card */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUp} custom={0.15}>
            <div className="contact-info-card" style={{ padding: '36px 32px' }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 26, color: '#21291a', margin: '0 0 4px' }}>
                Nivora Interiors
              </h2>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 14, color: '#C9A96E', margin: '0 0 32px' }}>
                From Vision to Execution
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                <ContactRow icon={<MapPin size={13} />}>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888880', margin: '0 0 4px' }}>Location</p>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#2C2C2A', margin: 0, lineHeight: 1.5 }}>
                    Shop No. 01, New Dhavalgiri Building,<br />above Hindustan Co-Op Bank,<br />Ambernath East, Maharashtra 421501
                  </p>
                </ContactRow>

                <ContactRow icon={<Phone size={13} />}>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888880', margin: '0 0 4px' }}>Phone</p>
                  <a href="tel:+917276687805" style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#2C2C2A', textDecoration: 'none' }}>
                    +91 72766 87805
                  </a>
                </ContactRow>

                <ContactRow icon={<Mail size={13} />}>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888880', margin: '0 0 4px' }}>Email</p>
                  <a href="mailto:nivora.inbox@gmail.com" style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#2C2C2A', textDecoration: 'none' }}>
                    nivora.inbox@gmail.com
                  </a>
                </ContactRow>

              </div>

              <div style={{ borderTop: '1px solid #E8E0D0', marginTop: 28, paddingTop: 28 }}>
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

              <div style={{
                marginTop: 24,
                padding: '14px 18px',
                border: '1px solid #E8E0D0',
                borderRadius: 12,
                background: 'rgba(245,240,232,0.5)',
              }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: 'italic',
                  fontSize: 13,
                  color: '#888880',
                  margin: 0,
                  lineHeight: 1.6,
                }}>
                  "We respect your privacy. No spam, just great design."
                </p>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

    </div>
  )
}

/* ── Animated contact detail row — icon bounces on hover ── */
function ContactRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
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
        }}
      >
        {icon}
      </motion.div>
      <div>{children}</div>
    </div>
  )
}
