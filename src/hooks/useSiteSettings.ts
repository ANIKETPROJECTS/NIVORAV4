import { useState, useEffect } from 'react'
import { fetchSiteSettings, SiteSettings } from '../lib/api'

let cached: SiteSettings | null = null
const listeners: Array<() => void> = []

function notifyListeners() {
  listeners.forEach(fn => fn())
}

export function invalidateSiteSettings(fresh?: SiteSettings) {
  cached = fresh ?? null
  notifyListeners()
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(cached)
  const [loading, setLoading] = useState(!cached)

  useEffect(() => {
    let cancelled = false

    const reload = () => {
      fetchSiteSettings()
        .then(data => {
          if (!cancelled) {
            cached = data
            setSettings(data)
            setLoading(false)
          }
        })
        .catch(() => {
          if (!cancelled) setLoading(false)
        })
    }

    if (!cached) {
      setLoading(true)
      reload()
    }

    // Re-fetch whenever this document becomes visible.
    // Each browser tab and each Replit preview iframe has its own isolated JS
    // module, so invalidateSiteSettings() called in the admin panel tab cannot
    // reach this context. Refetching on visibilitychange ensures the website
    // always shows the latest saved values when the user looks at it.
    const handleVisibilityChange = () => {
      if (!document.hidden) reload()
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    listeners.push(reload)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      const idx = listeners.indexOf(reload)
      if (idx !== -1) listeners.splice(idx, 1)
    }
  }, [])

  return { settings, loading }
}
