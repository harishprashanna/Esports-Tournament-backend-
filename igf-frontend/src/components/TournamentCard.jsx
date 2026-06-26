import { Link } from 'react-router-dom'
import GameBadge from './GameBadge'
import StatusBadge from './StatusBadge'

export default function TournamentCard({ tournament }) {
  const { id, name, gameType, category, maxTeams, registeredTeams, status, prizePool, startDate } = tournament

  const slots = maxTeams - (registeredTeams ?? 0)
  const pct = Math.min(100, ((registeredTeams ?? 0) / maxTeams) * 100)

  return (
    <Link to={`/tournaments/${id}`} className="card p-5 block hover:border-igf-red transition-colors duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex flex-wrap gap-2">
          <GameBadge gameType={gameType} category={category} />
          <StatusBadge status={status} />
        </div>
        {prizePool && (
          <span className="text-igf-crimson font-semibold text-sm">{prizePool}</span>
        )}
      </div>

      <h3 className="font-display text-xl font-bold text-igf-text group-hover:text-igf-crimson transition-colors duration-200 mb-1">
        {name}
      </h3>

      {startDate && (
        <p className="text-igf-muted text-xs mb-3">
          Starts: {new Date(startDate).toLocaleDateString()}
        </p>
      )}

      <div className="mt-3">
        <div className="flex justify-between text-xs text-igf-muted mb-1">
          <span>{registeredTeams ?? 0} / {maxTeams} teams</span>
          <span>{slots > 0 ? `${slots} slots left` : 'Full'}</span>
        </div>
        <div className="h-1.5 bg-igf-dark-red rounded-full overflow-hidden">
          <div
            className="h-full bg-igf-red rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </Link>
  )
}
