import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import TournamentCard from '../components/TournamentCard'

export default function Home() {
  const [tournaments, setTournaments] = useState([])

  useEffect(() => {
    api.get('/tournaments').then(r => setTournaments(r.data.slice(0, 6))).catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-28 px-6 text-center">
        <div className="absolute inset-0 bg-red-glow pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <img src="/IGF_Logo.png" alt="IGF" className="h-20 mx-auto mb-6 animate-flicker" />
          <p className="text-igf-crimson text-xs uppercase tracking-[0.3em] mb-4 font-medium">
            IIT GAMING FEST
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-igf-text uppercase tracking-widest mb-2 leading-tight">
            Forge Your
          </h1>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-igf-crimson uppercase tracking-widest mb-6 leading-tight">
            Legacy
          </h1>
          <p className="text-igf-muted text-lg mb-2 max-w-xl mx-auto">
            Every match is a chance. Every round is a test. One festival. Step into the arena and show the world what you're made of.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/tournaments" className="btn-primary text-base px-8 py-3">View Tournaments</Link>
            <Link to="/register" className="btn-outline text-base px-8 py-3">Register Now</Link>
          </div>
        </div>
      </section>

      {/* Games banner */}
      <section className="py-10 border-y border-igf-border bg-igf-card-bg">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-6 text-center">
            {[
              { name: 'PUBG Mobile', cat: 'Mobile', icon: '📱' },
              { name: 'Call of Duty Mobile', cat: 'Mobile', icon: '📱' },
              { name: 'Mortal Kombat', cat: 'Console', icon: '🎮' },
              { name: 'FIFA', cat: 'Console', icon: '🎮' },
              { name: 'Valorant', cat: 'PC', icon: '💻' },
            ].map(g => (
              <div key={g.name} className="flex flex-col items-center gap-1 w-28">
                <span className="text-3xl">{g.icon}</span>
                <span className="text-igf-text font-semibold text-sm">{g.name}</span>
                <span className="text-igf-muted text-xs">{g.cat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest tournaments */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">Tournaments</h2>
          <Link to="/tournaments" className="text-igf-crimson text-sm hover:underline">View all →</Link>
        </div>
        {tournaments.length === 0 ? (
          <p className="text-igf-muted text-center py-12">No tournaments yet. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tournaments.map(t => <TournamentCard key={t.id} tournament={t} />)}
          </div>
        )}
      </section>
    </div>
  )
}
