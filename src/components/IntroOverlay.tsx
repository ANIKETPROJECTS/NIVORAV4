import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import nivoraLogo from '../assets/images/nivora-logo.png'

function useTransparentLogo(src: string) {
  const [logoSrc, setLogoSrc] = useState<string | null>(null)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const isNeutral = Math.abs(r - g) < 28 && Math.abs(g - b) < 28
        const isBright = r > 170 && g > 160 && b > 150
        if (isNeutral && isBright) {
          data[i + 3] = 0
        }
      }
      ctx.putImageData(imageData, 0, 0)
      setLogoSrc(canvas.toDataURL('image/png'))
    }
    img.src = src
  }, [src])

  return logoSrc
}

export default function IntroOverlay({ onExitComplete }: { onExitComplete?: () => void }) {
  const [visible, setVisible] = useState(true)
  const logoSrc = useTransparentLogo(nivoraLogo)

  return (
    <>
      <style>{`
        @keyframes glowPulse {
          0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.6); }
          40%  { opacity: 1; transform: translate(-50%, -50%) scale(1);   }
          70%  { opacity: 1; transform: translate(-50%, -50%) scale(1.05);}
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.1); }
        }

        /* Keep the splash screen and logo perfectly centered on all screen sizes */
        .splash-screen {
          position: fixed !important;
          top: 0; left: 0; right: 0; bottom: 0;
          width: 100vw;
          height: 100vh;
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .logo-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          left: auto;
          text-align: center;
        }
        .logo-glow {
          top: 50%;
          left: 50%;
        }

        @media (max-width: 768px) {
          .splash-screen {
            width: 100vw;
            height: 100vh;
            padding: 0;
            margin: 0;
          }
          .logo-container {
            width: auto;
            max-width: 80vw;
            margin: 0 auto;
            left: 0;
            right: 0;
          }
        }
      `}</style>

      <AnimatePresence onExitComplete={onExitComplete}>
        {visible && (
          <motion.div
            key="intro-overlay"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="splash-screen"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              backgroundColor: '#21291a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AnimatePresence>
              {logoSrc && (
                <motion.div
                  key="logo"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  onAnimationComplete={() => {
                    setTimeout(() => setVisible(false), 900)
                  }}
                  className="logo-container"
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    className="logo-glow"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '600px',
                      height: '600px',
                      borderRadius: '50%',
                      background: '#21291a',
                      pointerEvents: 'none',
                      zIndex: 0,
                      opacity: 0,
                      animation: 'glowPulse 2000ms ease-in-out forwards',
                      animationDelay: '600ms',
                    }}
                  />
                  <img
                    src={logoSrc}
                    alt="Nivora Interiors"
                    style={{
                      width: 'clamp(220px, 30vw, 320px)',
                      height: 'auto',
                      display: 'block',
                      position: 'relative',
                      zIndex: 1,
                      filter: 'drop-shadow(0 0 20px rgba(201,166,107,0.28))',
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
