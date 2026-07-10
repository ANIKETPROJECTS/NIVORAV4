import { useEffect, useRef, useState, useCallback } from 'react'

interface ServiceCard {
  img: string
  title: string
  desc: string
}

interface Props {
  cards: ServiceCard[]
}

const AUTOPLAY_MS = 3500
const PAUSE_AFTER_TAP_MS = 4000
const SLIDE_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)'
const SLIDE_DURATION_MS = 520

export function ExpertiseCarousel({ cards }: Props) {
  const total = cards.length
  // Cloned array: [last, ...real cards, first] for seamless infinite loop
  const cloned = [cards[total - 1], ...cards, cards[0]]
  const clonedLen = cloned.length

  // Start at index 1 (the first real card)
  const [current, setCurrent] = useState(1)
  const [animated, setAnimated] = useState(true)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Prevent overlapping snaps during transition
  const snappingRef = useRef(false)

  // Active dot index (0-based, real cards only)
  const activeDot =
    current === 0 ? total - 1
    : current === clonedLen - 1 ? 0
    : current - 1

  const advance = useCallback(() => {
    if (snappingRef.current) return
    setCurrent(prev => prev + 1)
    setAnimated(true)
  }, [])

  const startAutoplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(advance, AUTOPLAY_MS)
  }, [advance])

  const stopAutoplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
  }, [])

  const pauseAndResume = useCallback(() => {
    stopAutoplay()
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
    pauseTimeoutRef.current = setTimeout(startAutoplay, PAUSE_AFTER_TAP_MS)
  }, [startAutoplay, stopAutoplay])

  useEffect(() => {
    startAutoplay()
    return () => {
      stopAutoplay()
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
    }
  }, [startAutoplay, stopAutoplay])

  // After the CSS transition ends, snap to the real card if we're on a clone
  const handleTransitionEnd = useCallback(() => {
    if (current === 0) {
      // Was on clone of last → snap to real last card
      snappingRef.current = true
      setAnimated(false)
      setCurrent(total)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { snappingRef.current = false })
      })
    } else if (current === clonedLen - 1) {
      // Was on clone of first → snap to real first card
      snappingRef.current = true
      setAnimated(false)
      setCurrent(1)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { snappingRef.current = false })
      })
    }
  }, [current, total, clonedLen])

  const translateX = `${-(current / clonedLen) * 100}%`

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      {/* Slide track */}
      <div
        onTransitionEnd={handleTransitionEnd}
        style={{
          display: 'flex',
          width: `${clonedLen * 100}%`,
          transform: `translateX(${translateX})`,
          transition: animated
            ? `transform ${SLIDE_DURATION_MS}ms ${SLIDE_EASING}`
            : 'none',
          willChange: 'transform',
        }}
      >
        {cloned.map((card, i) => (
          <div
            key={i}
            style={{
              width: `${100 / clonedLen}%`,
              flexShrink: 0,
              padding: '0 1.25rem',
              boxSizing: 'border-box',
            }}
            onClick={pauseAndResume}
          >
            <div className="oe-card" style={{ maxWidth: 480, margin: '0 auto' }}>
              <div className="oe-img-wrap">
                <img
                  src={card.img}
                  alt={card.title}
                  className="oe-img"
                  loading="lazy"
                  draggable={false}
                />
              </div>
              <div className="oe-body">
                <span className="oe-divider" />
                <h3 className="oe-title">{card.title}</h3>
                <p className="oe-desc">{card.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination dots */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 7,
          marginTop: 22,
        }}
      >
        {cards.map((_, i) => (
          <div
            key={i}
            style={{
              width: activeDot === i ? 22 : 6,
              height: 6,
              borderRadius: 3,
              background: activeDot === i ? '#C9A96E' : 'rgba(26,22,18,0.18)',
              transition: 'width 0.35s ease, background 0.35s ease',
              flexShrink: 0,
            }}
          />
        ))}
      </div>
    </div>
  )
}
