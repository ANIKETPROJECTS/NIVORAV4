import { useRef, useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'

const STEPS = [
  {
    num: '01',
    title: 'Discover',
    text: 'A free consultation to understand your lifestyle, vision, and budget — before anything is planned.',
    side: 'left' as const,
  },
  {
    num: '02',
    title: 'Visualise',
    text: '3D renders and mood boards bring your space to life before a single item is moved or purchased.',
    side: 'right' as const,
  },
  {
    num: '03',
    title: 'Execute',
    text: 'Master craftsmen, transparent timelines, and on-site precision deliver your design flawlessly.',
    side: 'left' as const,
  },
  {
    num: '04',
    title: 'Reveal',
    text: 'A styled, ready-to-move-in space that exceeds every expectation and reflects your vision.',
    side: 'right' as const,
  },
  {
    num: '05',
    title: 'Handover',
    text: 'Your space, fully ready. A lasting relationship that continues well beyond the final delivery.',
    side: 'left' as const,
  },
]

function AnimatedCheckmark({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ display: 'block' }}>
      <motion.path
        d="M 3.5 9 L 7.5 13 L 14.5 5"
        stroke="#C9A96E"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={active ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.65, ease: 'easeInOut', delay: 0.35 }}
      />
    </svg>
  )
}

function DiamondNode({ active }: { active: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={active ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: 52,
        height: 52,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 2,
      }}
    >
      {/* Outer glow ring */}
      <motion.div
        animate={active
          ? { opacity: 1, scale: 1 }
          : { opacity: 0, scale: 0.8 }
        }
        transition={{ duration: 0.7, delay: 0.3 }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 2,
          background: 'radial-gradient(ellipse at center, rgba(201,169,110,0.18) 0%, transparent 70%)',
          transform: 'rotate(45deg)',
        }}
      />
      {/* Diamond */}
      <motion.div
        animate={active
          ? { background: '#2A3926', borderColor: '#C9A96E' }
          : { background: '#F5F2ED', borderColor: 'rgba(201,169,110,0.4)' }
        }
        transition={{ duration: 0.45 }}
        style={{
          width: 38,
          height: 38,
          border: '1.5px solid rgba(201,169,110,0.4)',
          transform: 'rotate(45deg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div style={{ transform: 'rotate(-45deg)' }}>
          <AnimatedCheckmark active={active} />
        </div>
      </motion.div>
    </motion.div>
  )
}

function LineSegment({ active }: { active: boolean }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 1,
    }}>
      <div style={{
        width: 1,
        height: 90,
        background: 'rgba(201,169,110,0.14)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <motion.div
          initial={{ scaleY: 0 }}
          animate={active ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, #C9A96E 0%, rgba(201,169,110,0.45) 100%)',
            transformOrigin: 'top',
          }}
        />
      </div>
    </div>
  )
}

function StepContent({
  step,
  active,
  align,
}: {
  step: typeof STEPS[0]
  active: boolean
  align: 'left' | 'right'
}) {
  return (
    <div style={{ textAlign: align }}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          fontSize: 10,
          letterSpacing: '0.4em',
          color: '#C9A96E',
          textTransform: 'uppercase',
          margin: '0 0 10px',
        }}
      >{step.num}</motion.p>

      <motion.h3
        initial={{ opacity: 0, y: 14 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(1.6rem, 2.5vw, 2.1rem)',
          color: '#1C2818',
          margin: '0 0 12px',
          lineHeight: 1.1,
        }}
      >{step.title}</motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          fontSize: 13,
          color: 'rgba(28,40,24,0.52)',
          lineHeight: 1.8,
          margin: 0,
        }}
      >{step.text}</motion.p>
    </div>
  )
}

function StepRow({
  step,
  index,
  onVisible,
}: {
  step: typeof STEPS[0]
  index: number
  onVisible: (i: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  useEffect(() => {
    if (inView) onVisible(index)
  }, [inView, index, onVisible])

  const isLeft = step.side === 'left'

  const slideVariants = (dir: 'left' | 'right') => ({
    hidden: { opacity: 0, x: dir === 'left' ? -32 : 32 },
    visible: { opacity: 1, x: 0 },
  })

  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 52px 1fr',
        alignItems: 'center',
        gap: 0,
      }}
      className="timeline-step-row"
    >
      {/* Left panel */}
      <div style={{ paddingRight: 48, display: 'flex', justifyContent: 'flex-end' }} className="tl-left-cell">
        {isLeft ? (
          <motion.div
            variants={slideVariants('left')}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            style={{ maxWidth: 320, width: '100%' }}
          >
            <StepContent step={step} active={inView} align="right" />
          </motion.div>
        ) : (
          <div />
        )}
      </div>

      {/* Center node */}
      <DiamondNode active={inView} />

      {/* Right panel */}
      <div style={{ paddingLeft: 48 }} className="tl-right-cell">
        {!isLeft ? (
          <motion.div
            variants={slideVariants('right')}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            style={{ maxWidth: 320, width: '100%' }}
          >
            <StepContent step={step} active={inView} align="left" />
          </motion.div>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}

export default function ProcessSection() {
  const [visibleSet, setVisibleSet] = useState<Set<number>>(new Set())

  const handleVisible = useCallback((i: number) => {
    setVisibleSet(prev => {
      if (prev.has(i)) return prev
      return new Set([...prev, i])
    })
  }, [])

  return (
    <section style={{ background: '#F5F2ED', padding: '120px 0' }}>

      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 88, padding: '0 24px' }}>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: 10,
            letterSpacing: '0.44em',
            textTransform: 'uppercase',
            color: '#9B7D4E',
            margin: '0 0 14px',
          }}
        >How We Do It</motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: 'clamp(1.9rem, 3.5vw, 3rem)',
            color: '#1C2818',
            lineHeight: 1.04,
            margin: '0 0 18px',
            letterSpacing: '-0.01em',
          }}
        >Our Process</motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25 }}
          style={{
            width: 44,
            height: 1,
            background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)',
            margin: '0 auto 18px',
            transformOrigin: 'center',
          }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: 14,
            color: 'rgba(28,40,24,0.44)',
            lineHeight: 1.8,
          }}
        >
          From first conversation to final reveal — a seamless, end-to-end journey.
        </motion.p>
      </div>

      {/* Timeline */}
      <div
        style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}
        className="tl-container"
      >
        {STEPS.map((step, i) => (
          <div key={step.num}>
            <StepRow step={step} index={i} onVisible={handleVisible} />
            {i < STEPS.length - 1 && (
              <LineSegment active={visibleSet.has(i)} />
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{ textAlign: 'center', marginTop: 80, padding: '0 24px' }}
      >
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          fontSize: 10,
          letterSpacing: '0.35em',
          color: 'rgba(28,40,24,0.32)',
          textTransform: 'uppercase',
          margin: '0 0 28px',
        }}>
          End-to-End &nbsp;·&nbsp; Transparent &nbsp;·&nbsp; Hassle-Free
        </p>
        <Link
          to="/contact"
          style={{
            display: 'inline-block',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: 10,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            background: '#2A3926',
            color: '#ffffff',
            padding: '18px 52px',
            textDecoration: 'none',
            transition: 'background 0.3s ease, transform 0.3s ease',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.background = '#3a5e3c'
            el.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.background = '#2A3926'
            el.style.transform = 'translateY(0)'
          }}
        >
          Book Free Consultation
        </Link>
      </motion.div>

      <style>{`
        /* Mobile: shift to left-anchored single column */
        @media (max-width: 640px) {
          .tl-container {
            padding: 0 20px !important;
          }
          .timeline-step-row {
            grid-template-columns: 36px 1fr !important;
            gap: 0 !important;
          }
          .tl-left-cell {
            display: none !important;
          }
          .tl-right-cell {
            padding-left: 20px !important;
            display: block !important;
          }
        }

        /* Tablet: tighten padding */
        @media (max-width: 1024px) and (min-width: 641px) {
          .timeline-step-row {
            grid-template-columns: 1fr 52px 1fr !important;
          }
          .tl-left-cell {
            padding-right: 28px !important;
          }
          .tl-right-cell {
            padding-left: 28px !important;
          }
        }
      `}</style>
    </section>
  )
}
