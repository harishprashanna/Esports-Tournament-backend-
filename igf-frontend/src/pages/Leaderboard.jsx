import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Leaderboard() {
  const [tournaments, setTournaments] = useState([])
  const [selected, setSelected] = useState('')
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/tournaments').then(r => {
      setTournaments(r.data)
      if (r.data.length) {
        const first = r.data[0].id
        setSelected(first)
      }
    })
  }, [])

  useEffect(() => {
    if (!selected) return
    setLoading(true)
    api.get(`/leaderboard/tournaments/${selected}`)
      .then(r => setEntries(r.data))
      .finally(() => setLoading(false))
  }, [selected])

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="section-title mb-8">Leaderboard</h1>

      <select value={selected} onChange={e => setSelected(e.target.value)}
        className="input mb-8 max-w-xs">
        {tournaments.map(t => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>

      {loading ? (
        <p className="text-igf-muted text-center py-10">Loading…</p>
      ) : entries.length === 0 ? (
        <p className="text-igf-muted text-center py-10">No results yet for this tournament.</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-igf-border bg-igf-dark-bg">
                <th className="text-left px-5 py-3 text-igf-muted font-medium">#</th>
                <th className="text-left px-5 py-3 text-igf-muted font-medium">Team</th>
                <th className="text-center px-5 py-3 text-igf-muted font-medium">Wins</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={i} className={`border-b border-igf-border last:border-0 ${i === 0 ? 'bg-igf-dark-red/30' : ''}`}>
                  <td className="px-5 py-3">
                    {i === 0 ? <span className="text-yellow-400 font-bold">🏆</span>
                     : i === 1 ? <span className="text-gray-300">🥈</span>
                     : i === 2 ? <span className="text-amber-600">🥉</span>
                     : <span className="text-igf-muted">{e.rank}</span>}
                  </td>
                  <td className="px-5 py-3 font-semibold text-igf-text">{e.teamName}</td>
                  <td className="px-5 py-3 text-center text-igf-crimson font-bold">{e.wins}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
