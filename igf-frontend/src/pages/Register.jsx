import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', inGameName: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/IGF_Logo.png" alt="IGF" className="h-14 mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold text-igf-text uppercase tracking-wide">Join IGF</h1>
          <p className="text-igf-muted text-sm mt-1">Create your account to compete</p>
        </div>

        {error && (
          <div className="bg-igf-dark-red border border-igf-red text-igf-crimson text-sm rounded px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-igf-muted text-sm mb-1">Username</label>
            <input name="username" required minLength={3} value={form.username}
              onChange={onChange} className="input" placeholder="YourGamertag" />
          </div>
          <div>
            <label className="block text-igf-muted text-sm mb-1">Email</label>
            <input name="email" type="email" required value={form.email}
              onChange={onChange} className="input" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-igf-muted text-sm mb-1">In-Game Name <span className="text-igf-muted text-xs">(optional)</span></label>
            <input name="inGameName" value={form.inGameName}
              onChange={onChange} className="input" placeholder="How you appear in-game" />
          </div>
          <div>
            <label className="block text-igf-muted text-sm mb-1">Password</label>
            <input name="password" type="password" required minLength={6} value={form.password}
              onChange={onChange} className="input" placeholder="Min 6 characters" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2 disabled:opacity-60">
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-igf-muted text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-igf-crimson hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}
