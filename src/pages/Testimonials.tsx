import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const testimonials = [
  {
    stars: 5,
    text: 'NIVORA completely transformed our apartment in Bandra. What struck us most was how well Shweta understood what we wanted before we could even articulate it ourselves. The final space feels like us — calm, warm, and beautifully considered.',
    name: 'Priya & Rohan Khanna',
    location: 'Bandra West, Mumbai',
    project: 'RESIDENTIAL — 3BHK APARTMENT',
    initials: 'PK',
  },
  {
    stars: 5,
    text: 'Shweta has an extraordinary ability to translate a vague feeling into a very precise space. We came to her with mood boards and half-formed ideas, and she turned them into a home that is exactly what we wanted — and more.',
    name: 'Ananya & Siddharth Mehta',
    location: 'Juhu, Mumbai',
    project: 'RESIDENTIAL — PENTHOUSE',
    initials: 'AM',
  },
  {
    stars: 5,
    text: 'Working with NIVORA on our co-working space was an excellent decision. They understood exactly what a creative workspace should feel like — productive but never sterile, professional but warm.',
    name: 'Nikhil Desai',
    location: 'Winjuvadi, Pune',
    project: 'COMMERCIAL — CO-WORKING SPACE',
    initials: 'ND',
  },
  {
    stars: 5,
    text: 'Our café has become one of the most photographed spots in Pune. Every corner was designed with intention. The team was professional, transparent, and genuinely talented. What they delivered exceeded everything we imagined.',
    name: 'Aditya Shinde',
    location: 'FC Road, Pune',
    project: 'COMMERCIAL — CAFE INTERIOR',
    initials: 'AS',
  },
  {
    stars: 5,
    text: 'Our showroom went from generic to extraordinary. The design draws people in from the street and makes them linger. We have had multiple clients mention how beautiful the space is before they even look at the products.',
    name: 'Kavya Nair',
    location: 'Andheri, Mumbai',
    project: 'COMMERCIAL — LUXURY SHOWROOM',
    initials: 'KN',
  },
  {
    stars: 5,
    text: 'The turnkey process was seamless. We handed over the keys and came back to a completed home that required no corrections, no touch-ups, and no follow-ups. That kind of reliability is rare.',
    name: 'Swati & Arjun Kulkarni',
    location: 'Thane, Mumbai',
    project: 'RESIDENTIAL — STUDIO APARTMENT',
    initials: 'SK',
  },
  {
    stars: 5,
    text: 'Nivora took my vision and refined it into something I never thought possible. Their material selection is impeccable.',
    name: 'Aditi R.',
    location: 'Ambernath',
    project: 'RESIDENTIAL — HOME INTERIOR',
    initials: 'AR',
  },
]

const stats = [
  { value: '50+', label: 'Projects Completed' },
  { value: '5+', label: 'Years of Design Excellence' },
  { value: '100%', label: 'On-Time Handover' },
]

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
})

const fadeDown = (delay = 0) => ({
  hidden: { opacity: 0, y: -15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
})

function ProjectBadge({ project }: { project: string }) {
  const isResidential = project.startsWith('RESIDENTIAL')
  return (
    <span style={{
      display: 'inline-block',
      fontFamily: "'Jost', sans-serif",
      fontSize: 9,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      padding: '3px 8px',
      borderRadius: 6,
      lineHeight: 1.6,
      background: isResidential ? 'rgba(161,134,97,0.12)' : 'rgba(95,116,94,0.12)',
      color: isResidential ? '#a18661' : '#5f745e',
      border: `1px solid ${isResidential ? 'rgba(161,134,97,0.35)' : 'rgba(95,116,94,0.35)'}`,
    }}>
      {project}
    </span>
  )
}

function TestimonialCard({ t, index }: { t: typeof testimonials[0]; index: number }) {
  const colDelay = (index % 3) * 0.15

  return (
    <motion.div
      variants={fadeUp(colDelay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      <div
        className="testimonial-card"
        style={{
          background: '#ffffff',
          border: '1px solid rgba(95,116,94,0.25)',
          borderRadius: 16,
          padding: 32,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = '#5f745e'
          el.style.borderWidth = '1.5px'
          el.style.transform = 'translateY(-5px)'
          el.style.background = '#faf9f6'
          el.style.boxShadow = '0 12px 36px rgba(33,41,26,0.10)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'rgba(95,116,94,0.35)'
          el.style.borderWidth = '1px'
          el.style.transform = 'translateY(0)'
          el.style.background = '#ffffff'
          el.style.boxShadow = 'none'
        }}
      >
        {/* Decorative large quote mark */}
        <span style={{
          position: 'absolute',
          top: 16,
          right: 20,
          fontSize: 64,
          lineHeight: 1,
          color: '#a18661',
          fontFamily: "'Cormorant Garamond', serif",
          opacity: 0.22,
          pointerEvents: 'none',
          userSelect: 'none',
        }}>"</span>

        {/* Stars */}
        <div style={{ fontSize: 14, color: '#a18661', letterSpacing: 2, marginBottom: 16 }}>
          {'★'.repeat(t.stars)}
        </div>

        {/* Review text */}
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: 16,
          lineHeight: 1.8,
          color: '#2c2c2c',
          flex: 1,
          marginBottom: 0,
        }}>
          "{t.text}"
        </p>

        {/* Divider */}
        <div style={{
          width: 40,
          height: 1,
          background: '#a18661',
          margin: '20px 0',
          flexShrink: 0,
        }} />

        {/* Client info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: '#a18661',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Jost', sans-serif",
            fontWeight: 700,
            fontSize: 12,
            flexShrink: 0,
            letterSpacing: '0.5px',
          }}>
            {t.initials}
          </div>
          <div>
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 500,
              fontSize: 14,
              color: '#21291a',
              margin: 0,
            }}>{t.name}</p>
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#a18661',
              margin: '3px 0 0',
            }}>{t.location}</p>
          </div>
        </div>

        {/* Project badge */}
        <ProjectBadge project={t.project} />
      </div>
    </motion.div>
  )
}

export default function Testimonials() {
  return (
    <div style={{ background: '#f5f2ed', minHeight: '100vh' }}>

      {/* Page Hero */}
      <section style={{ paddingTop: 140, paddingBottom: 60, textAlign: 'center', paddingLeft: 24, paddingRight: 24 }}>
        <motion.p
          variants={fadeDown(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 11,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#a18661',
            marginBottom: 16,
          }}
        >Client Stories</motion.p>

        <motion.h1
          variants={fadeUp(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            color: '#21291a',
            margin: '0 0 20px',
            lineHeight: 1.1,
          }}
        >What Clients Say</motion.h1>

        <motion.p
          variants={fadeUp(0.3)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: 15,
            color: 'rgba(33,41,26,0.55)',
            maxWidth: 560,
            margin: '0 auto',
            lineHeight: 1.75,
          }}
        >
          Every project is a relationship. These are the words of people who trusted us with their spaces.
        </motion.p>
      </section>

      {/* Cards Grid */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 24px 80px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}
          className="testi-grid"
        >
          <style>{`
            @media (max-width: 1024px) {
              .testi-grid { grid-template-columns: repeat(2, 1fr) !important; }
            }
            @media (max-width: 640px) {
              .testi-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} t={t} index={i} />
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ background: '#ffffff', borderTop: '1px solid rgba(95,116,94,0.18)', borderBottom: '1px solid rgba(95,116,94,0.18)', padding: '64px 24px' }}>
        <div
          style={{
            maxWidth: 900,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0,
            flexWrap: 'wrap',
          }}
          className="stats-bar"
        >
          <style>{`
            .stats-bar-item + .stats-bar-item {
              border-left: 1px solid rgba(95,116,94,0.22);
            }
            @media (max-width: 640px) {
              .stats-bar { flex-direction: column !important; }
              .stats-bar-item + .stats-bar-item {
                border-left: none !important;
                border-top: 1px solid rgba(95,116,94,0.22);
              }
            }
          `}</style>
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className="stats-bar-item"
              variants={fadeUp(i * 0.12)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              style={{ flex: 1, textAlign: 'center', padding: '16px 40px', minWidth: 180 }}
            >
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 400,
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                color: '#21291a',
                margin: '0 0 8px',
                lineHeight: 1,
              }}>{s.value}</p>
              <p style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 400,
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(33,41,26,0.5)',
                margin: 0,
              }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ background: '#f5f2ed', padding: '80px 24px', textAlign: 'center' }}>
        <motion.div
          variants={fadeUp(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            color: '#21291a',
            margin: '0 0 16px',
          }}>Ready to transform your space?</h2>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: 15,
            color: 'rgba(33,41,26,0.55)',
            maxWidth: 480,
            margin: '0 auto 40px',
            lineHeight: 1.75,
          }}>
            Claim your Free Layout Consultation today and let us start building your dream.
          </p>
          <Link
            to="/quote"
            style={{
              display: 'inline-block',
              background: '#21291a',
              color: '#f5f2ed',
              fontFamily: "'Jost', sans-serif",
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '16px 40px',
              borderRadius: 12,
              textDecoration: 'none',
              transition: 'background 0.3s ease, transform 0.3s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = '#5f745e'
              el.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = '#21291a'
              el.style.transform = 'translateY(0)'
            }}
          >
            Claim My Free Offer Now
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
