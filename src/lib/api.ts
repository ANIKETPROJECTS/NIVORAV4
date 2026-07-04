// Thin API client — all calls go to /api (proxied to the Express server by Vite in dev,
// and to the same origin in production if you server-side render or use a reverse proxy).

export interface Project {
  id: string
  name: string
  location: string
  category: 'residential' | 'commercial' | 'architecture'
  year: string
  badge: string

  // Concept section
  conceptLabel: string
  concept: string
  description: string

  // Design intent section
  designIntentLabel: string
  designIntent: string

  // Materials
  materials: string[]

  // Images
  coverImage: string
  images: string[]
}

const BASE = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed: ${res.status}`)
  }
  return res.json()
}

// ── Portfolio grid ────────────────────────────────────────────────────────────
export function fetchProjects(): Promise<Pick<Project, 'id' | 'name' | 'location' | 'category' | 'year' | 'badge' | 'concept' | 'coverImage'>[]> {
  return request('/projects')
}

// ── Project detail ────────────────────────────────────────────────────────────
export function fetchProject(id: string): Promise<Project> {
  return request(`/projects/${id}`)
}

// ── Admin helpers ─────────────────────────────────────────────────────────────
export function createProject(data: Partial<Project>): Promise<Project> {
  return request('/projects', { method: 'POST', body: JSON.stringify(data) })
}

export function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  return request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export function deleteProject(id: string): Promise<{ message: string }> {
  return request(`/projects/${id}`, { method: 'DELETE' })
}

/**
 * Upload one or more image files to Cloudinary via the backend.
 * Returns an array of secure Cloudinary URLs.
 */
export async function uploadImages(files: File[]): Promise<string[]> {
  const form = new FormData()
  files.forEach(f => form.append('images', f))
  const res = await fetch(`${BASE}/projects/upload-images`, { method: 'POST', body: form })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || 'Upload failed')
  }
  const data = await res.json()
  return data.urls as string[]
}
