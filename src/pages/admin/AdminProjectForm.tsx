import { useState, useRef, ChangeEvent } from 'react'
import { Project, uploadImages } from '../../lib/api'
import { X, Plus, Upload, Loader2, GripVertical, Star } from 'lucide-react'

type FormData = Omit<Project, 'badge'>

interface Props {
  initial?: Partial<FormData>
  onSave: (data: Partial<FormData>) => Promise<void>
  onCancel: () => void
  isEdit?: boolean
}

const DEFAULT: Partial<FormData> = {
  id: '',
  name: '',
  location: '',
  category: 'residential',
  year: new Date().getFullYear().toString(),
  conceptLabel: 'The Concept',
  concept: '',
  description: '',
  designIntentLabel: 'Design Intent',
  designIntent: '',
  materials: [],
  coverImage: '',
  heroImage: '',
  images: [],
}

export default function AdminProjectForm({ initial, onSave, onCancel, isEdit }: Props) {
  const [form, setForm] = useState<Partial<FormData>>({ ...DEFAULT, ...initial })
  const [materialInput, setMaterialInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Image upload state
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingHero, setUploadingHero] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const coverRef = useRef<HTMLInputElement>(null)
  const heroRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  // URL paste state
  const [coverUrlInput, setCoverUrlInput] = useState('')
  const [heroUrlInput, setHeroUrlInput] = useState('')
  const [galleryUrlInput, setGalleryUrlInput] = useState('')

  const applyCoverUrl = () => {
    const url = coverUrlInput.trim()
    if (!url) return
    set('coverImage', url)
    setCoverUrlInput('')
  }

  const applyHeroUrl = () => {
    const url = heroUrlInput.trim()
    if (!url) return
    set('heroImage', url)
    setHeroUrlInput('')
  }

  const addGalleryUrl = () => {
    const url = galleryUrlInput.trim()
    if (!url) return
    set('images', [...(form.images || []), url])
    setGalleryUrlInput('')
  }

  const set = (key: keyof FormData, value: unknown) =>
    setForm(f => ({ ...f, [key]: value }))

  const slugify = (str: string) =>
    str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const handleNameChange = (val: string) => {
    set('name', val)
    if (!isEdit) set('id', slugify(val))
  }

  const addMaterial = () => {
    const m = materialInput.trim()
    if (!m) return
    set('materials', [...(form.materials || []), m])
    setMaterialInput('')
  }

  const removeMaterial = (i: number) =>
    set('materials', (form.materials || []).filter((_, idx) => idx !== i))

  const handleCoverUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploadingCover(true)
    try {
      const urls = await uploadImages([files[0]])
      set('coverImage', urls[0])
    } catch (err: unknown) {
      setError((err as Error).message)
    } finally {
      setUploadingCover(false)
      if (coverRef.current) coverRef.current.value = ''
    }
  }

  const handleHeroUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploadingHero(true)
    try {
      const urls = await uploadImages([files[0]])
      set('heroImage', urls[0])
    } catch (err: unknown) {
      setError((err as Error).message)
    } finally {
      setUploadingHero(false)
      if (heroRef.current) heroRef.current.value = ''
    }
  }

  const handleGalleryUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploadingGallery(true)
    try {
      const urls = await uploadImages(files)
      set('images', [...(form.images || []), ...urls])
    } catch (err: unknown) {
      setError((err as Error).message)
    } finally {
      setUploadingGallery(false)
      if (galleryRef.current) galleryRef.current.value = ''
    }
  }

  const removeImage = (i: number) =>
    set('images', (form.images || []).filter((_, idx) => idx !== i))

  const moveImage = (from: number, to: number) => {
    const imgs = [...(form.images || [])]
    const [item] = imgs.splice(from, 1)
    imgs.splice(to, 0, item)
    set('images', imgs)
  }

  const handleSubmit = async () => {
    setError('')
    if (!form.name?.trim()) return setError('Project name is required.')
    if (!form.id?.trim()) return setError('Project ID / slug is required.')
    if (!form.category) return setError('Category is required.')
    setSaving(true)
    try {
      await onSave(form)
    } catch (err: unknown) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="apf-overlay">
      <div className="apf-panel">
        {/* Header */}
        <div className="apf-header">
          <h2 className="apf-title">{isEdit ? 'Edit Project' : 'Add New Project'}</h2>
          <button className="apf-close" onClick={onCancel}><X size={20} /></button>
        </div>

        <div className="apf-body">
          {error && <div className="apf-error">{error}</div>}

          {/* ── Basic Info ── */}
          <section className="apf-section">
            <h3 className="apf-section-title">Basic Information</h3>
            <div className="apf-grid-2">
              <div className="apf-field">
                <label>Project Name <span className="req">*</span></label>
                <input value={form.name || ''} onChange={e => handleNameChange(e.target.value)} placeholder="e.g. Serenity Villa" />
              </div>
              <div className="apf-field">
                <label>Slug / ID <span className="req">*</span></label>
                <input
                  value={form.id || ''}
                  onChange={e => set('id', slugify(e.target.value))}
                  placeholder="e.g. serenity-villa-mumbai"
                  readOnly={isEdit}
                  style={isEdit ? { opacity: 0.5 } : {}}
                />
              </div>
              <div className="apf-field">
                <label>Location</label>
                <input value={form.location || ''} onChange={e => set('location', e.target.value)} placeholder="e.g. Juhu, Mumbai" />
              </div>
              <div className="apf-field">
                <label>Year</label>
                <input value={form.year || ''} onChange={e => set('year', e.target.value)} placeholder="e.g. 2024" />
              </div>
              <div className="apf-field">
                <label>Category <span className="req">*</span></label>
                <select value={form.category || 'residential'} onChange={e => set('category', e.target.value)}>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="architecture">Architecture</option>
                </select>
              </div>
            </div>
          </section>

          {/* ── Concept ── */}
          <section className="apf-section">
            <h3 className="apf-section-title">Concept Section</h3>
            <div className="apf-grid-2">
              <div className="apf-field">
                <label>Concept Label</label>
                <input value={form.conceptLabel || ''} onChange={e => set('conceptLabel', e.target.value)} placeholder="The Concept" />
              </div>
              <div className="apf-field">
                <label>Concept Tagline</label>
                <input value={form.concept || ''} onChange={e => set('concept', e.target.value)} placeholder="e.g. Calm monumentality with organic textures" />
              </div>
            </div>
            <div className="apf-field apf-field-full">
              <label>Description</label>
              <textarea rows={4} value={form.description || ''} onChange={e => set('description', e.target.value)} placeholder="Long-form description of the project…" />
            </div>
          </section>

          {/* ── Design Intent ── */}
          <section className="apf-section">
            <h3 className="apf-section-title">Design Intent</h3>
            <div className="apf-grid-2">
              <div className="apf-field">
                <label>Design Intent Label</label>
                <input value={form.designIntentLabel || ''} onChange={e => set('designIntentLabel', e.target.value)} placeholder="Design Intent" />
              </div>
            </div>
            <div className="apf-field apf-field-full">
              <label>Design Intent Quote</label>
              <textarea rows={3} value={form.designIntent || ''} onChange={e => set('designIntent', e.target.value)} placeholder="e.g. To create a home that breathes — where every surface tells a quiet story." />
            </div>
          </section>

          {/* ── Materials ── */}
          <section className="apf-section">
            <h3 className="apf-section-title">Materials</h3>
            <div className="apf-materials-input">
              <input
                value={materialInput}
                onChange={e => setMaterialInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addMaterial() } }}
                placeholder="e.g. Lime-washed oak — press Enter or click Add"
              />
              <button type="button" className="apf-add-btn" onClick={addMaterial}><Plus size={16} /> Add</button>
            </div>
            {(form.materials || []).length > 0 && (
              <div className="apf-tags">
                {(form.materials || []).map((m, i) => (
                  <span key={i} className="apf-tag">
                    {m}
                    <button onClick={() => removeMaterial(i)}><X size={12} /></button>
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* ── Cover Image (portfolio page card) ── */}
          <section className="apf-section">
            <h3 className="apf-section-title">Cover Image</h3>
            <p className="apf-hint">The thumbnail image shown on the Portfolio page card.</p>
            {form.coverImage ? (
              <div className="apf-cover-preview">
                <img src={form.coverImage} alt="Cover" />
                <button className="apf-cover-remove" onClick={() => set('coverImage', '')}>
                  <X size={14} /> Remove
                </button>
              </div>
            ) : (
              <div className="apf-upload-zone" onClick={() => coverRef.current?.click()}>
                {uploadingCover
                  ? <><Loader2 size={24} className="apf-spin" /> Uploading…</>
                  : <><Upload size={24} /> Click to upload cover image</>}
              </div>
            )}
            <input ref={coverRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverUpload} />
            {/* URL paste option for cover */}
            {!form.coverImage && (
              <div className="apf-url-row" style={{ marginTop: 10 }}>
                <span className="apf-url-label">Or paste URL:</span>
                <input
                  className="apf-url-input"
                  type="url"
                  value={coverUrlInput}
                  onChange={e => setCoverUrlInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyCoverUrl() } }}
                  placeholder="https://example.com/cover.jpg"
                />
                <button
                  type="button"
                  className="apf-url-btn"
                  onClick={applyCoverUrl}
                  disabled={!coverUrlInput.trim()}
                >
                  Use URL
                </button>
              </div>
            )}
          </section>

          {/* ── Hero Image (project detail page banner) ── */}
          <section className="apf-section">
            <h3 className="apf-section-title">Hero Image</h3>
            <p className="apf-hint">The large banner image shown at the top of the project detail page.</p>
            {form.heroImage ? (
              <div className="apf-cover-preview">
                <img src={form.heroImage} alt="Hero" />
                <button className="apf-cover-remove" onClick={() => set('heroImage', '')}>
                  <X size={14} /> Remove
                </button>
              </div>
            ) : (
              <div className="apf-upload-zone" onClick={() => heroRef.current?.click()}>
                {uploadingHero
                  ? <><Loader2 size={24} className="apf-spin" /> Uploading…</>
                  : <><Upload size={24} /> Click to upload hero image</>}
              </div>
            )}
            <input ref={heroRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleHeroUpload} />
            {/* URL paste option for hero */}
            {!form.heroImage && (
              <div className="apf-url-row" style={{ marginTop: 10 }}>
                <span className="apf-url-label">Or paste URL:</span>
                <input
                  className="apf-url-input"
                  type="url"
                  value={heroUrlInput}
                  onChange={e => setHeroUrlInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyHeroUrl() } }}
                  placeholder="https://example.com/hero.jpg"
                />
                <button
                  type="button"
                  className="apf-url-btn"
                  onClick={applyHeroUrl}
                  disabled={!heroUrlInput.trim()}
                >
                  Use URL
                </button>
              </div>
            )}
          </section>

          {/* ── Gallery Images ── */}
          <section className="apf-section">
            <h3 className="apf-section-title">Gallery Images</h3>
            <p className="apf-hint">Shown on the project detail page. Reorder with ↑ ↓.</p>

            <div className="apf-upload-zone" onClick={() => galleryRef.current?.click()}>
              {uploadingGallery
                ? <><Loader2 size={24} className="apf-spin" /> Uploading…</>
                : <><Upload size={24} /> Click to upload gallery images (multiple allowed)</>}
            </div>
            <input ref={galleryRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleGalleryUpload} />
            {/* URL paste option for gallery */}
            <div className="apf-url-row" style={{ marginTop: 10 }}>
              <span className="apf-url-label">Or paste URL:</span>
              <input
                className="apf-url-input"
                type="url"
                value={galleryUrlInput}
                onChange={e => setGalleryUrlInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addGalleryUrl() } }}
                placeholder="https://example.com/image.jpg"
              />
              <button
                type="button"
                className="apf-url-btn"
                onClick={addGalleryUrl}
                disabled={!galleryUrlInput.trim()}
              >
                Add URL
              </button>
            </div>

            {(form.images || []).length > 0 && (
              <div className="apf-gallery-grid">
                {(form.images || []).map((url, i) => (
                  <div key={i} className={`apf-gallery-item${form.heroImage === url ? ' apf-gallery-item-hero' : ''}`}>
                    <img src={url} alt={`Image ${i + 1}`} />
                    <div className="apf-gallery-overlay">
                      <button onClick={() => removeImage(i)} title="Remove" className="apf-gal-btn apf-gal-btn-del"><X size={12} /></button>
                    </div>
                    <div className="apf-gallery-order">
                      {i > 0 && <button onClick={() => moveImage(i, i - 1)} className="apf-ord-btn">↑</button>}
                      {i < (form.images || []).length - 1 && <button onClick={() => moveImage(i, i + 1)} className="apf-ord-btn">↓</button>}
                    </div>
                    <button
                      onClick={() => set('heroImage', form.heroImage === url ? '' : url)}
                      title={form.heroImage === url ? 'Unset as hero image' : 'Use as hero image'}
                      className={`apf-hero-toggle${form.heroImage === url ? ' apf-hero-toggle-active' : ''}`}
                    >
                      <Star size={11} fill={form.heroImage === url ? 'currentColor' : 'none'} />
                      {form.heroImage === url ? 'Hero' : 'Set Hero'}
                    </button>
                    <span className="apf-gallery-num">#{i + 1}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="apf-footer">
          <button className="apf-btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="apf-btn-save" onClick={handleSubmit} disabled={saving}>
            {saving ? <><Loader2 size={15} className="apf-spin" /> Saving…</> : isEdit ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </div>

      <style>{`
        .apf-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(60,40,20,0.45);
          display: flex; align-items: flex-start; justify-content: center;
          overflow-y: auto; padding: 32px 16px;
        }
        .apf-panel {
          background: #ffffff;
          border: 1px solid #e2d9ce;
          border-radius: 8px;
          width: 100%; max-width: 1200px;
          display: flex; flex-direction: column;
          box-shadow: 0 16px 60px rgba(100,70,40,0.18);
        }
        .apf-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 24px 32px;
          border-bottom: 1px solid #ede8e1;
        }
        .apf-title { margin: 0; font-size: 20px; color: #1a1612; font-weight: normal; letter-spacing: 0.03em; }
        .apf-close {
          background: none; border: none; color: #b0a498; cursor: pointer; padding: 4px;
          border-radius: 4px; transition: color 0.2s;
          display: flex; align-items: center;
        }
        .apf-close:hover { color: #7a6245; }
        .apf-body { padding: 24px 32px; display: flex; flex-direction: column; gap: 0; overflow-y: auto; }
        .apf-section { margin-bottom: 32px; }
        .apf-section-title {
          font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase;
          color: #b0a498; font-family: Arial, sans-serif; margin: 0 0 16px 0;
          padding-bottom: 8px; border-bottom: 1px solid #ede8e1; font-weight: 600;
        }
        .apf-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        @media (max-width: 600px) { .apf-grid-2 { grid-template-columns: 1fr; } }
        .apf-field { display: flex; flex-direction: column; gap: 6px; }
        .apf-field-full { width: 100%; }
        .apf-field label {
          font-size: 11px; letter-spacing: 0.15em; color: #9a8e82;
          font-family: Arial, sans-serif; text-transform: uppercase;
        }
        .req { color: #b85a4a; }
        .apf-field input, .apf-field select, .apf-field textarea {
          background: #faf8f5; border: 1px solid #ddd7ce;
          border-radius: 4px; color: #1a1612; font-size: 14px;
          padding: 10px 12px; outline: none; font-family: Arial, sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s; resize: vertical;
        }
        .apf-field input:focus, .apf-field select:focus, .apf-field textarea:focus {
          border-color: #7a6245; box-shadow: 0 0 0 3px rgba(122,98,69,0.08);
        }
        .apf-field input::placeholder, .apf-field textarea::placeholder { color: #c8c0b5; }
        .apf-field select option { background: #ffffff; color: #1a1612; }
        .apf-hint { font-size: 12px; color: #b0a498; font-family: Arial, sans-serif; margin: 0 0 12px 0; }
        .apf-error {
          background: #fdf0ee; border: 1px solid #e8b5ad; border-radius: 4px;
          color: #b85a4a; font-size: 13px; font-family: Arial, sans-serif;
          padding: 10px 14px; margin-bottom: 16px;
        }
        .apf-materials-input { display: flex; gap: 8px; }
        .apf-materials-input input {
          flex: 1; background: #faf8f5; border: 1px solid #ddd7ce;
          border-radius: 4px; color: #1a1612; font-size: 14px;
          padding: 10px 12px; outline: none; font-family: Arial, sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .apf-materials-input input:focus { border-color: #7a6245; box-shadow: 0 0 0 3px rgba(122,98,69,0.08); }
        .apf-add-btn {
          display: flex; align-items: center; gap: 6px;
          background: #f0ebe3; border: 1px solid #ddd7ce;
          color: #7a6245; border-radius: 4px; padding: 0 16px;
          font-size: 13px; font-family: Arial, sans-serif; cursor: pointer;
          white-space: nowrap; transition: background 0.2s;
        }
        .apf-add-btn:hover { background: #e8e0d5; }
        .apf-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
        .apf-tag {
          display: flex; align-items: center; gap: 6px;
          background: #f0ebe3; border: 1px solid #ddd7ce;
          color: #7a6245; border-radius: 20px;
          padding: 4px 12px 4px 14px; font-size: 13px;
          font-family: Arial, sans-serif;
        }
        .apf-tag button {
          background: none; border: none; color: #b0a498;
          cursor: pointer; padding: 0; display: flex; align-items: center;
          transition: color 0.2s;
        }
        .apf-tag button:hover { color: #b85a4a; }
        .apf-upload-zone {
          border: 2px dashed #ddd7ce; border-radius: 6px;
          padding: 32px; text-align: center;
          color: #b0a498; font-family: Arial, sans-serif; font-size: 14px;
          cursor: pointer; transition: border-color 0.2s, color 0.2s, background 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          background: #faf8f5;
        }
        .apf-upload-zone:hover { border-color: #7a6245; color: #7a6245; background: #f5f0e8; }
        .apf-spin { animation: spin 1s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .apf-cover-preview { position: relative; display: inline-block; margin-top: 0; }
        .apf-cover-preview img {
          width: 100%; max-width: 320px; border-radius: 6px;
          border: 1px solid #e2d9ce; display: block; object-fit: cover; height: 180px;
        }
        .apf-cover-remove {
          position: absolute; top: 8px; right: 8px;
          background: rgba(255,255,255,0.9); border: 1px solid #e2d9ce; color: #b85a4a;
          border-radius: 4px; padding: 4px 10px; font-size: 12px;
          cursor: pointer; display: flex; align-items: center; gap: 4px;
          font-family: Arial, sans-serif;
        }
        .apf-gallery-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 12px; margin-top: 16px;
        }
        .apf-gallery-item {
          position: relative; border-radius: 6px; overflow: hidden;
          border: 1px solid #e2d9ce; aspect-ratio: 4/3;
          box-sizing: border-box;
        }
        .apf-gallery-item-hero { border-color: #C9A96E; box-shadow: inset 0 0 0 1px #C9A96E, 0 0 0 2px rgba(201,169,110,0.25); }
        .apf-gallery-item img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .apf-gallery-overlay {
          position: absolute; top: 4px; right: 4px;
          display: flex; align-items: center; justify-content: flex-end; gap: 8px;
          opacity: 0; transition: opacity 0.2s;
        }
        .apf-gallery-item:hover .apf-gallery-overlay { opacity: 1; }
        .apf-gal-btn {
          background: rgba(255,255,255,0.92); color: #7a6245;
          border: none; border-radius: 4px; padding: 4px 6px;
          font-size: 11px; font-family: Arial, sans-serif; cursor: pointer;
          font-weight: 600; transition: background 0.2s;
          display: flex; align-items: center; gap: 4px;
        }
        .apf-gal-btn:hover { background: #ffffff; }
        .apf-gal-btn-del { background: rgba(184,90,74,0.9); color: #fff; }
        .apf-gal-btn-del:hover { background: rgba(184,90,74,1); }
        .apf-hero-toggle {
          position: absolute; bottom: 4px; right: 4px; z-index: 2;
          display: flex; align-items: center; gap: 4px;
          background: rgba(26,22,18,0.72); color: #f0ebe3;
          border: none; border-radius: 20px; padding: 4px 9px;
          font-size: 10px; font-family: Arial, sans-serif; cursor: pointer;
          letter-spacing: 0.02em; transition: background 0.2s, color 0.2s;
          opacity: 0;
        }
        .apf-gallery-item:hover .apf-hero-toggle, .apf-hero-toggle-active { opacity: 1; }
        .apf-hero-toggle:hover { background: rgba(26,22,18,0.9); }
        .apf-hero-toggle-active {
          background: #C9A96E; color: #2a2218;
        }
        .apf-gallery-order {
          position: absolute; bottom: 4px; left: 4px; display: flex; gap: 4px;
        }
        .apf-ord-btn {
          background: rgba(255,255,255,0.85); color: #7a6245;
          border: none; border-radius: 2px; padding: 2px 6px;
          font-size: 12px; cursor: pointer; transition: background 0.2s;
        }
        .apf-ord-btn:hover { background: rgba(255,255,255,1); }
        .apf-gallery-num {
          position: absolute; top: 6px; left: 6px;
          background: rgba(26,22,18,0.6); color: #f5f0e8;
          font-size: 10px; font-family: Arial, sans-serif;
          padding: 2px 7px; border-radius: 10px; letter-spacing: 0.05em;
        }
        .apf-footer {
          display: flex; justify-content: flex-end; gap: 12px;
          padding: 20px 32px; border-top: 1px solid #ede8e1;
          background: #faf8f5; border-radius: 0 0 8px 8px;
        }
        .apf-btn-ghost {
          background: none; border: 1px solid #ddd7ce; color: #9a8e82;
          border-radius: 4px; padding: 10px 24px; font-size: 13px;
          font-family: Arial, sans-serif; cursor: pointer; transition: all 0.2s;
        }
        .apf-btn-ghost:hover { border-color: #9a8e82; color: #1a1612; }
        .apf-btn-save {
          background: #7a6245; color: #ffffff; border: none;
          border-radius: 4px; padding: 10px 28px; font-size: 13px;
          letter-spacing: 0.1em; font-family: Arial, sans-serif; cursor: pointer;
          font-weight: 600; transition: background 0.2s; text-transform: uppercase;
          display: flex; align-items: center; gap: 8px;
        }
        .apf-btn-save:hover:not(:disabled) { background: #6a5438; }
        .apf-btn-save:disabled { opacity: 0.5; cursor: default; }
        .apf-url-row {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
        }
        .apf-url-label {
          font-size: 11px; color: #b0a498; font-family: Arial, sans-serif;
          white-space: nowrap;
        }
        .apf-url-input {
          flex: 1; min-width: 160px;
          background: #faf8f5; border: 1px solid #ddd7ce;
          border-radius: 4px; color: #1a1612; font-size: 12px;
          padding: 6px 10px; outline: none; font-family: Arial, sans-serif;
          transition: border-color 0.2s;
        }
        .apf-url-input:focus { border-color: #7a6245; }
        .apf-url-input::placeholder { color: #c8c0b5; }
        .apf-url-btn {
          background: none; border: 1px solid #c8bfb2; color: #7a6245;
          border-radius: 4px; padding: 6px 14px; font-size: 11px;
          font-family: Arial, sans-serif; cursor: pointer; white-space: nowrap;
          letter-spacing: 0.04em; transition: all 0.2s;
        }
        .apf-url-btn:hover:not(:disabled) { border-color: #7a6245; background: #f5f0e8; }
        .apf-url-btn:disabled { opacity: 0.4; cursor: default; }
      `}</style>
    </div>
  )
}
