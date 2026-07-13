import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  fetchEnquiries, updateEnquiry, deleteEnquiry, downloadEnquiriesExcel,
  clearExcelToken, Enquiry,
} from '../../lib/api'
import { LogOut, RefreshCw, Download, Pencil, Trash2, Loader2, X, Check } from 'lucide-react'

const EDITABLE_FIELDS: { key: keyof Enquiry; label: string; type: 'text' | 'textarea' }[] = [
  { key: 'fullName', label: 'Full Name', type: 'text' },
  { key: 'phone', label: 'Phone Number', type: 'text' },
  { key: 'email', label: 'Email Address', type: 'text' },
  { key: 'spaceType', label: 'Type of Space', type: 'text' },
  { key: 'location', label: 'Project Location', type: 'text' },
  { key: 'projectType', label: 'Project Type', type: 'text' },
  { key: 'budget', label: 'Estimated Budget', type: 'text' },
  { key: 'referral', label: 'How Did You Hear About Us', type: 'text' },
  { key: 'requirements', label: 'Brief Requirements', type: 'textarea' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
]

export default function ExcelDashboard() {
  const navigate = useNavigate()
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [editing, setEditing] = useState<Enquiry | null>(null)
  const [editForm, setEditForm] = useState<Partial<Enquiry>>({})
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)

  const flash = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000) }

  const load = async () => {
    setLoading(true); setError('')
    try { setEnquiries(await fetchEnquiries()) }
    catch (e: unknown) { setError((e as Error).message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleLogout = () => { clearExcelToken(); navigate('/excelsheet') }

  const openEdit = (enquiry: Enquiry) => {
    setEditing(enquiry)
    setEditForm({ ...enquiry })
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    try {
      await updateEnquiry(editing._id, editForm)
      await load()
      setEditing(null)
      flash('Record updated.')
    } catch (e: unknown) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try { await deleteEnquiry(id); await load(); flash('Record deleted.') }
    catch (e: unknown) { setError((e as Error).message) }
    finally { setDeletingId(null); setConfirmDelete(null) }
  }

  const handleDownload = async () => {
    setDownloading(true)
    try { await downloadEnquiriesExcel() }
    catch (e: unknown) { setError((e as Error).message) }
    finally { setDownloading(false) }
  }

  return (
    <div className="exc-root">
      <aside className="exc-sidebar">
        <div className="exc-sidebar-brand">
          <span className="exc-brand-name">nivora</span>
          <span className="exc-brand-sub">enquiry records</span>
        </div>
        <div className="exc-sidebar-footer">
          <button className="exc-logout" onClick={handleLogout}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="exc-main">
        <header className="exc-topbar">
          <div className="exc-topbar-left">
            <h1 className="exc-page-title">Contact Form Records</h1>
            <span className="exc-count">{enquiries.length} {enquiries.length === 1 ? 'entry' : 'entries'}</span>
          </div>
          <div className="exc-topbar-right">
            <button className="exc-btn-ghost-sm" onClick={load} title="Refresh"><RefreshCw size={15} /></button>
            <button className="exc-btn-add" onClick={handleDownload} disabled={downloading || enquiries.length === 0}>
              {downloading ? <Loader2 size={16} className="exc-spin" /> : <Download size={16} />} Download Excel
            </button>
          </div>
        </header>

        {successMsg && <div className="exc-success">{successMsg}</div>}
        {error && (
          <div className="exc-error">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        <div className="exc-content">
          {loading ? (
            <div className="exc-loading"><Loader2 size={28} className="exc-spin" /> Loading records…</div>
          ) : enquiries.length === 0 ? (
            <div className="exc-empty"><p>No enquiries submitted yet.</p></div>
          ) : (
            <div className="exc-table-wrap">
              <table className="exc-table">
                <thead>
                  <tr>
                    <th>Submitted</th>
                    <th>Full Name</th><th>Phone</th><th>Email</th>
                    <th>Space Type</th><th>Location</th><th>Project Type</th>
                    <th>Budget</th><th>Email Sent</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map(e => (
                    <tr key={e._id}>
                      <td className="exc-cell-muted">{new Date(e.createdAt).toLocaleString()}</td>
                      <td className="exc-name">{e.fullName}</td>
                      <td className="exc-cell-muted">{e.phone}</td>
                      <td className="exc-cell-muted">{e.email}</td>
                      <td className="exc-cell-muted">{e.spaceType || '—'}</td>
                      <td className="exc-cell-muted">{e.location || '—'}</td>
                      <td className="exc-cell-muted">{e.projectType || '—'}</td>
                      <td className="exc-cell-muted">{e.budget || '—'}</td>
                      <td>
                        <span className={`exc-badge ${e.emailSent ? 'exc-badge-yes' : 'exc-badge-no'}`}>
                          {e.emailSent ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        <div className="exc-actions">
                          <button className="exc-action-btn" onClick={() => openEdit(e)} title="Edit">
                            <Pencil size={14} />
                          </button>
                          {confirmDelete === e._id ? (
                            <div className="exc-confirm">
                              <span>Delete?</span>
                              <button className="exc-confirm-yes" onClick={() => handleDelete(e._id)} disabled={deletingId === e._id}>
                                {deletingId === e._id ? <Loader2 size={12} className="exc-spin" /> : <Check size={12} />}
                              </button>
                              <button className="exc-confirm-no" onClick={() => setConfirmDelete(null)}><X size={12} /></button>
                            </div>
                          ) : (
                            <button className="exc-action-btn exc-action-del" onClick={() => setConfirmDelete(e._id)} title="Delete">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Edit modal */}
      {editing && (
        <div className="exc-modal-overlay" onClick={() => !saving && setEditing(null)}>
          <div className="exc-modal" onClick={e => e.stopPropagation()}>
            <div className="exc-modal-header">
              <h2>Edit Record</h2>
              <button className="exc-modal-close" onClick={() => !saving && setEditing(null)}><X size={18} /></button>
            </div>
            <div className="exc-modal-body">
              {EDITABLE_FIELDS.map(f => (
                <div key={f.key} className="exc-field">
                  <label>{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea
                      value={(editForm[f.key] as string) || ''}
                      onChange={e => setEditForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    />
                  ) : (
                    <input
                      type="text"
                      value={(editForm[f.key] as string) || ''}
                      onChange={e => setEditForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="exc-modal-footer">
              <button className="exc-btn-ghost" onClick={() => setEditing(null)} disabled={saving}>Cancel</button>
              <button className="exc-btn-add" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 size={16} className="exc-spin" /> : null} Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; }
        .exc-root { min-height: 100vh; display: flex; background: #f0ebe3; font-family: Arial, sans-serif; }
        .exc-sidebar {
          width: 230px; min-height: 100vh; flex-shrink: 0;
          background: #ffffff; border-right: 1px solid #e2d9ce;
          display: flex; flex-direction: column;
          position: sticky; top: 0; height: 100vh;
        }
        .exc-sidebar-brand { padding: 28px 24px 20px; border-bottom: 1px solid #ede8e1; }
        .exc-brand-name { display: block; font-size: 24px; color: #7a6245; font-family: Georgia, serif; font-style: italic; letter-spacing: 0.1em; }
        .exc-brand-sub { display: block; font-size: 9px; letter-spacing: 0.25em; color: #c0b5a8; text-transform: uppercase; margin-top: 2px; }
        .exc-sidebar-footer { margin-top: auto; padding: 20px 24px; border-top: 1px solid #ede8e1; }
        .exc-logout { display: flex; align-items: center; gap: 8px; background: none; border: none; color: #9a8e82; cursor: pointer; font-size: 13px; padding: 0; transition: color 0.2s; }
        .exc-logout:hover { color: #b85a4a; }
        .exc-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .exc-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 32px; border-bottom: 1px solid #e2d9ce;
          background: #ffffff; position: sticky; top: 0; z-index: 10;
          box-shadow: 0 1px 0 #e2d9ce;
        }
        .exc-topbar-left { display: flex; align-items: baseline; gap: 12px; }
        .exc-page-title { margin: 0; font-size: 18px; color: #1a1612; font-weight: normal; letter-spacing: 0.03em; }
        .exc-count { font-size: 12px; color: #c0b5a8; }
        .exc-topbar-right { display: flex; align-items: center; gap: 10px; }
        .exc-btn-ghost-sm {
          background: none; border: 1px solid #ddd7ce; color: #9a8e82;
          border-radius: 4px; padding: 7px 9px; cursor: pointer;
          display: flex; align-items: center; transition: all 0.2s;
        }
        .exc-btn-ghost-sm:hover { border-color: #7a6245; color: #7a6245; }
        .exc-btn-ghost {
          background: none; border: 1px solid #ddd7ce; color: #6b5d4f;
          border-radius: 4px; padding: 9px 18px; font-size: 13px; cursor: pointer;
        }
        .exc-btn-ghost:hover { border-color: #7a6245; color: #7a6245; }
        .exc-btn-add {
          display: flex; align-items: center; gap: 8px;
          background: #7a6245; color: #ffffff; border: none;
          border-radius: 4px; padding: 9px 18px; font-size: 13px;
          letter-spacing: 0.04em; cursor: pointer; font-weight: 600;
          transition: background 0.2s;
        }
        .exc-btn-add:hover:not(:disabled) { background: #6a5438; }
        .exc-btn-add:disabled { opacity: 0.5; cursor: default; }
        .exc-success {
          margin: 16px 32px 0; background: #f0f7f0; border: 1px solid #b5d9b5;
          color: #3a7a3a; border-radius: 4px; padding: 10px 16px; font-size: 13px;
        }
        .exc-error {
          margin: 16px 32px 0; background: #fdf0ee; border: 1px solid #e8b5ad;
          color: #b85a4a; border-radius: 4px; padding: 10px 16px; font-size: 13px;
          display: flex; justify-content: space-between; align-items: center;
        }
        .exc-error button { background: none; border: none; color: #b85a4a; cursor: pointer; font-size: 18px; }
        .exc-content { padding: 28px 32px; flex: 1; }
        .exc-loading, .exc-empty {
          display: flex; align-items: center; justify-content: center;
          flex-direction: column; gap: 16px; color: #b0a498;
          font-size: 14px; padding: 80px 0;
        }
        .exc-spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .exc-table-wrap { overflow-x: auto; border-radius: 6px; border: 1px solid #e2d9ce; background: #fff; }
        .exc-table { width: 100%; border-collapse: collapse; }
        .exc-table thead tr { background: #faf8f5; }
        .exc-table th {
          padding: 12px 16px; font-size: 10px; letter-spacing: 0.15em;
          text-transform: uppercase; color: #b0a498; font-weight: 600;
          text-align: left; border-bottom: 1px solid #ede8e1; white-space: nowrap;
        }
        .exc-table td {
          padding: 14px 16px; font-size: 13px; color: #2a2218;
          border-bottom: 1px solid #f0ebe3; vertical-align: middle; white-space: nowrap;
        }
        .exc-table tbody tr:last-child td { border-bottom: none; }
        .exc-table tbody tr:hover td { background: #faf8f5; }
        .exc-name { color: #1a1612; font-size: 14px; font-weight: 500; }
        .exc-cell-muted { color: #9a8e82; }
        .exc-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; }
        .exc-badge-yes { background: #eaf4ea; color: #3a7a3a; }
        .exc-badge-no { background: #fdf0ee; color: #b85a4a; }
        .exc-actions { display: flex; align-items: center; justify-content: flex-end; gap: 8px; }
        .exc-action-btn {
          background: none; border: 1px solid #ddd7ce; color: #9a8e82;
          border-radius: 4px; padding: 6px 8px; cursor: pointer;
          display: flex; align-items: center; transition: all 0.2s;
        }
        .exc-action-btn:hover { border-color: #7a6245; color: #7a6245; }
        .exc-action-del:hover { border-color: #b85a4a; color: #b85a4a; }
        .exc-confirm { display: flex; align-items: center; gap: 6px; }
        .exc-confirm span { font-size: 12px; color: #b85a4a; }
        .exc-confirm-yes {
          background: #b85a4a; color: #fff; border: none; border-radius: 4px;
          padding: 4px 8px; cursor: pointer; display: flex; align-items: center;
        }
        .exc-confirm-no {
          background: none; border: 1px solid #ddd7ce; color: #9a8e82;
          border-radius: 4px; padding: 4px 8px; cursor: pointer; display: flex; align-items: center;
        }
        .exc-confirm-no:hover { color: #7a6245; border-color: #7a6245; }

        .exc-modal-overlay {
          position: fixed; inset: 0; background: rgba(30,25,20,0.4);
          display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px;
        }
        .exc-modal {
          background: #fff; border-radius: 8px; width: 100%; max-width: 560px;
          max-height: 88vh; display: flex; flex-direction: column; overflow: hidden;
        }
        .exc-modal-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 24px; border-bottom: 1px solid #ede8e1;
        }
        .exc-modal-header h2 { margin: 0; font-size: 16px; color: #1a1612; font-weight: 600; }
        .exc-modal-close { background: none; border: none; color: #9a8e82; cursor: pointer; display: flex; }
        .exc-modal-close:hover { color: #1a1612; }
        .exc-modal-body { padding: 20px 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
        .exc-field { display: flex; flex-direction: column; gap: 6px; }
        .exc-field label { font-size: 11px; letter-spacing: 0.1em; color: #9a8e82; text-transform: uppercase; }
        .exc-field input, .exc-field textarea {
          border: 1px solid #ddd7ce; border-radius: 4px; padding: 9px 12px;
          font-size: 13px; color: #1a1612; font-family: Arial, sans-serif; outline: none;
        }
        .exc-field input:focus, .exc-field textarea:focus { border-color: #7a6245; }
        .exc-field textarea { min-height: 70px; resize: vertical; }
        .exc-modal-footer {
          display: flex; justify-content: flex-end; gap: 10px;
          padding: 16px 24px; border-top: 1px solid #ede8e1;
        }
      `}</style>
    </div>
  )
}
