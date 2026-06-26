import { useEffect, useState } from 'react'
import api from '../api/axios'
import TournamentCard from '../components/TournamentCard'

const CATEGORIES = ['ALL', 'MOBILE', 'CONSOLE', 'PC']
const STATUSES = ['ALL', 'UPCOMING', 'REGISTRATION_OPEN', 'ONGOING', 'COMPLETED']

export default function Tournaments() {
  const [tournaments, setTournaments] = useState([])
  const [cat, setCat] = useState('ALL')
  const [status, setStatus] = useState('ALL')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/tournaments')
      .then(r => setTournaments(r.data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = tournaments.filter(t =>
    (cat === 'ALL' || t.category === cat) &&
    (status === 'ALL' || t.status === status)
  )

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="section-title mb-8">Tournaments</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          <span className="text-igf-muted text-sm self-center">Category:</span>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`text-xs px-3 py-1 rounded border transition-colors ${
                cat === c ? 'bg-igf-red border-igf-red text-white' : 'border-igf-border text-igf-muted hover:border-igf-red'
              }`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-igf-muted text-sm self-center">Status:</span>
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={`text-xs px-3 py-1 rounded border transition-colors ${
                status === s ? 'bg-igf-red border-igf-red text-white' : 'border-igf-border text-igf-muted hover:border-igf-red'
              }`}>
              {s === 'REGISTRATION_OPEN' ? 'Open' : s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-igf-muted text-center py-20">Loading tournaments…</p>
      ) : filtered.length === 0 ? (
        <p className="text-igf-muted text-center py-20">No tournaments match the selected filters.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(t => <TournamentCard key={t.id} tournament={t} />)}
        </div>
      )}
    </div>
  )
}
