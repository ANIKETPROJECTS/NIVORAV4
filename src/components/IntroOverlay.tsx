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
    <AnimatePresence onExitComplete={onExitComplete}>
      {visible && (
        <motion.div
          key="intro-overlay"
          initial={{ x: 0 }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            // Phase 1: radial glow background — warm golden ambient light fading to dark green edges
            background: 'radial-gradient(ellipse at center, #6b5a30 0%, #3a3318 25%, #21291a 65%, #1a2114 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Phase 2 & 3: Logo fades in after 0.5s delay, holds, then container slides out */}
          <motion.img
            key={logoSrc ?? 'placeholder'}
            src={logoSrc ?? undefined}
            alt="Nivora Interiors"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={logoSrc ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
            transition={{
              delay: 0.5,       // Phase 2 starts at 0.5s
              duration: 1.0,    // fades in over 1s → fully visible at 1.5s
              ease: [0.22, 1, 0.36, 1],
            }}
            onAnimationComplete={() => {
              if (!logoSrc) return
              // Phase 3: hold for 1s (1.5s → 2.5s), then Phase 4: slide-out
              setTimeout(() => setVisible(false), 1000)
            }}
            style={{
              width: 'clamp(220px, 30vw, 320px)',
              height: 'auto',
              display: 'block',
              filter: 'drop-shadow(0 0 28px rgba(180,148,80,0.35))',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
