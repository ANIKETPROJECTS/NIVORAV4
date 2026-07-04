import { useState, useEffect } from 'react'
import { fetchSiteSettings, SiteSettings } from '../lib/api'

let cached: SiteSettings | null = null
let cacheTimestamp = 0
const CACHE_TTL_MS = 10_000 // treat cache as fresh for 10s; stale after that
const listeners: Array<() => void> = []

function notifyListeners() {
  listeners.forEach(fn => fn())
}

export function invalidateSiteSettings(fresh?: SiteSettings) {
  cached = fresh ?? null
  cacheTimestamp = fresh ? Date.now() : 0
  notifyListeners()
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(cached)
  const [loading, setLoading] = useState(!cached)

  useEffect(() => {
    let cancelled = false

    const reload = () => {
      setLoading(true)
      fetchSiteSettings()
        .then(data => {
          if (!cancelled) {
            cached = data
            cacheTimestamp = Date.now()
            setSettings(data)
            setLoading(false)
          }
        })
        .catch(() => {
          if (!cancelled) setLoading(false)
        })
    }

    // Initial load: skip if cache is still fresh
    const cacheIsFresh = cached && (Date.now() - cacheTimestamp) < CACHE_TTL_MS
    if (!cacheIsFresh) {
      reload()
    }

    // Re-fetch whenever this tab/frame becomes visible —
    // this ensures the website preview picks up changes saved in the admin panel
    // (each browser tab / Replit preview iframe has its own isolated JS module)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Only refetch if the cache has gone stale since we last loaded
        const stale = !cached || (Date.now() - cacheTimestamp) >= CACHE_TTL_MS
        if (stale) reload()
      }
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
