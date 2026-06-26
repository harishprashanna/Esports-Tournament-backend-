import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/IGF_Logo.png" alt="IGF" className="h-14 mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold text-igf-text uppercase tracking-wide">Login</h1>
          <p className="text-igf-muted text-sm mt-1">Enter the arena</p>
        </div>

        {error && (
          <div className="bg-igf-dark-red border border-igf-red text-igf-crimson text-sm rounded px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-igf-muted text-sm mb-1">Email</label>
            <input name="email" type="email" required value={form.email}
              onChange={onChange} className="input" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-igf-muted text-sm mb-1">Password</label>
            <input name="password" type="password" required value={form.password}
              onChange={onChange} className="input" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2 disabled:opacity-60">
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <p className="text-center text-igf-muted text-sm mt-6">
          No account?{' '}
          <Link to="/register" className="text-igf-crimson hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  )
}
