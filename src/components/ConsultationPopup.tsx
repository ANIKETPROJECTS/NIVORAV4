import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'

export default function ConsultationPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (sessionStorage.getItem('popupShown')) return

    let timer: ReturnType<typeof setTimeout> | null = null

    const onScroll = () => {
      window.removeEventListener('scroll', onScroll)
      timer = setTimeout(() => {
        setIsOpen(true)
        sessionStorage.setItem('popupShown', 'true')
      }, 5000)
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (timer) clearTimeout(timer)
    }
  }, [])

  const close = () => setIsOpen(false)

  const handleBook = () => {
    close()
    navigate('/contact')
  }

  if (!isOpen) return null

  return (
    <>
      <style>{`
        .cpopup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: cpopup-fade-in 0.3s ease;
        }
        @keyframes cpopup-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .cpopup-card {
          background: #f5f0e8;
          border-radius: 4px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.35), 0 4px 20px rgba(0,0,0,0.15);
          width: 100%;
          max-width: 460px;
          padding: 48px 40px 40px;
          position: relative;
          animation: cpopup-slide-up 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes cpopup-slide-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cpopup-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          cursor: pointer;
          color: #5a5a5a;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }
        .cpopup-close:hover { color: #21291a; }
        .cpopup-sub {
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #a18661;
          text-align: center;
          margin: 0 0 12px;
        }
        .cpopup-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 400;
          font-size: clamp(1.4rem, 4vw, 1.85rem);
          color: #21291a;
          text-align: center;
          margin: 0 0 32px;
          line-height: 1.25;
        }
        .cpopup-stats {
          display: flex;
          justify-content: center;
          gap: 0;
          margin: 0 0 28px;
          border: 1px solid rgba(161,134,97,0.2);
          border-radius: 4px;
          overflow: hidden;
        }
        .cpopup-stat {
          flex: 1;
          text-align: center;
          padding: 20px 16px;
          background: rgba(33,41,26,0.04);
        }
        .cpopup-stat + .cpopup-stat {
          border-left: 1px solid rgba(161,134,97,0.2);
        }
        .cpopup-stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.4rem;
          font-weight: 300;
          color: #21291a;
          line-height: 1;
          margin: 0 0 6px;
        }
        .cpopup-stat-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 9px;
          font-weight: 400;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(33,41,26,0.5);
          margin: 0;
        }
        .cpopup-tagline {
          font-family: 'Lora', serif;
          font-style: italic;
          font-size: 14px;
          color: rgba(33,41,26,0.6);
          text-align: center;
          margin: 0 0 32px;
          line-height: 1.6;
        }
        .cpopup-btn {
          width: 100%;
          background: #a18661;
          color: #f5f0e8;
          border: none;
          padding: 16px 24px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 2px;
          transition: background 0.25s ease, transform 0.25s ease;
        }
        .cpopup-btn:hover {
          background: #8d7250;
          transform: translateY(-1px);
        }
        @media (max-width: 480px) {
          .cpopup-card { padding: 40px 24px 32px; }
        }
      `}</style>

      <div
        className="cpopup-overlay"
        onClick={e => { if (e.target === e.currentTarget) close() }}
      >
        <div className="cpopup-card">
          <button className="cpopup-close" onClick={close} aria-label="Close">
            <X size={18} />
          </button>

          <p className="cpopup-sub">Get a Free 30-Min Design Consultation</p>
          <h2 className="cpopup-heading">Planning your dream home?</h2>

          <div className="cpopup-stats">
            <div className="cpopup-stat">
              <p className="cpopup-stat-value">8+</p>
              <p className="cpopup-stat-label">Years Experience</p>
            </div>
            <div className="cpopup-stat">
              <p className="cpopup-stat-value">90%</p>
              <p className="cpopup-stat-label">Client Satisfaction</p>
            </div>
          </div>

          <p className="cpopup-tagline">
            Let's turn your vision into a beautifully designed space.
          </p>

          <button className="cpopup-btn" onClick={handleBook}>
            Book My Free Consultation
          </button>
        </div>
      </div>
    </>
  )
}
