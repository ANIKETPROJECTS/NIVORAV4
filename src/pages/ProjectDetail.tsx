import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react'
import FadeIn from '../components/FadeIn'
import { fetchProject } from '../lib/api'
import type { Project } from '../lib/api'


interface LightboxProps {
  images: string[]
  startIndex: number
  projectName: string
  onClose: () => void
}

function Lightbox({ images, startIndex, projectName, onClose }: LightboxProps) {
  const [index, setIndex] = useState(startIndex)
  const [loaded, setLoaded] = useState(false)
  const [zoomed, setZoomed] = useState(false)
  const touchStartX = useRef(0)

  const prev = useCallback(() => {
    setIndex(i => (i - 1 + images.length) % images.length)
    setLoaded(false)
    setZoomed(false)
  }, [images.length])

  const next = useCallback(() => {
    setIndex(i => (i + 1) % images.length)
    setLoaded(false)
    setZoomed(false)
  }, [images.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [prev, next, onClose])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.93)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
      onTouchEnd={e => {
        const dx = e.changedTouches[0].clientX - touchStartX.current
        if (Math.abs(dx) > 50) { dx < 0 ? next() : prev() }
      }}
    >
      <style>{`
        @keyframes lb-spin { to { transform: rotate(360deg) } }
        .lb-btn {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          transition: background 0.2s;
        }
        .lb-btn:hover { background: rgba(255,255,255,0.18); }
      `}</style>

      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)',
      }}>
        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
          {projectName}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, letterSpacing: '0.15em', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          {index + 1} / {images.length}
        </span>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="lb-btn" style={{ width: 40, height: 40 }}
            onClick={() => setZoomed(z => !z)}
            title={zoomed ? 'Zoom out' : 'Zoom in'}
          >
            {zoomed ? <ZoomOut size={17} /> : <ZoomIn size={17} />}
          </button>
          <button className="lb-btn" style={{ width: 40, height: 40 }}
            onClick={onClose}
            title="Close (Esc)"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Prev arrow */}
      <button
        className="lb-btn"
        onClick={e => { e.stopPropagation(); prev() }}
        style={{ position: 'absolute', left: 16, width: 48, height: 48 }}
        title="Previous"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Image */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '100%', height: '100%',
        padding: '72px 80px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}>
        {!loaded && (
          <div style={{
            position: 'absolute',
            width: 40, height: 40,
            borderRadius: '50%',
            border: '3px solid rgba(255,255,255,0.12)',
            borderTopColor: '#D4B483',
            animation: 'lb-spin 0.75s linear infinite',
          }} />
        )}
        <img
          key={images[index]}
          src={images[index]}
          alt={`${projectName} — image ${index + 1}`}
          onLoad={() => setLoaded(true)}
          onClick={e => { e.stopPropagation(); setZoomed(z => !z) }}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            borderRadius: 6,
            opacity: loaded ? 1 : 0,
            transform: zoomed ? 'scale(1.65)' : 'scale(1)',
            transition: 'opacity 0.25s ease, transform 0.35s ease',
            cursor: zoomed ? 'zoom-out' : 'zoom-in',
            userSelect: 'none',
          }}
        />
      </div>

      {/* Next arrow */}
      <button
        className="lb-btn"
        onClick={e => { e.stopPropagation(); next() }}
        style={{ position: 'absolute', right: 16, width: 48, height: 48 }}
        title="Next"
      >
        <ChevronRight size={24} />
      </button>

      {/* Bottom dot indicators (max 20 shown) */}
      {images.length <= 20 && (
        <div style={{
          position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 6, alignItems: 'center',
        }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); setIndex(i); setLoaded(false); setZoomed(false) }}
              style={{
                width: i === index ? 20 : 7,
                height: 7,
                borderRadius: 4,
                background: i === index ? '#D4B483' : 'rgba(255,255,255,0.28)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.25s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Loading skeleton ───────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div style={{ background: '#FFFCF7' }} className="pt-20">
      <style>{`
        @keyframes sk-shimmer {
          0% { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }
        .sk { background: linear-gradient(90deg,#e4ddd4 25%,#ede6dc 50%,#e4ddd4 75%); background-size:200% 100%; animation: sk-shimmer 1.4s infinite; border-radius: 6px; }
      `}</style>
      {/* Hero skeleton */}
      <div className="sk" style={{ height: '70vh' }} />
      {/* Content skeleton */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '60px 24px' }}>
        <div className="sk" style={{ height: 16, width: 120, marginBottom: 24 }} />
        <div className="sk" style={{ height: 40, width: '60%', marginBottom: 16 }} />
        <div className="sk" style={{ height: 16, width: '80%', marginBottom: 8 }} />
        <div className="sk" style={{ height: 16, width: '70%' }} />
      </div>
    </div>
  )
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), [])
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setNotFound(false)
    fetchProject(id)
      .then(data => {
        setProject(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Project detail fetch error:', err)
        // Only treat genuine 404s as "not found"; other errors stay as server errors
        const is404 = err.message?.includes('404') || err.message?.includes('not found')
        setNotFound(is404)
        setLoading(false)
      })
  }, [id])

  if (loading) return <DetailSkeleton />

  if (notFound || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFFCF7' }}>
        <div className="text-center">
          <p style={{ color: '#D4B483', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '1rem' }}>404</p>
          <h1 className="font-serif text-4xl font-light mb-6" style={{ color: '#2E2A26' }}>Project Not Found</h1>
          <Link to="/portfolio" style={{ color: '#D4B483', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase' }}
            className="hover:opacity-70 transition-opacity">
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    )
  }

  // Gallery images: all images stored in MongoDB (the hero banner is a separate field)
  const galleryImages = project.images.filter(img => img && img.trim() !== '')

  return (
    <div style={{ background: '#FFFCF7' }} className="pt-20">

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: '70vh' }}>
        <img
          src={project.heroImage || project.images[0] || project.coverImage}
          alt={project.name}
          className="w-full h-full object-cover"
          style={{ filter: 'contrast(1.07) saturate(1.05)' }}
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.52) 100%)',
        }} />
        <div className="absolute bottom-0 left-0 right-0 p-12" style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <FadeIn>
            <p style={{ color: '#D4B483', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              {project.badge || `${project.category} · ${project.year}`}
            </p>
            <h1 className="font-serif font-light mb-2" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#f5f0e8', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
              {project.name}
            </h1>
            <p style={{ color: 'rgba(245,240,232,0.7)', letterSpacing: '0.08em' }}>{project.location}</p>
          </FadeIn>
        </div>
      </div>

      {/* Back link */}
      <div style={{ background: '#F7F2EA' }}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 transition-opacity hover:opacity-70"
            style={{ color: '#D4B483', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase' }}
          >
            <ArrowLeft size={13} /> Back to Portfolio
          </Link>
        </div>
      </div>

      {/* Concept & Intent */}
      <div style={{ background: '#FFFCF7' }}>
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-20">
            <FadeIn>
              <p style={{ color: '#D4B483', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                {project.conceptLabel || 'The Concept'}
              </p>
              <h2 className="font-serif font-light mb-6 leading-snug" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: '1.875rem', color: '#262421', letterSpacing: '-0.01em' }}>
                {project.concept}
              </h2>
              <p style={{ color: '#2E2A26', opacity: 0.6, lineHeight: '1.9', fontWeight: 300 }}>{project.description}</p>
            </FadeIn>
            <FadeIn delay={0.2} direction="left">
              <p style={{ color: '#D4B483', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                {project.designIntentLabel || 'Design Intent'}
              </p>
              <p className="font-serif font-light italic mb-10" style={{ fontSize: '1.5rem', color: '#2E2A26', opacity: 0.75, lineHeight: '1.7' }}>
                "{project.designIntent}"
              </p>
              <p style={{ color: '#D4B483', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Materials Used
              </p>
              <ul className="space-y-2">
                {project.materials.map(m => (
                  <li key={m} className="flex items-center gap-3 text-sm font-light" style={{ color: '#2E2A26', opacity: 0.6 }}>
                    <span className="rounded-full shrink-0" style={{ width: 4, height: 4, background: '#D4B483' }} />
                    {m}
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      {galleryImages.length > 0 && (
        <div style={{ background: '#F7F2EA' }}>
          <style>{`
            .gallery-grid {
              column-count: 3;
              column-gap: 10px;
            }
            .gallery-item {
              break-inside: avoid;
              margin-bottom: 10px;
            }
            .gallery-thumb-wrap {
              border-radius: 12px;
              overflow: hidden;
              border: 1px solid #E9DED0;
              box-shadow: 0 2px 12px rgba(46,42,38,0.06);
              cursor: pointer;
              line-height: 0;
            }
            .gallery-thumb {
              display: block;
              width: 100%;
              height: auto;
              transition: transform 0.4s ease, opacity 0.3s ease;
            }
            .gallery-thumb:hover { transform: scale(1.03); opacity: 0.88; }
            @media (max-width: 767px) {
              .gallery-grid { column-count: 2; column-gap: 7px; }
              .gallery-item { margin-bottom: 7px; }
            }
            @media (max-width: 480px) {
              .gallery-grid { column-count: 1; }
            }
          `}</style>
          <div className="max-w-7xl mx-auto px-6 py-14">
            <FadeIn>
              <p style={{ color: '#D4B483', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '2rem', textAlign: 'center' }}>
                The Gallery
              </p>
            </FadeIn>
            <div className="gallery-grid">
              {galleryImages.map((img, i) => (
                <FadeIn
                  key={`${i}-${img}`}
                  delay={Math.min(i * 0.07, 0.5)}
                  className="gallery-item"
                >
                  <div
                    className="gallery-thumb-wrap"
                    onClick={() => openLightbox(i)}
                  >
                    <img
                      src={img}
                      alt={`${project.name} — view ${i + 2}`}
                      className="gallery-thumb"
                      loading="lazy"
                    />
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div style={{ background: '#FFFCF7' }}>
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn className="text-center py-24" style={{ borderTop: '1px solid #E9DED0' }}>
            <p style={{ color: '#D4B483', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Start Your Project
            </p>
            <h2 className="font-serif font-light mb-8" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: '2.5rem', color: '#262421', letterSpacing: '-0.01em' }}>
              Ready to design your space?
            </h2>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 transition-all duration-300 font-medium text-xs tracking-[0.2em] uppercase px-10 py-4"
              style={{
                background: '#D4B483',
                color: '#2E2A26',
                borderRadius: 4,
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = '#c9a470'
                el.style.transform = 'translateY(-2px)'
                el.style.boxShadow = '0 8px 24px rgba(212,180,131,0.35)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = '#D4B483'
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = 'none'
              }}
            >
              Book a Free Consultation
            </Link>
          </FadeIn>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={galleryImages}
          startIndex={lightboxIndex}
          projectName={project.name}
          onClose={closeLightbox}
        />
      )}

    </div>
  )
}
