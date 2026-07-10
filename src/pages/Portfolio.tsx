import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { fetchProjects } from '../lib/api'
import type { Project } from '../lib/api'

type ProjectCard = Pick<Project, 'id' | 'name' | 'location' | 'category' | 'year' | 'badge' | 'concept' | 'coverImage'>

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const show = () => setVisible(true)
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { show(); obs.disconnect() } },
      { threshold: 0.05, rootMargin: '0px 0px 60px 0px' }
    )
    obs.observe(el)
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      show()
      obs.disconnect()
    }
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

function ProjectCard({ project, index, delay }: {
  project: ProjectCard
  index: number
  delay: number
}) {
  const { ref, visible } = useReveal()
  const num = String(index + 1).padStart(2, '0')

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(36px)',
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      <Link
        to={`/portfolio/${project.id}`}
        className="ptf-card"
        style={{
          display: 'block',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 24,
          textDecoration: 'none',
          cursor: 'pointer',
          background: '#e4ddd4',
          aspectRatio: '16 / 10',
        }}
      >
        {/* Image */}
        <img
          src={project.coverImage}
          alt={project.name}
          className="ptf-img"
          loading="lazy"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: 1,
            display: 'block',
            transition: 'transform 0.65s cubic-bezier(0.16,1,0.3,1)',
            zIndex: 2,
          }}
        />

        {/* Bottom gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(6,10,6,0) 35%, rgba(6,10,6,0.80) 100%)',
          zIndex: 3,
        }} />

        {/* Hover overlay */}
        <div className="ptf-hover-overlay" style={{
          position: 'absolute', inset: 0,
          background: 'rgba(8,14,8,0.38)',
          opacity: 0,
          transition: 'opacity 0.45s ease',
          zIndex: 4,
        }} />

        {/* Gold accent line */}
        <div className="ptf-accent-line" style={{
          position: 'absolute',
          bottom: 0, left: 22, right: 22,
          height: 2,
          background: 'linear-gradient(90deg, #C9A96E, #e8d5a3 50%, #C9A96E)',
          width: 0,
          transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
          zIndex: 10,
        }} />

        {/* Project number */}
        <div style={{
          position: 'absolute', top: 20, left: 22, zIndex: 8,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300, fontSize: 11,
          color: 'rgba(255,255,255,0.45)',
          letterSpacing: '0.2em',
        }}>{num}</div>

        {/* Category badge */}
        <div style={{
          position: 'absolute', top: 16, right: 18, zIndex: 8,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 400, fontSize: 9,
          color: 'rgba(255,255,255,0.55)',
          letterSpacing: '0.25em', textTransform: 'uppercase',
          background: 'rgba(0,0,0,0.28)',
          backdropFilter: 'blur(6px)',
          padding: '5px 10px',
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.1)',
        }}>{project.category}</div>

        {/* Text overlay */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '0 22px 22px',
          zIndex: 9,
        }}>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300, fontSize: 22,
            color: '#f5f0e8',
            margin: 0,
            lineHeight: 1.2,
            letterSpacing: '0.01em',
          }}>{project.name}</h3>

          {/* Hover reveal */}
          <div className="ptf-hover-content" style={{
            overflow: 'hidden',
            maxHeight: 0,
            opacity: 0,
            transition: 'max-height 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease',
          }}>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300, fontSize: 12,
              color: 'rgba(245,240,232,0.7)',
              margin: '8px 0 0',
              lineHeight: 1.6,
              letterSpacing: '0.01em',
            }}>{project.location}</p>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              marginTop: 14,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400, fontSize: 9,
              color: '#C9A96E',
              letterSpacing: '0.25em', textTransform: 'uppercase',
            }}>
              View Project <ArrowRight size={10} strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

// ── Skeleton card shown while loading ─────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{
      borderRadius: 24,
      background: 'linear-gradient(90deg, #e4ddd4 25%, #ede6dc 50%, #e4ddd4 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
      aspectRatio: '16 / 10',
    }} />
  )
}

export default function Portfolio() {
  const [projects, setProjects] = useState<ProjectCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
      .then(data => {
        setProjects(data.slice(0, 8))
        setLoading(false)
      })
      .catch(err => {
        console.error('Portfolio fetch error:', err)
        setError('Failed to load projects. Please try again.')
        setLoading(false)
      })
  }, [])

  const DISPLAY = projects

  return (
    <div style={{ background: '#FFFCF7', minHeight: '100vh', paddingTop: 80 }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }
        .ptf-card:hover .ptf-img { transform: scale(1.06) !important; }
        .ptf-card:hover .ptf-hover-overlay { opacity: 1 !important; }
        .ptf-card:hover .ptf-hover-content { max-height: 80px !important; opacity: 1 !important; }
        .ptf-card:hover .ptf-accent-line { width: calc(100% - 44px) !important; }
        .ptf-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        @media (max-width: 640px) {
          .ptf-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section style={{ textAlign: 'center', padding: '80px 24px 60px' }}>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400, fontSize: 10,
            color: '#D4B483',
            letterSpacing: '0.4em', textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >Our Work</motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 400,
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            color: '#262421',
            lineHeight: 1.05,
            marginBottom: 32,
            letterSpacing: '-0.01em',
          }}
        >
          Spaces That Tell Your Story
        </motion.h1>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 48 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)',
            margin: '0 auto 32px',
          }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300, fontSize: 14,
            color: 'rgba(28,40,24,0.55)',
            lineHeight: 1.8,
            maxWidth: 480,
            margin: '0 auto',
          }}
        >
          Every project is a reflection of the people who live and work there.<br />
          See how thoughtful design transforms spaces into something truly special.
        </motion.p>
      </section>

      {/* ── Grid ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        {error ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#2E2A26', opacity: 0.6 }}>
            <p>{error}</p>
          </div>
        ) : (
          <div className="ptf-grid">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : DISPLAY.map((project, i) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={i}
                    delay={Math.min(i * 80, 400)}
                  />
                ))}
          </div>
        )}
      </section>

      {/* ── CTA ── */}
      {!loading && !error && (
        <section style={{
          textAlign: 'center',
          padding: '80px 24px',
          borderTop: '1px solid rgba(201,169,110,0.2)',
          background: 'rgba(201,169,110,0.04)',
        }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300, fontSize: 13,
              color: 'rgba(28,40,24,0.38)',
              lineHeight: 1.8, marginBottom: 32,
            }}
          >
            Ready to create a space that tells your story?
          </motion.p>
          <Link
            to="/contact"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400, fontSize: 10,
              letterSpacing: '0.26em', textTransform: 'uppercase',
              color: '#1C2818',
              border: '1px solid rgba(28,40,24,0.3)',
              padding: '18px 52px',
              textDecoration: 'none',
              borderRadius: 2,
              transition: 'all 0.4s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = '#2A3926'
              el.style.borderColor = '#2A3926'
              el.style.color = '#f5f0e8'
              el.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'transparent'
              el.style.borderColor = 'rgba(28,40,24,0.3)'
              el.style.color = '#1C2818'
              el.style.transform = 'translateY(0)'
            }}
          >
            Start Your Project <ArrowRight size={13} strokeWidth={1.5} />
          </Link>
        </section>
      )}
    </div>
  )
}
