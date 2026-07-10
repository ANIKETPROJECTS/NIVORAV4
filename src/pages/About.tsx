import { motion, useInView } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import FadeIn from '../components/FadeIn'
import { Link } from 'react-router-dom'
import { ArrowRight, Lightbulb, Gem, Heart, Wrench, ShieldCheck, Target, Compass } from 'lucide-react'
import founderPhoto from '@assets/WhatsApp_Image_2026-07-08_at_20.50.13_1783534790416.jpeg'

/* ─── Shared mobile breakpoint hook ─────────────────────── */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

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
  const isMobile = useIsMobile()

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
          // Desktop: animate once, then stop observing. Mobile: keep observing so it can replay.
          if (!isMobile) observer.unobserve(entry.target)
        } else if (isMobile) {
          entry.target.classList.remove('in-view')
        }
      })
    }, { threshold: 0.15 })

    el.querySelectorAll('.founder-animate, .founder-image-wrap')
      .forEach(node => observer.observe(node))

    return () => observer.disconnect()
  }, [isMobile])   // re-run when the breakpoint changes so observer/replay mode stays in sync with rendered state

  return (
    <section className={`py-24 about-section-pad${isMobile ? ' founder-mobile' : ''}`} style={{ background: '#f5f2ed', borderTop: '1px solid rgba(161,134,97,0.15)' }}>
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
  const startedRef = useRef(false)   // desktop: never triggers re-render/cleanup once started
  const sectionRef = useRef<HTMLElement>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    let rafIds: number[] = []

    const cancelRafs = () => {
      rafIds.forEach(id => cancelAnimationFrame(id))
      rafIds = []
    }

    const startCounting = () => {
      if (!isMobile && startedRef.current) return
      startedRef.current = true
      cancelRafs() // guard against overlapping runs (e.g. rapid mobile re-entry)
      if (isMobile) setCounts(statsData.map(() => 0))
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

    // IntersectionObserver for scroll-triggered start. Mobile: replay every re-entry.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) startCounting()
      else if (isMobile) { startedRef.current = false; cancelRafs() }
    }, { threshold: 0.2 })
    observer.observe(el)

    // If section is already in viewport on mount, start immediately
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) startCounting()

    return () => {
      observer.disconnect()
      cancelRafs()
    }
  }, [isMobile])   // re-run when the breakpoint changes so observer/replay mode stays in sync with rendered state

  return (
    <section
      ref={sectionRef}
      className="about-stats-section"
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
  const isMobile = useIsMobile()
  const ref = useRef<HTMLDivElement>(null)

  // Very low threshold (0.05) so even a sliver of the item triggers the animation on mobile.
  // No negative rootMargin on mobile — don't delay triggering.
  const inView = useInView(ref, { once: !isMobile, amount: isMobile ? 0.05 : 0.2 })

  // Fallback: if IntersectionObserver hasn't fired within 2s on mobile, force all items visible.
  const [forcedVisible, setForcedVisible] = useState(false)
  useEffect(() => {
    if (!isMobile) return
    const t = setTimeout(() => setForcedVisible(true), 2000)
    return () => clearTimeout(t)
  }, [isMobile])

  const mobileActive = isMobile && (inView || forcedVisible)
  const stagger = index * 0.12

  return (
    <motion.div
      ref={ref}
      variants={isMobile ? undefined : valueItemVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="value-item-row"
      style={{ display: 'flex', gap: 20, alignItems: 'flex-start', paddingBottom: 28 }}
    >
      {/* Left column — icon */}
      <div
        className="value-icon-col"
        style={{ flexShrink: 0, width: 40, paddingTop: 2, position: 'relative' }}
      >
        {/* Gold glow pulse — mobile only */}
        {isMobile && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={mobileActive ? { opacity: [0, 0.9, 0], scale: [0.6, 1.5, 1.9] } : { opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.9, delay: stagger, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: -4, borderRadius: '50%', background: 'radial-gradient(circle, rgba(161,134,97,0.55) 0%, transparent 70%)', pointerEvents: 'none' }}
          />
        )}
        {/* Icon — mobile uses only opacity+translateY (no scale: 0) so it's never invisible if animation stalls */}
        <motion.div
          initial={isMobile ? { opacity: 0, y: 10 } : undefined}
          animate={isMobile ? (mobileActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }) : undefined}
          transition={isMobile ? { duration: 0.4, ease: 'easeOut', delay: stagger } : undefined}
        >
          <v.Icon
            size={36}
            color="#a18661"
            strokeWidth={1.5}
            className="value-icon-svg"
            style={{
              flexShrink: 0,
              display: 'block',
              opacity: hovered ? 1 : 0.85,
              transition: 'opacity 0.25s ease, transform 0.25s ease',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />
        </motion.div>
      </div>

      {/* Right column — title + desc + divider */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Title — mobile uses only opacity+translateY (no x slide that can get clipped) */}
        <motion.h4
          initial={isMobile ? { opacity: 0, y: 12 } : undefined}
          animate={isMobile ? (mobileActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }) : undefined}
          transition={isMobile ? { duration: 0.4, ease: 'easeOut', delay: stagger + 0.12 } : undefined}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600,
            fontSize: '1.2rem',
            letterSpacing: '0.01em',
            color: hovered ? '#a18661' : '#21291a',
            transition: 'color 0.25s ease',
            margin: '0 0 8px',
            lineHeight: 1.3,
          }}
        >{v.title}</motion.h4>
        <motion.p
          initial={isMobile ? { opacity: 0, y: 12 } : undefined}
          animate={isMobile ? (mobileActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }) : undefined}
          transition={isMobile ? { duration: 0.4, ease: 'easeOut', delay: stagger + 0.22 } : undefined}
          style={{ ...BODY, fontSize: 13, marginBottom: 20 }}
        >{v.desc}</motion.p>

        {/* Divider — visible track always rendered; gold fill animates in on mobile */}
        <div style={{ position: 'relative', height: 1, background: 'rgba(161,134,97,0.18)', borderRadius: 1, overflow: 'hidden' }}>
          <motion.div
            initial={isMobile ? { scaleX: 0 } : undefined}
            animate={isMobile ? (mobileActive ? { scaleX: 1 } : { scaleX: 0 }) : undefined}
            transition={isMobile ? { duration: 0.45, ease: 'easeOut', delay: stagger + 0.3 } : undefined}
            style={{
              position: 'absolute', inset: 0,
              background: '#a18661',
              borderRadius: 1,
              transformOrigin: 'left center',
              ...(isMobile ? {} : { transform: hovered ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform 0.3s ease' }),
            }}
          />
        </div>
      </div>

      <style>{`
        .value-icon-col { width: 40px; }
        @media (max-width: 768px) {
          .value-item-row {
            gap: 12px !important;
            padding-top: 20px !important;
            padding-bottom: 20px !important;
          }
          .value-icon-col { width: 36px !important; }
          .value-icon-col svg { width: 36px !important; height: 36px !important; }
        }
      `}</style>
    </motion.div>
  )
}

/* ─── HERO SECTION — mobile heading flips in word by word ─ */
function HeroSection() {
  const isMobile = useIsMobile()
  const headingRef = useRef<HTMLDivElement>(null)
  const headingInView = useInView(headingRef, { once: !isMobile, amount: 0.4 })
  const words = ['Design', 'With']

  return (
    <section className="relative py-24 px-6 overflow-hidden about-hero" style={{ background: '#f5f2ed' }}>
      <div className="absolute inset-0 opacity-[0.07]">
        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #a18661 0%, transparent 60%)' }} />
      </div>
      <div className="max-w-4xl mx-auto text-center relative">
        <FadeIn direction={isMobile ? 'down' : 'up'}>
          <p style={LABEL}>Our Story</p>
        </FadeIn>

        <div ref={headingRef}>
          <h1 className="about-hero-heading-desktop" style={{ ...H2, color: '#2A3926', fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', marginBottom: 24 }}>
            Design With<br /><em style={{ color: '#a18661', fontStyle: 'italic' }}>Purpose & Craft</em>
          </h1>

          <h1
            className="about-hero-heading-mobile"
            style={{ ...H2, color: '#2A3926', fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', marginBottom: 24, justifyContent: 'center', flexWrap: 'wrap', gap: '0.3em', perspective: 500 }}
          >
            {words.map((w, i) => (
              <motion.span
                key={i}
                style={{ display: 'inline-block', transformStyle: 'preserve-3d' }}
                initial={{ opacity: 0, rotateX: 90 }}
                animate={headingInView ? { opacity: 1, rotateX: 0 } : { opacity: 0, rotateX: 90 }}
                transition={{ duration: 0.5, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              >{w}</motion.span>
            ))}
            <motion.span
              style={{ display: 'block', width: '100%', color: '#a18661', fontStyle: 'italic', transformStyle: 'preserve-3d' }}
              initial={{ opacity: 0, rotateX: 90 }}
              animate={headingInView ? { opacity: 1, rotateX: 0 } : { opacity: 0, rotateX: 90 }}
              transition={{ duration: 0.5, delay: 2 * 0.15, ease: [0.16, 1, 0.3, 1] }}
            >Purpose & Craft</motion.span>
          </h1>
        </div>

        <FadeIn direction="up" delay={0.15}>
          <p style={{ ...BODY, color: 'rgba(42,57,38,0.65)', maxWidth: 560, margin: '0 auto', fontSize: 15 }}>
            NIVORA is a boutique interior design studio creating thoughtful, refined spaces that balance elegance with everyday functionality.
          </p>
        </FadeIn>
      </div>
      <style>{`
        .about-hero-heading-mobile { display: none; }
        /* Mobile: force the same dark olive background/text, tighter padding, word-flip heading */
        @media (max-width: 768px) {
          .about-hero {
            background: #f5f2ed !important;
            padding-top: 48px !important;
            padding-bottom: 48px !important;
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
          .about-hero-heading-desktop { display: none !important; }
          .about-hero-heading-mobile { display: flex !important; }
        }
      `}</style>
    </section>
  )
}

/* ─── CTA BUTTON — mobile-only shimmer sweep once it enters view ── */
function CtaButton() {
  const isMobile = useIsMobile()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, amount: 0.4 })

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <Link
        to="/contact"
        className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase px-12 py-5 hover:bg-[#d4b896] transition-all duration-300 font-medium"
        style={{ background: '#C9A96E', color: '#21291a', position: 'relative', overflow: 'hidden' }}
      >
        Book Free Consultation <ArrowRight size={13} />
        {isMobile && (
          <motion.span
            aria-hidden="true"
            initial={{ x: '-120%' }}
            animate={inView ? { x: '120%' } : { x: '-120%' }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: 0, left: 0, width: '40%', height: '100%',
              background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.55), transparent)',
              pointerEvents: 'none',
            }}
          />
        )}
      </Link>
    </div>
  )
}

/* ─── MAIN PAGE ─────────────────────────────────────────── */
export default function About() {
  const isMobile = useIsMobile()

  return (
    <div style={{ background: '#f5f2ed' }} className="pt-20 about-page-root">

      {/* HERO */}
      <HeroSection />

      {/* WHO WE ARE */}
      <section className="py-24 about-section-pad" style={{ background: '#f5f2ed', borderTop: '1px solid rgba(161,134,97,0.15)' }}>
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
      <section className="py-28 about-section-pad" style={{ background: '#f5f2ed' }}>
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
              viewport={isMobile ? { once: false, margin: '-40px' } : { once: true, margin: '-60px' }}
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
      <section className="py-24 about-section-pad" style={{ background: '#f5f2ed', borderTop: '1px solid rgba(161,134,97,0.15)' }}>
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
      <section className="py-20 px-6 text-center about-section-pad" style={{ background: '#2A3926' }}>
        <FadeIn>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#f5f0e8', marginBottom: 20, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
            Let's design something<br />
            <em style={{ color: '#C9A96E' }}>meaningful together.</em>
          </h2>
          <p style={{ ...BODY, color: 'rgba(245,240,232,0.45)', marginBottom: 40, maxWidth: 360, margin: '0 auto 40px' }}>
            Book a free consultation and let's start with a conversation.
          </p>
          <CtaButton />
        </FadeIn>
      </section>

      <style>{`
        /* Mobile: tighten section padding — max 40px top/bottom, adjacent sections total ~48px */
        @media (max-width: 768px) {
          .about-section-pad {
            padding-top: 24px !important;
            padding-bottom: 24px !important;
          }
          .about-stats-section {
            padding-top: 24px !important;
            padding-bottom: 24px !important;
          }
        }
      `}</style>
    </div>
  )
}
