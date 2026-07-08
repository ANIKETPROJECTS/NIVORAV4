import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import FadeIn from '../components/FadeIn'
import { Link } from 'react-router-dom'
import { ArrowRight, Lightbulb, Gem, Heart, Wrench, ShieldCheck, Target, Compass } from 'lucide-react'
import founderPhoto from '@assets/WhatsApp_Image_2026-07-08_at_20.50.13_1783534790416.jpeg'

/* ─── DATA ──────────────────────────────────────────────── */
const values = [
  { title: 'Thoughtful Design',       desc: 'Every decision is intentional. We never add without asking why.',          Icon: Lightbulb   },
  { title: 'Timeless Elegance',       desc: 'We design for years, not seasons. Quality over trend.',                    Icon: Gem         },
  { title: 'Personal Connection',     desc: 'We listen before we design. Your life shapes your space.',                 Icon: Heart       },
  { title: 'Quality & Craftsmanship', desc: 'Refined materials, skilled execution, no shortcuts.',                      Icon: Wrench      },
  { title: 'Trust & Transparency',    desc: 'Clear timelines, honest communication, no surprises.',                     Icon: ShieldCheck },
]

const statsData = [
  { value: 25,  suffix: '+', label: 'Clients Served',         duration: 1800 },
  { value: 2,   suffix: '',  label: 'Years of Experience',    duration: 1200 },
  { value: 2,   suffix: '',  label: 'Cities — Mumbai & Pune', duration: 1200 },
  { value: 100, suffix: '%', label: 'End-to-End Solutions',   duration: 1600 },
]

const offerings = [
  'Home interiors — 1BHK, 2BHK, 3BHK apartments & villas',
  'Office and workspace design',
  'Showrooms and retail spaces',
  'Cafés and hospitality interiors',
]

const founderImg = founderPhoto
const studioImg  = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80'

/* ─── TYPOGRAPHY — matches Services page ────────────────── */
const LABEL: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontWeight: 300,
  fontSize: 10,
  letterSpacing: '0.44em',
  textTransform: 'uppercase',
  color: '#a18661',
  marginBottom: 20,
}

const H2: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif",
  fontWeight: 300,
  fontSize: 'clamp(2rem, 3.5vw, 3.25rem)',
  letterSpacing: '-0.01em',
  color: '#21291a',
  lineHeight: 1.2,
  marginBottom: 32,
}

const BODY: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontWeight: 300,
  fontSize: 14,
  lineHeight: 1.78,
  color: '#5c5c5c',
}

/* ─── ANIMATION VARIANTS ────────────────────────────────── */
const listContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const bulletVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
}
const valuesContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
}
const valueItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
}
const mvContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}
const mvBoxVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
}

/* ─── FOUNDER SECTION — scroll-triggered stagger animation ─ */
const FOUNDER_TEXT_DELAYS = [0, 130, 260, 390, 520, 650, 780]

function FounderSection({ founderImg }: { founderImg: string }) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15 })

    el.querySelectorAll('.founder-animate, .founder-image-wrap')
      .forEach(node => observer.observe(node))

    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-24" style={{ background: '#f5f2ed', borderTop: '1px solid rgba(161,134,97,0.15)' }}>
      <div ref={sectionRef} className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-stretch">
        <div>
          <p className="founder-animate" style={{ ...LABEL, transitionDelay: `${FOUNDER_TEXT_DELAYS[0]}ms` }}>The Founder</p>
          <h2 className="founder-animate" style={{ ...H2, transitionDelay: `${FOUNDER_TEXT_DELAYS[1]}ms` }}>Shweta Mahadik</h2>
          <p className="founder-animate" style={{ ...LABEL, letterSpacing: '0.2em', marginBottom: 32, color: 'rgba(33,41,26,0.45)', transitionDelay: `${FOUNDER_TEXT_DELAYS[2]}ms` }}>
            Founder & Principal Designer
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 40 }}>
            <p className="founder-animate" style={{ ...BODY, transitionDelay: `${FOUNDER_TEXT_DELAYS[3]}ms` }}>Shweta brings a rare combination of civil engineering precision and interior design sensibility to every project. Her background in construction gives her an instinctive understanding of how spaces are built — not just how they look — which translates into designs that are both beautiful and structurally sound.</p>
            <p className="founder-animate" style={{ ...BODY, transitionDelay: `${FOUNDER_TEXT_DELAYS[4]}ms` }}>Her approach is hands-on and deeply personal. She visits every project site herself, works closely with craftspeople, and maintains direct communication with clients throughout the process.</p>
            <p className="founder-animate" style={{ ...BODY, transitionDelay: `${FOUNDER_TEXT_DELAYS[5]}ms` }}>For Shweta, good design is not about decoration. It is about creating environments that make everyday life calmer, more considered, and more enjoyable.</p>
          </div>
          <blockquote className="founder-animate" style={{ borderLeft: '2px solid #a18661', background: 'rgba(161,134,97,0.06)', borderRadius: '0 6px 6px 0', padding: '20px 24px', transitionDelay: `${FOUNDER_TEXT_DELAYS[6]}ms` }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300, fontSize: '1.2rem', color: '#2c2c2c', lineHeight: 1.65, marginBottom: 12 }}>
              "For me, design is not about decoration. It is about creating spaces that feel calm, meaningful, and effortless to live in."
            </p>
            <cite style={{ ...LABEL, fontStyle: 'normal', marginBottom: 0, display: 'block', color: '#a18661' }}>— Shweta Mahadik</cite>
          </blockquote>
        </div>
        <div className="founder-image-wrap overflow-hidden" style={{ borderRadius: 4, height: '100%' }}>
          <img src={founderImg} alt="Shweta Mahadik — Founder, NIVORA Interiors" className="w-full h-full object-cover object-bottom hover:scale-105 transition-transform duration-700" loading="lazy" />
        </div>
      </div>
    </section>
  )
}

/* ─── STATS COUNTER — clean count-up, no dip ────────────── */
function AboutStatsSection() {
  const [counts, setCounts] = useState(statsData.map(() => 0))
  const startedRef = useRef(false)   // ref, not state — never triggers re-render/cleanup
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const rafIds: number[] = []

    const startCounting = () => {
      if (startedRef.current) return
      startedRef.current = true
      statsData.forEach((stat, i) => {
        const startTime = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - startTime) / stat.duration, 1)
          const eased = 1 - Math.pow(1 - progress, 4)          // ease-out quartic
          const val = Math.round(stat.value * eased)
          setCounts(prev => { const n = [...prev]; n[i] = val; return n })
          if (progress < 1) {
            rafIds[i] = requestAnimationFrame(tick)
          } else {
            setCounts(prev => { const n = [...prev]; n[i] = stat.value; return n })
          }
        }
        rafIds[i] = requestAnimationFrame(tick)
      })
    }

    // IntersectionObserver for scroll-triggered start
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) startCounting()
    }, { threshold: 0.2 })
    observer.observe(el)

    // If section is already in viewport on mount, start immediately
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) startCounting()

    return () => {
      observer.disconnect()
      rafIds.forEach(id => cancelAnimationFrame(id))
    }
  }, [])   // run once — startedRef prevents double-start

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#f5f2ed',
        borderTop: '1px solid rgba(161,134,97,0.2)',
        borderBottom: '1px solid rgba(161,134,97,0.2)',
        padding: '72px 24px',
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }} className="about-stats-grid">
        <style>{`
          @media (max-width: 640px) {
            .about-stats-grid { grid-template-columns: repeat(2,1fr) !important; }
            .about-stats-item + .about-stats-item { border-left: none !important; border-top: 1px solid rgba(161,134,97,0.18) !important; }
          }
          .about-stats-item + .about-stats-item { border-left: 1px solid rgba(161,134,97,0.18); }
        `}</style>
        {statsData.map((stat, i) => (
          <FadeIn key={i} delay={i * 0.1} className="about-stats-item" direction="up">
            <div style={{ textAlign: 'center', padding: '12px 24px' }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: 'clamp(2.4rem, 4.5vw, 3.2rem)',
                lineHeight: 1,
                color: '#a18661',
                margin: '0 0 10px',
              }}>
                {counts[i]}{stat.suffix}
              </p>
              <p style={{ ...LABEL, marginBottom: 0 }}>{stat.label}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

/* ─── MISSION / VISION BOX ──────────────────────────────── */
function MvBox({ type, text }: { type: 'mission' | 'vision'; text: string }) {
  const [hovered, setHovered] = useState(false)
  const isMission = type === 'mission'
  const Icon = isMission ? Target : Compass
  const label = isMission ? 'Mission' : 'Vision'
  const bgTint = isMission ? 'rgba(161,134,97,0.055)' : 'rgba(95,116,94,0.04)'

  return (
    <motion.div
      variants={mvBoxVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: bgTint,
        border: '1px solid rgba(161,134,97,0.22)',
        borderTop: `4px solid ${hovered ? '#c8a97e' : '#a18661'}`,
        borderRadius: 6,
        padding: '32px 36px 36px',
        cursor: 'default',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 16px 40px rgba(33,41,26,0.1)' : '0 2px 8px rgba(33,41,26,0.04)',
        transition: 'transform 0.28s ease, box-shadow 0.28s ease, border-top-color 0.28s ease',
      }}
    >
      <div style={{ marginBottom: 14 }}>
        <Icon size={24} color="#a18661" strokeWidth={1.4} />
      </div>
      <p style={{ ...LABEL, fontSize: 11, letterSpacing: '0.5em', fontWeight: 500 }}>{label.toUpperCase()}</p>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(1.25rem, 2.2vw, 1.5rem)', color: '#21291a', lineHeight: 1.5, margin: 0 }}>
        {text}
      </p>
    </motion.div>
  )
}

/* ─── SINGLE VALUE ITEM — flex layout, no overlap ───────── */
function ValueItem({ v, index }: { v: typeof values[0]; index: number }) {
  const [hovered, setHovered] = useState(false)
  const num = String(index + 1).padStart(2, '0')

  return (
    <motion.div
      variants={valueItemVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', gap: 0, alignItems: 'flex-start', paddingBottom: 28 }}
    >
      {/* Left column — large number */}
      <div
        className="value-num-col"
        style={{
          flexShrink: 0,
          width: 52,
          paddingTop: 4,
        }}
      >
        <span
          className="value-num"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            lineHeight: 1,
            color: '#a18661',
            opacity: hovered ? 0.35 : 0.18,
            userSelect: 'none',
            transition: 'opacity 0.25s ease',
            display: 'block',
          }}
        >{num}</span>
      </div>

      {/* Right column — icon + title + desc + divider */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
          <v.Icon size={14} color="#a18661" strokeWidth={1.5} style={{ flexShrink: 0 }} />
          <h4 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: '1.2rem',
            letterSpacing: '0.01em',
            color: hovered ? '#a18661' : '#21291a',
            transition: 'color 0.25s ease',
            margin: 0,
            lineHeight: 1.3,
          }}>{v.title}</h4>
        </div>
        <p style={{ ...BODY, fontSize: 13, marginBottom: 20 }}>{v.desc}</p>
        {/* Hover-draw divider */}
        <div style={{ position: 'relative', height: 1, background: 'rgba(161,134,97,0.18)', borderRadius: 1, overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: '#a18661',
            borderRadius: 1,
            transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left center',
            transition: 'transform 0.3s ease',
          }} />
        </div>
      </div>

      {/* Responsive number sizing */}
      <style>{`
        .value-num { font-size: 56px; }
        .value-num-col { width: 52px; }
        @media (max-width: 768px) {
          .value-num { font-size: 38px !important; }
          .value-num-col { width: 40px !important; }
        }
        @media (max-width: 480px) {
          .value-num { font-size: 32px !important; }
          .value-num-col { width: 36px !important; }
        }
      `}</style>
    </motion.div>
  )
}

/* ─── MAIN PAGE ─────────────────────────────────────────── */
export default function About() {
  return (
    <div style={{ background: '#f5f2ed' }} className="pt-20">

      {/* HERO */}
      <section className="relative py-24 px-6 overflow-hidden" style={{ background: '#f5f2ed' }}>
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #a18661 0%, transparent 60%)' }} />
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <FadeIn>
            <p style={LABEL}>Our Story</p>
            <h1 style={{ ...H2, fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', marginBottom: 24 }}>
              Design With<br /><em style={{ color: '#a18661', fontStyle: 'italic' }}>Purpose & Craft</em>
            </h1>
            <p style={{ ...BODY, maxWidth: 560, margin: '0 auto', fontSize: 15 }}>
              NIVORA is a boutique interior design studio creating thoughtful, refined spaces that balance elegance with everyday functionality.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="py-24" style={{ background: '#f5f2ed', borderTop: '1px solid rgba(161,134,97,0.15)' }}>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <FadeIn direction="right">
            <div className="overflow-hidden" style={{ borderRadius: 4 }}>
              <img src={studioImg} alt="NIVORA Studio" className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
          </FadeIn>
          <FadeIn delay={0.2} direction="left">
            <p style={LABEL}>Who We Are</p>
            <h2 style={H2}>A Boutique Studio Built on Listening</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <p style={BODY}>Over the last two years, we've completed 25+ residential and commercial interior projects across Mumbai and Pune — designing homes and workspaces that feel personal, practical, and built to last.</p>
              <p style={BODY}>Every project begins with listening. We understand how clients live, work, and use their space before designing anything. We provide complete interior design and turnkey solutions with clear timelines and transparent communication.</p>
              <p style={BODY}>We currently design and execute projects across Mumbai and Pune, partnering with homeowners and businesses who value quality, clarity, and a seamless process.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* STATS */}
      <AboutStatsSection />

      {/* WHAT WE DESIGN + OUR VALUES */}
      <section className="py-28" style={{ background: '#f5f2ed' }}>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-start">

          {/* Left */}
          <div>
            <FadeIn>
              <p style={LABEL}>What We Design</p>
              <h2 style={H2}>Spaces That Work for Real Life</h2>
            </FadeIn>
            <motion.ul
              variants={listContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 18 }}
            >
              {offerings.map((o, i) => (
                <motion.li key={i} variants={bulletVariants} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, ...BODY }}>
                  <svg width="7" height="7" viewBox="0 0 8 8" style={{ flexShrink: 0, marginTop: 7 }} fill="#a18661">
                    <polygon points="4,0 8,4 4,8 0,4" />
                  </svg>
                  {o}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Right */}
          <div style={{ position: 'relative' }}>
            {/* Decorative circle */}
            <svg aria-hidden="true" style={{ position: 'absolute', top: '50%', right: -40, transform: 'translateY(-50%)', width: 320, height: 320, opacity: 0.05, pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 320 320">
              <circle cx="160" cy="160" r="150" fill="none" stroke="#a18661" strokeWidth="1.5" />
              <circle cx="160" cy="160" r="110" fill="none" stroke="#a18661" strokeWidth="0.75" />
            </svg>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <FadeIn delay={0.1}>
                <p style={LABEL}>Our Values</p>
              </FadeIn>
              <motion.div
                variants={valuesContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                {values.map((v, i) => <ValueItem key={i} v={v} index={i} />)}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="py-24" style={{ background: '#f5f2ed', borderTop: '1px solid rgba(161,134,97,0.15)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <p style={{ ...LABEL, textAlign: 'center', marginBottom: 48 }}>Our Purpose</p>
          </FadeIn>
          <motion.div
            variants={mvContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}
          >
            <MvBox type="mission" text="Create interiors that feel effortlessly luxurious and deeply personal." />
            <MvBox type="vision" text="Be a trusted design partner known for thoughtful luxury, timeless design, and interiors that enrich the way people live and work." />
          </motion.div>
        </div>
      </section>

      {/* THE FOUNDER */}
      <FounderSection founderImg={founderImg} />

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ background: '#21291a' }}>
        <FadeIn>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#f5f0e8', marginBottom: 20, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
            Let's design something<br />
            <em style={{ color: '#C9A96E' }}>meaningful together.</em>
          </h2>
          <p style={{ ...BODY, color: 'rgba(245,240,232,0.45)', marginBottom: 40, maxWidth: 360, margin: '0 auto 40px' }}>
            Book a free consultation and let's start with a conversation.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase px-12 py-5 hover:bg-[#d4b896] transition-all duration-300 font-medium"
            style={{ background: '#C9A96E', color: '#21291a' }}
          >
            Book Free Consultation <ArrowRight size={13} />
          </Link>
        </FadeIn>
      </section>

    </div>
  )
}
