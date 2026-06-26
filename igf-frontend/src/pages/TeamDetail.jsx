import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../contexts/AuthContext'

export default function TeamDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [team, setTeam] = useState(null)
  const [requests, setRequests] = useState([])
  const [msg, setMsg] = useState({ text: '', error: false })
  const [loading, setLoading] = useState(true)
  const [expandedPlayer, setExpandedPlayer] = useState(null)

  const load = () =>
    api.get(`/teams/${id}`).then(r => setTeam(r.data)).catch(() => setTeam(null))

  const loadRequests = () =>
    api.get(`/teams/${id}/requests`)
      .then(r => setRequests(r.data))
      .catch(() => setRequests([]))

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (team && user && team.captainId === user.userId) {
      loadRequests()
    }
  }, [team, user])

  const notify = (text, error = false) => setMsg({ text, error })

  const isCaptain = team && user && team.captainId === user.userId
  const isMember = team && user && team.members?.some(m => m.userId === user.userId)

  const requestJoin = async () => {
    try {
      await api.post(`/teams/${id}/join`)
      notify('Join request sent! Wait for the captain to accept.')
    } catch (err) {
      notify(err.response?.data?.message ?? 'Failed to send request', true)
    }
  }

  const leaveTeam = async () => {
    if (!window.confirm('Are you sure you want to leave this team?')) return
    try {
      await api.delete(`/teams/${id}/leave`)
      notify('You have left the team.')
      load()
    } catch (err) {
      notify(err.response?.data?.message ?? 'Failed to leave team', true)
    }
  }

  const removeMember = async (memberId, username) => {
    if (!window.confirm(`Remove ${username} from the team?`)) return
    try {
      await api.delete(`/teams/${id}/members/${memberId}`)
      notify(`${username} removed.`)
      load()
    } catch (err) {
      notify(err.response?.data?.message ?? 'Failed to remove member', true)
    }
  }

  const handleRequest = async (requestId, accept) => {
    try {
      await api.patch(`/teams/requests/${requestId}/${accept ? 'accept' : 'reject'}`)
      notify(accept ? 'Request accepted!' : 'Request rejected.')
      loadRequests()
      if (accept) load()
    } catch (err) {
      notify(err.response?.data?.message ?? 'Failed to process request', true)
    }
  }

  if (loading) return <div className="text-igf-muted text-center py-20">Loading…</div>
  if (!team) return <div className="text-igf-muted text-center py-20">Team not found.</div>

  const captain = team.members?.find(m => m.userId === team.captainId)
  const otherMembers = team.members?.filter(m => m.userId !== team.captainId) ?? []

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="card p-7 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-igf-red/20 border border-igf-red/30 flex items-center
                            justify-center text-igf-crimson font-display text-2xl font-bold flex-shrink-0">
              {team.name[0].toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-igf-text">{team.name}</h1>
              {team.description && (
                <p className="text-igf-muted text-sm mt-1">{team.description}</p>
              )}
            </div>
          </div>
          <span className="text-igf-muted text-xs">
            {team.members?.length ?? 0} member{team.members?.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex flex-wrap gap-3">
          {user && !isMember && (
            <button onClick={requestJoin} className="btn-primary text-sm">
              Request to Join
            </button>
          )}
          {isMember && !isCaptain && (
            <button onClick={leaveTeam}
              className="text-sm px-4 py-2 rounded border border-red-900/50 text-red-500/70 hover:text-red-400 hover:border-red-500/50 transition-colors">
              Leave Team
            </button>
          )}
          {isCaptain && (
            <span className="text-xs px-3 py-1.5 rounded-full bg-igf-red/20 text-igf-crimson border border-igf-red/30">
              You are the Captain
            </span>
          )}
        </div>

        {msg.text && (
          <p className={`mt-4 text-sm ${msg.error ? 'text-igf-crimson' : 'text-green-400'}`}>
            {msg.text}
          </p>
        )}
      </div>

      {/* Captain */}
      <section className="mb-6">
        <h2 className="text-igf-muted text-xs uppercase tracking-widest mb-3">Captain</h2>
        <div className="card p-5">
          <PlayerCard
            member={captain ?? { userId: team.captainId, username: team.captainUsername }}
            isCaptain
            expanded={expandedPlayer === team.captainId}
            onToggle={() => setExpandedPlayer(expandedPlayer === team.captainId ? null : team.captainId)}
          />
        </div>
      </section>

      {/* Members */}
      {otherMembers.length > 0 && (
        <section className="mb-6">
          <h2 className="text-igf-muted text-xs uppercase tracking-widest mb-3">
            Members ({otherMembers.length})
          </h2>
          <div className="card divide-y divide-white/5">
            {otherMembers.map(m => (
              <div key={m.userId} className="p-5">
                <PlayerCard
                  member={m}
                  isCaptain={false}
                  expanded={expandedPlayer === m.userId}
                  onToggle={() => setExpandedPlayer(expandedPlayer === m.userId ? null : m.userId)}
                  action={isCaptain ? (
                    <button
                      onClick={() => removeMember(m.userId, m.username)}
                      className="text-xs px-2 py-1 rounded border border-red-900/40 text-red-500/60
                                 hover:text-red-400 hover:border-red-500/50 transition-colors ml-2">
                      Remove
                    </button>
                  ) : null}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pending join requests (captain only) */}
      {isCaptain && (
        <section>
          <h2 className="text-igf-muted text-xs uppercase tracking-widest mb-3">
            Pending Join Requests ({requests.length})
          </h2>
          {requests.length === 0 ? (
            <p className="text-igf-muted text-sm">No pending requests.</p>
          ) : (
            <div className="card divide-y divide-white/5">
              {requests.map(req => (
                <div key={req.id} className="p-4 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-igf-dark-red border border-igf-red/30
                                    flex items-center justify-center text-igf-crimson text-sm font-bold">
                      {req.username[0].toUpperCase()}
                    </div>
                    <span className="text-igf-text text-sm font-medium">{req.username}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRequest(req.id, true)}
                      className="text-xs px-3 py-1.5 rounded border border-green-600 text-green-400 hover:bg-green-600/20 transition-colors">
                      Accept
                    </button>
                    <button
                      onClick={() => handleRequest(req.id, false)}
                      className="text-xs px-3 py-1.5 rounded border border-white/20 text-igf-muted hover:text-igf-text transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}

function PlayerCard({ member, isCaptain, expanded, onToggle, action }) {
  if (!member) return null
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onToggle}
          className="flex items-center gap-3 flex-1 text-left hover:opacity-80 transition-opacity">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0
                          ${isCaptain
                            ? 'bg-igf-red/30 border border-igf-red/50 text-igf-crimson'
                            : 'bg-white/5 border border-white/10 text-igf-muted'}`}>
            {(member.username ?? '?')[0].toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-igf-text font-semibold text-sm">{member.username}</span>
              {isCaptain && (
                <span className="text-xs bg-igf-red/20 text-igf-crimson px-2 py-0.5 rounded-full border border-igf-red/30">
                  Captain
                </span>
              )}
            </div>
            <p className="text-igf-muted text-xs">
              {member.inGameName ? `In-game: ${member.inGameName}` : 'No in-game name set'}
              {member.joinedAt && ` · Joined ${new Date(member.joinedAt).toLocaleDateString()}`}
            </p>
          </div>
        </button>
        <div className="flex items-center gap-1">
          {action}
          <span className="text-igf-muted text-xs ml-2">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 ml-13 pl-1 border-l-2 border-igf-red/20 ml-12">
          <div className="space-y-1 text-sm">
            <InfoRow label="Username" value={member.username} />
            <InfoRow label="In-game Name" value={member.inGameName ?? '—'} />
            {member.joinedAt && (
              <InfoRow label="Joined" value={new Date(member.joinedAt).toLocaleString()} />
            )}
            <InfoRow label="Role" value={isCaptain ? 'Team Captain' : 'Member'} />
          </div>
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex gap-3">
      <span className="text-igf-muted w-28 flex-shrink-0">{label}</span>
      <span className="text-igf-text">{value}</span>
    </div>
  )
}
