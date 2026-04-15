import { useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { USER_ROLES } from '../../constants/app'
import { useAuth } from '../../hooks/useAuth'
import AuthLayout from '../../layouts/AuthLayout'
import Button from '../../components/common/Button'

const resolveAuthError = (error) => {
  const code = error?.code || ''

  if (code === 'auth/configuration-not-found') {
    return 'Firebase Authentication is not initialized yet. Enable Email/Password in Firebase Console Authentication > Sign-in method.'
  }

  if (code === 'auth/email-already-in-use') {
    return 'This email is already registered. Please sign in instead.'
  }

  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
    return 'Email or password is incorrect.'
  }

  if (code === 'auth/invalid-email') {
    return 'Please enter a valid email address.'
  }

  if (code === 'auth/too-many-requests') {
    return 'Too many attempts. Please try again shortly.'
  }

  if (code === 'auth/popup-closed-by-user') {
    return 'Google sign-in popup was closed before completion.'
  }

  if (code === 'auth/popup-blocked') {
    return 'Popup was blocked by the browser. Please allow popups and try again.'
  }

  if (code === 'auth/operation-not-allowed') {
    return 'This sign-in provider is not enabled. Turn on Google in Firebase Authentication.'
  }

  if (code === 'auth/unauthorized-domain') {
    return 'This domain is not authorized in Firebase Authentication settings.'
  }

  if (code === 'auth/too-many-requests') {
    return 'Too many attempts. Please wait a moment and try again.'
  }

  return error?.message || 'Authentication failed.'
}

const AuthPage = () => {
  const { user, profile, register, login, loginWithGoogle, resetPassword, authError } = useAuth()

  const [mode, setMode] = useState('login')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [googleSubmitting, setGoogleSubmitting] = useState(false)
  const [resetSubmitting, setResetSubmitting] = useState(false)

  const destination = useMemo(() => {
    if (profile?.role === USER_ROLES.admin) return '/admin'
    return '/app'
  }, [profile?.role])

  if (user && profile) {
    return <Navigate to={destination} replace />
  }

  const submitAuth = async (event) => {
    event.preventDefault()
    setLocalError('')
    setInfoMessage('')

    const normalizedName = fullName.trim().replace(/\s+/g, ' ')

    if (!email || !password) {
      setLocalError('Please enter both email and password.')
      return
    }

    if (mode === 'register') {
      if (!normalizedName || normalizedName.length < 2) {
        setLocalError('Please enter your full name (at least 2 characters).')
        return
      }

      if (normalizedName.length > 80) {
        setLocalError('Full name should be at most 80 characters.')
        return
      }
    }

    if (password.length < 6) {
      setLocalError('Password should be at least 6 characters.')
      return
    }

    setSubmitting(true)
    try {
      if (mode === 'register') {
        await register({ email, password, fullName: normalizedName })
      } else {
        await login({ email, password })
      }
    } catch (error) {
      setLocalError(resolveAuthError(error))
    } finally {
      setSubmitting(false)
    }
  }

  const submitGoogleAuth = async () => {
    setLocalError('')
    setInfoMessage('')
    setGoogleSubmitting(true)

    try {
      await loginWithGoogle()
    } catch (error) {
      setLocalError(resolveAuthError(error))
    } finally {
      setGoogleSubmitting(false)
    }
  }

  const submitPasswordReset = async () => {
    setLocalError('')
    setInfoMessage('')

    if (!email.trim()) {
      setLocalError('Enter your email first, then press Forgot password.')
      return
    }

    setResetSubmitting(true)
    try {
      const normalizedEmail = email.trim().toLowerCase()
      await resetPassword(normalizedEmail)
      setInfoMessage(`Password reset email sent to ${normalizedEmail}. Check inbox and spam folder.`)
    } catch (error) {
      setLocalError(resolveAuthError(error))
    } finally {
      setResetSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div className="grid w-full max-w-5xl gap-6 md:grid-cols-[1.2fr_1fr]">
        <section className="surface-card relative overflow-hidden p-6 sm:p-8">
          <div className="absolute -left-6 top-2 h-24 w-24 rounded-full bg-sky-100/80 blur-xl" />
          <div className="absolute -right-5 bottom-4 h-24 w-24 rounded-full bg-indigo-100/70 blur-xl" />

          <p className="text-xs uppercase tracking-[0.24em] text-sky-700">Privacy-first care</p>
          <h1 className="mt-2 max-w-md font-display text-4xl leading-tight text-slate-900 sm:text-5xl">
            Feel better with one safe check-in a day.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-700">
            Harbor helps you track emotions and journal privately. Your personal mood notes and journal content are never visible to admin.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="chip">Private by default</span>
            <span className="chip">Fast under 5 seconds</span>
            <span className="chip">Gentle insights</span>
          </div>
        </section>

        <section className="surface-card p-6">
          <div className="mb-4 flex rounded-xl bg-slate-100/90 p-1">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={[
                'flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition',
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-sm shadow-slate-300/40'
                  : 'text-slate-500',
              ].join(' ')}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={[
                'flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition',
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-sm shadow-slate-300/40'
                  : 'text-slate-500',
              ].join(' ')}
            >
              Create account
            </button>
          </div>

          <form onSubmit={submitAuth} className="space-y-3">
            {mode === 'register' && (
              <label className="block text-sm font-medium text-slate-700">
                Full name
                <input
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="soft-input mt-1 w-full"
                  placeholder="Your full name"
                />
              </label>
            )}

            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="soft-input mt-1 w-full"
                placeholder="you@example.com"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Password
              <input
                type="password"
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="soft-input mt-1 w-full"
                placeholder="••••••••"
              />
            </label>

            {mode === 'login' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={submitPasswordReset}
                  disabled={submitting || googleSubmitting || resetSubmitting}
                  className="text-sm font-medium text-sky-700 underline-offset-2 transition hover:text-sky-800 hover:underline disabled:cursor-not-allowed disabled:text-slate-400"
                >
                  {resetSubmitting ? 'Sending reset link...' : 'Forgot password?'}
                </button>
              </div>
            )}

            {(localError || authError) && (
              <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{localError || authError}</p>
            )}

            {infoMessage && (
              <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{infoMessage}</p>
            )}

            <Button type="submit" className="w-full" disabled={submitting || googleSubmitting || resetSubmitting}>
              {submitting
                ? 'Please wait...'
                : mode === 'register'
                  ? 'Create secure account'
                  : 'Sign in'}
            </Button>

            <div className="relative py-1 text-center">
              <span className="absolute left-0 top-1/2 h-px w-full bg-slate-200" />
              <span className="relative bg-white px-2 text-xs uppercase tracking-[0.15em] text-slate-500">or</span>
            </div>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={submitGoogleAuth}
              disabled={submitting || googleSubmitting || resetSubmitting}
            >
              <span className="mr-2 inline-flex h-4 w-4 items-center justify-center">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                  <path
                    fill="#EA4335"
                    d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6.1-2.8-6.1-6.1s2.8-6.1 6.1-6.1c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3 14.6 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.3-.2-2H12z"
                  />
                </svg>
              </span>
              {googleSubmitting ? 'Connecting Google...' : 'Continue with Google'}
            </Button>
          </form>
        </section>
      </div>
    </AuthLayout>
  )
}

export default AuthPage
