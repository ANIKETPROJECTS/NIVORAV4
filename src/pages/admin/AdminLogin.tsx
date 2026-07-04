import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../../lib/api'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await adminLogin(username, password)
      navigate('/adminpannel/dashboard')
    } catch (err: unknown) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-root">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <span className="admin-login-brand">nivora</span>
          <span className="admin-login-sub">ADMIN PANEL</span>
        </div>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-field">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter username"
              autoFocus
              required
            />
          </div>
          <div className="admin-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          {error && <p className="admin-login-error">{error}</p>}
          <button type="submit" className="admin-btn-primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>

      <style>{`
        .admin-login-root {
          min-height: 100vh;
          background: #f0ebe3;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Georgia', serif;
        }
        .admin-login-card {
          background: #ffffff;
          border: 1px solid #e2d9ce;
          border-radius: 6px;
          padding: 48px 40px;
          width: 100%;
          max-width: 380px;
          box-shadow: 0 8px 40px rgba(100,80,60,0.10);
        }
        .admin-login-logo {
          text-align: center;
          margin-bottom: 36px;
        }
        .admin-login-brand {
          display: block;
          font-size: 32px;
          letter-spacing: 0.12em;
          color: #7a6245;
          font-style: italic;
        }
        .admin-login-sub {
          display: block;
          font-size: 10px;
          letter-spacing: 0.35em;
          color: #b5a99a;
          margin-top: 4px;
          font-family: 'Arial', sans-serif;
        }
        .admin-login-form { display: flex; flex-direction: column; gap: 20px; }
        .admin-field { display: flex; flex-direction: column; gap: 6px; }
        .admin-field label {
          font-size: 11px;
          letter-spacing: 0.2em;
          color: #9a8e82;
          font-family: 'Arial', sans-serif;
          text-transform: uppercase;
        }
        .admin-field input {
          background: #faf8f5;
          border: 1px solid #ddd7ce;
          border-radius: 4px;
          color: #1a1612;
          font-size: 14px;
          padding: 11px 14px;
          outline: none;
          font-family: 'Arial', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .admin-field input:focus { border-color: #7a6245; box-shadow: 0 0 0 3px rgba(122,98,69,0.08); }
        .admin-field input::placeholder { color: #c8c0b5; }
        .admin-login-error {
          color: #b85a4a;
          font-size: 13px;
          font-family: 'Arial', sans-serif;
          margin: 0;
        }
        .admin-btn-primary {
          background: #7a6245;
          color: #ffffff;
          border: none;
          border-radius: 4px;
          padding: 13px;
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-family: 'Arial', sans-serif;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s, opacity 0.2s;
          margin-top: 4px;
        }
        .admin-btn-primary:hover:not(:disabled) { background: #6a5438; }
        .admin-btn-primary:disabled { opacity: 0.5; cursor: default; }
      `}</style>
    </div>
  )
}
