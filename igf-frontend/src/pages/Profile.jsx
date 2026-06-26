import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../contexts/AuthContext'

export default function Profile() {
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    api.get('/users/me').then(r => setProfile(r.data)).catch(() => {})
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="section-title mb-8">My Profile</h1>

      {profile && (
        <div className="card p-6 mb-8">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 rounded-full bg-igf-dark-red border-2 border-igf-red flex items-center justify-center text-2xl font-bold text-igf-crimson">
              {profile.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-igf-text">{profile.username}</h2>
              <p className="text-igf-muted text-sm">{profile.email}</p>
              {profile.inGameName && <p className="text-igf-muted text-xs mt-0.5">IGN: {profile.inGameName}</p>}
            </div>
            <span className={`ml-auto badge ${profile.role === 'ADMIN' ? 'bg-igf-red text-white' : 'bg-igf-dark-red text-igf-crimson'}`}>
              {profile.role}
            </span>
          </div>

          <div className="red-divider" />

          <div>
            <p className="text-igf-muted text-xs uppercase tracking-widest mb-3">Teams</p>
            {profile.teamNames?.length ? (
              <div className="flex flex-wrap gap-2">
                {profile.teamNames.map(t => (
                  <span key={t} className="badge bg-igf-dark-red text-igf-crimson">{t}</span>
                ))}
              </div>
            ) : (
              <p className="text-igf-muted text-sm">Not in any team yet.</p>
            )}
          </div>

          <div className="red-divider" />

          <p className="text-igf-muted text-xs">
            Member since {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}
          </p>
        </div>
      )}

      <button onClick={logout} className="btn-outline text-sm">Logout</button>
    </div>
  )
}
