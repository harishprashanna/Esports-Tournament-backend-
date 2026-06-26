import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../contexts/AuthContext'

export default function Teams() {
  const { user } = useAuth()
  const [teams, setTeams] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => api.get('/teams').then(r => setTeams(r.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const createTeam = async e => {
    e.preventDefault()
    try {
      await api.post('/teams', form)
      setMsg('Team created!')
      setShowCreate(false)
      setForm({ name: '', description: '' })
      load()
    } catch (err) {
      setMsg(err.response?.data?.message ?? 'Failed to create team')
    }
  }

  const joinTeam = async (teamId) => {
    try {
      await api.post(`/teams/${teamId}/join`)
      setMsg('Join request sent!')
    } catch (err) {
      setMsg(err.response?.data?.message ?? 'Failed to send request')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Teams</h1>
        {user && (
          <button onClick={() => setShowCreate(!showCreate)} className="btn-primary">
            {showCreate ? 'Cancel' : '+ Create Team'}
          </button>
        )}
      </div>

      {msg && <p className="text-igf-crimson text-sm mb-4">{msg}</p>}

      {showCreate && (
        <form onSubmit={createTeam} className="card p-6 mb-8 max-w-md">
          <h2 className="font-display text-xl font-bold text-igf-text mb-4">Create Team</h2>
          <div className="space-y-3">
            <input name="name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="input" placeholder="Team name" />
            <textarea name="description" value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="input resize-none h-20" placeholder="Description (optional)" />
            <button type="submit" className="btn-primary w-full">Create</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-igf-muted text-center py-20">Loading teams…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {teams.map(team => (
            <div key={team.id} className="card p-5">
              <h3 className="font-display text-xl font-bold text-igf-text mb-1">{team.name}</h3>
              <p className="text-igf-muted text-xs mb-2">Captain: {team.captainUsername}</p>
              {team.description && <p className="text-igf-muted text-sm mb-3">{team.description}</p>}
              <p className="text-igf-muted text-xs mb-4">{team.members?.length ?? 0} member(s)</p>
              <div className="flex gap-2">
                <Link to={`/teams/${team.id}`} className="btn-outline text-xs py-1.5 px-3">View</Link>
                {user && team.captainId !== user.userId && (
                  <button onClick={() => joinTeam(team.id)} className="btn-primary text-xs py-1.5 px-3">
                    Request to Join
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
