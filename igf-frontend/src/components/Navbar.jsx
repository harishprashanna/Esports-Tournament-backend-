import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive ? 'text-igf-crimson' : 'text-igf-muted hover:text-igf-text'
    }`

  return (
    <nav className="sticky top-0 z-50 border-b border-igf-border bg-igf-black/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <img src="/IGF_Logo.png" alt="IGF" className="h-9 w-auto" />
            <span className="font-display text-xl font-bold text-igf-text tracking-widest uppercase">IGF</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/tournaments" className={linkClass}>Tournaments</NavLink>
            <NavLink to="/teams" className={linkClass}>Teams</NavLink>
            <NavLink to="/leaderboard" className={linkClass}>Leaderboard</NavLink>
            {user && <NavLink to="/profile" className={linkClass}>Profile</NavLink>}
            {isAdmin && <NavLink to="/admin" className={linkClass + ' text-igf-crimson'}>Admin</NavLink>}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-igf-muted hidden sm:block">{user.username}</span>
                <button onClick={handleLogout} className="btn-outline text-sm py-1.5 px-4">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Join Now</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
