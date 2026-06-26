import { useEffect, useState } from 'react'
import api from '../api/axios'

const GAMES = ['PUBGM', 'CODM', 'MORTAL_KOMBAT', 'FIFA', 'VALORANT']

const STATUS_LABEL = {
  UPCOMING: { label: 'Upcoming', cls: 'text-igf-muted bg-white/5' },
  REGISTRATION_OPEN: { label: 'Registration Open', cls: 'text-green-400 bg-green-400/10' },
  ONGOING: { label: 'Ongoing', cls: 'text-igf-crimson bg-igf-red/10' },
  COMPLETED: { label: 'Completed', cls: 'text-igf-muted bg-white/5' },
}

export default function Admin() {
  const [tournaments, setTournaments] = useState([])
  const [form, setForm] = useState({
    name: '', gameType: 'PUBGM', maxTeams: 8,
    registrationDeadline: '', startDate: '', description: '', prizePool: ''
  })
  const [msg, setMsg] = useState({ text: '', error: false })
  const [matchForm, setMatchForm] = useState({ matchId: '', winnerId: '', team1Score: '', team2Score: '' })

  const load = () => api.get('/tournaments').then(r => setTournaments(r.data))
  useEffect(() => { load() }, [])

  const notify = (text, error = false) => setMsg({ text, error })

  const createTournament = async e => {
    e.preventDefault()
    try {
      const payload = {
        ...form,
        maxTeams: Number(form.maxTeams),
        registrationDeadline: form.registrationDeadline || null,
        startDate: form.startDate || null,
      }
      await api.post('/tournaments', payload)
      notify('Tournament created!')
      setForm({ name: '', gameType: 'PUBGM', maxTeams: 8, registrationDeadline: '', startDate: '', description: '', prizePool: '' })
      load()
    } catch (err) {
      notify(err.response?.data?.message ?? 'Failed to create tournament', true)
    }
  }

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/tournaments/${id}/status?status=${status}`)
      notify(`Status updated to ${status.replace('_', ' ')}`)
      load()
    } catch (err) {
      notify(err.response?.data?.message ?? 'Failed to update status', true)
    }
  }

  const generateBracket = async (id) => {
    try {
      await api.post(`/matches/tournaments/${id}/bracket`)
      notify('Bracket generated!')
      load()
    } catch (err) {
      notify(err.response?.data?.message ?? 'Failed to generate bracket', true)
    }
  }

  const submitResult = async e => {
    e.preventDefault()
    try {
      await api.post('/matches/result', {
        matchId: Number(matchForm.matchId),
        winnerId: Number(matchForm.winnerId),
        team1Score: matchForm.team1Score ? Number(matchForm.team1Score) : null,
        team2Score: matchForm.team2Score ? Number(matchForm.team2Score) : null,
      })
      notify('Match result submitted!')
      setMatchForm({ matchId: '', winnerId: '', team1Score: '', team2Score: '' })
    } catch (err) {
      notify(err.response?.data?.message ?? 'Failed to submit result', true)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="section-title mb-2">Admin Panel</h1>
      <p className="text-igf-muted text-sm mb-8">Manage tournaments, brackets, and match results</p>

      {msg.text && (
        <div className={`border text-sm rounded px-4 py-3 mb-6 ${msg.error
          ? 'bg-igf-dark-red border-igf-red text-igf-crimson'
          : 'bg-green-900/20 border-green-700 text-green-400'}`}>
          {msg.text}
        </div>
      )}

      {/* Create tournament */}
      <section className="card p-6 mb-8">
        <h2 className="font-display text-xl font-bold text-igf-text mb-5">Create Tournament</h2>
        <form onSubmit={createTournament} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-igf-muted text-xs mb-1">Tournament Name</label>
            <input value={form.name} required onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="input" placeholder="IGF Season 1 — PUBG Mobile" />
          </div>
          <div>
            <label className="block text-igf-muted text-xs mb-1">Game</label>
            <select value={form.gameType} onChange={e => setForm(f => ({ ...f, gameType: e.target.value }))}
              className="input">
              {GAMES.map(g => <option key={g} value={g}>{g.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-igf-muted text-xs mb-1">Max Teams</label>
            <input type="number" min={2} max={64} value={form.maxTeams}
              onChange={e => setForm(f => ({ ...f, maxTeams: e.target.value }))}
              className="input" />
          </div>
          <div>
            <label className="block text-igf-muted text-xs mb-1">Registration Deadline (optional)</label>
            <input type="datetime-local" value={form.registrationDeadline}
              onChange={e => setForm(f => ({ ...f, registrationDeadline: e.target.value }))}
              className="input" />
          </div>
          <div>
            <label className="block text-igf-muted text-xs mb-1">Start Date (optional)</label>
            <input type="datetime-local" value={form.startDate}
              onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
              className="input" />
          </div>
          <div>
            <label className="block text-igf-muted text-xs mb-1">Prize Pool</label>
            <input value={form.prizePool} onChange={e => setForm(f => ({ ...f, prizePool: e.target.value }))}
              className="input" placeholder="e.g. LKR 50,000" />
          </div>
          <div>
            <label className="block text-igf-muted text-xs mb-1">Description</label>
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="input" placeholder="Short description" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary w-full sm:w-auto">Create Tournament</button>
          </div>
        </form>
      </section>

      {/* Submit match result */}
      <section className="card p-6 mb-8">
        <h2 className="font-display text-xl font-bold text-igf-text mb-5">Submit Match Result</h2>
        <form onSubmit={submitResult} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-igf-muted text-xs mb-1">Match ID</label>
            <input type="number" required value={matchForm.matchId}
              onChange={e => setMatchForm(f => ({ ...f, matchId: e.target.value }))}
              className="input" placeholder="Match ID" />
          </div>
          <div>
            <label className="block text-igf-muted text-xs mb-1">Winner Team ID</label>
            <input type="number" required value={matchForm.winnerId}
              onChange={e => setMatchForm(f => ({ ...f, winnerId: e.target.value }))}
              className="input" placeholder="Winner ID" />
          </div>
          <div>
            <label className="block text-igf-muted text-xs mb-1">Team 1 Score</label>
            <input type="number" value={matchForm.team1Score}
              onChange={e => setMatchForm(f => ({ ...f, team1Score: e.target.value }))}
              className="input" placeholder="Score" />
          </div>
          <div>
            <label className="block text-igf-muted text-xs mb-1">Team 2 Score</label>
            <input type="number" value={matchForm.team2Score}
              onChange={e => setMatchForm(f => ({ ...f, team2Score: e.target.value }))}
              className="input" placeholder="Score" />
          </div>
          <div className="col-span-2 sm:col-span-4">
            <button type="submit" className="btn-primary">Submit Result</button>
          </div>
        </form>
      </section>

      {/* Tournament management */}
      <section>
        <h2 className="font-display text-xl font-bold text-igf-text mb-4">All Tournaments</h2>
        <div className="space-y-3">
          {tournaments.map(t => {
            const s = STATUS_LABEL[t.status] ?? STATUS_LABEL.UPCOMING
            return (
              <div key={t.id} className="card p-4">
                <div className="flex flex-wrap items-start gap-4">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-igf-text font-semibold">{t.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.cls}`}>
                        {s.label}
                      </span>
                    </div>
                    <p className="text-igf-muted text-xs">
                      {t.gameDisplayName} &middot; ID: {t.id} &middot; {t.registeredTeams}/{t.maxTeams} teams
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 items-center">
                    {/* Registration toggle */}
                    {t.status === 'UPCOMING' && (
                      <button
                        onClick={() => setStatus(t.id, 'REGISTRATION_OPEN')}
                        className="text-xs px-3 py-1.5 rounded border border-green-600 text-green-400 hover:bg-green-600/20 transition-colors">
                        Open Registration
                      </button>
                    )}
                    {t.status === 'REGISTRATION_OPEN' && (
                      <button
                        onClick={() => setStatus(t.id, 'UPCOMING')}
                        className="text-xs px-3 py-1.5 rounded border border-igf-red/50 text-igf-crimson hover:bg-igf-red/10 transition-colors">
                        Close Registration
                      </button>
                    )}

                    {/* Generate bracket */}
                    {(t.status === 'REGISTRATION_OPEN' || t.status === 'UPCOMING') && (
                      <button
                        onClick={() => generateBracket(t.id)}
                        className="text-xs px-3 py-1.5 rounded border border-white/20 text-igf-muted hover:text-igf-text hover:border-white/40 transition-colors">
                        Generate Bracket
                      </button>
                    )}

                    {/* Mark completed */}
                    {t.status === 'ONGOING' && (
                      <button
                        onClick={() => setStatus(t.id, 'COMPLETED')}
                        className="text-xs px-3 py-1.5 rounded border border-white/20 text-igf-muted hover:text-igf-text transition-colors">
                        Mark Completed
                      </button>
                    )}

                    {/* Delete */}
                    {t.status !== 'ONGOING' && (
                      <button
                        onClick={async () => {
                          if (!window.confirm(`Delete "${t.name}"?`)) return
                          try {
                            await api.delete(`/tournaments/${t.id}`)
                            notify('Tournament deleted')
                            load()
                          } catch (err) {
                            notify(err.response?.data?.message ?? 'Delete failed', true)
                          }
                        }}
                        className="text-xs px-3 py-1.5 rounded border border-red-900/50 text-red-500/70 hover:text-red-400 hover:border-red-500/50 transition-colors">
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          {tournaments.length === 0 && (
            <p className="text-igf-muted text-sm">No tournaments yet. Create one above.</p>
          )}
        </div>
      </section>
    </div>
  )
}
