import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../contexts/AuthContext'
import GameBadge from '../components/GameBadge'
import StatusBadge from '../components/StatusBadge'

export default function TournamentDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [tournament, setTournament] = useState(null)
  const [bracket, setBracket] = useState([])
  const [participants, setParticipants] = useState([])
  const [myTeams, setMyTeams] = useState([])
  const [selectedTeam, setSelectedTeam] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const [expandedTeam, setExpandedTeam] = useState(null)

  const loadParticipants = () =>
    api.get(`/tournaments/${id}/participants`).then(r => setParticipants(r.data)).catch(() => {})

  useEffect(() => {
    Promise.all([
      api.get(`/tournaments/${id}`),
      api.get(`/matches/tournaments/${id}`),
    ]).then(([t, m]) => {
      setTournament(t.data)
      setBracket(m.data)
    }).finally(() => setLoading(false))

    loadParticipants()

    if (user) {
      api.get('/teams').then(r => {
        const mine = r.data.filter(t => t.captainId === user.userId)
        setMyTeams(mine)
        if (mine.length) setSelectedTeam(mine[0].id)
      }).catch(() => {})
    }
  }, [id, user])

  const register = async () => {
    if (!selectedTeam) return
    try {
      await api.post(`/registrations/teams/${selectedTeam}/tournaments/${id}`)
      setMsg('Team registered successfully!')
      loadParticipants()
      api.get(`/tournaments/${id}`).then(r => setTournament(r.data))
    } catch (e) {
      setMsg(e.response?.data?.message ?? 'Registration failed')
    }
  }

  if (loading) return <div className="text-igf-muted text-center py-20">Loading…</div>
  if (!tournament) return <div className="text-igf-muted text-center py-20">Tournament not found</div>

  const rounds = [...new Set(bracket.map(m => m.roundNumber))].sort()
  const alreadyRegistered = participants.some(p => myTeams.some(t => t.id === p.teamId))

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="card p-7 mb-8">
        <div className="flex flex-wrap gap-3 mb-4">
          <GameBadge gameType={tournament.gameType} category={tournament.category} />
          <StatusBadge status={tournament.status} />
        </div>
        <h1 className="font-display text-4xl font-bold text-igf-text mb-2">{tournament.name}</h1>
        {tournament.description && <p className="text-igf-muted mb-4">{tournament.description}</p>}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <Stat label="Teams" value={`${tournament.registeredTeams}/${tournament.maxTeams}`} />
          <Stat label="Prize Pool" value={tournament.prizePool ?? '—'} />
          <Stat label="Deadline" value={tournament.registrationDeadline
            ? new Date(tournament.registrationDeadline).toLocaleDateString() : '—'} />
          <Stat label="Start Date" value={tournament.startDate
            ? new Date(tournament.startDate).toLocaleDateString() : '—'} />
        </div>
      </div>

      {/* Register */}
      {user && tournament.status === 'REGISTRATION_OPEN' && myTeams.length > 0 && !alreadyRegistered && (
        <div className="card p-5 mb-8">
          <h2 className="font-display text-xl font-bold text-igf-text mb-3">Register Your Team</h2>
          {msg && <p className="text-igf-crimson text-sm mb-3">{msg}</p>}
          <div className="flex gap-3 flex-wrap items-center">
            <select value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)}
              className="input max-w-xs">
              {myTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <button onClick={register} className="btn-primary">Register</button>
          </div>
        </div>
      )}

      {msg && tournament.status !== 'REGISTRATION_OPEN' && (
        <p className="text-igf-crimson text-sm mb-4">{msg}</p>
      )}

      {/* Bracket */}
      {bracket.length > 0 && (
        <div className="mb-8">
          <h2 className="section-title text-2xl mb-5">Bracket</h2>
          <div className="space-y-6">
            {rounds.map(round => (
              <div key={round}>
                <h3 className="text-igf-muted text-sm uppercase tracking-widest mb-3">Round {round}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {bracket.filter(m => m.roundNumber === round).map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Participants */}
      <div>
        <h2 className="section-title text-2xl mb-4">
          Participants <span className="text-igf-muted text-lg font-normal">({participants.length} teams)</span>
        </h2>
        {participants.length === 0 ? (
          <p className="text-igf-muted text-sm">No teams registered yet.</p>
        ) : (
          <div className="space-y-3">
            {participants.map(p => (
              <div key={p.teamId} className="card overflow-hidden">
                <button
                  onClick={() => setExpandedTeam(expandedTeam === p.teamId ? null : p.teamId)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-igf-red/20 flex items-center justify-center
                                    text-igf-crimson font-bold text-sm flex-shrink-0">
                      {p.teamName[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-igf-text font-semibold">{p.teamName}</p>
                      <p className="text-igf-muted text-xs">
                        Captain: {p.captainUsername} &middot; {p.players.length} player{p.players.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <span className="text-igf-muted text-xs ml-4">
                    {expandedTeam === p.teamId ? '▲ Hide' : '▼ Show players'}
                  </span>
                </button>

                {expandedTeam === p.teamId && (
                  <div className="border-t border-white/10 px-4 py-3 space-y-2">
                    {p.description && (
                      <p className="text-igf-muted text-xs italic mb-3">{p.description}</p>
                    )}
                    {p.players.map(player => (
                      <div key={player.userId} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-igf-dark-red border border-igf-red/30
                                        flex items-center justify-center text-igf-crimson text-xs font-bold flex-shrink-0">
                          {player.username[0].toUpperCase()}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-igf-text text-sm font-medium">{player.username}</span>
                          {player.inGameName && (
                            <span className="text-igf-muted text-xs">({player.inGameName})</span>
                          )}
                          {player.captain && (
                            <span className="text-xs bg-igf-red/20 text-igf-crimson px-2 py-0.5 rounded-full">
                              Captain
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-igf-muted text-xs mb-1">{label}</p>
      <p className="text-igf-text font-semibold">{value}</p>
    </div>
  )
}

function MatchCard({ match }) {
  const isCompleted = match.status === 'COMPLETED'
  return (
    <div className="card p-4">
      <div className="flex justify-between items-center">
        <span className={`text-sm font-semibold ${isCompleted && match.winnerId === match.team1Id ? 'text-igf-crimson' : 'text-igf-text'}`}>
          {match.team1Name ?? 'TBD'}
        </span>
        <span className="text-igf-muted text-xs mx-2">vs</span>
        <span className={`text-sm font-semibold ${isCompleted && match.winnerId === match.team2Id ? 'text-igf-crimson' : 'text-igf-text'}`}>
          {match.team2Name ?? 'BYE'}
        </span>
      </div>
      {isCompleted && (
        <p className="text-igf-muted text-xs text-center mt-2">
          {match.team1Score} – {match.team2Score}
        </p>
      )}
      {match.status === 'BYE' && <p className="text-igf-muted text-xs text-center mt-1">BYE</p>}
    </div>
  )
}
