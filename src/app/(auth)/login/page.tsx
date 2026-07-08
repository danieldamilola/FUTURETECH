'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { login, signInWithGoogle, signInWithGitHub } from '@/app/actions/auth'
import type { AuthFormState } from '@/app/actions/auth'

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
      <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z" />
      <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 0 0 0 10.76l3.98-3.09z" />
      <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
    </svg>
  )
}

const initialState: AuthFormState = undefined

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, initialState)

  return (
    <div className="auth-card w-full max-w-sm rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35),0_8px_24px_rgba(0,0,0,0.2)]">

      {/* Brand */}
      <div className="text-center mb-7">
        <h1 className="auth-brand text-3xl font-bold tracking-tight mb-1">
          FutureTech
        </h1>
        <p className="auth-text-muted text-sm">
          Where developers share knowledge
        </p>
      </div>

      {/* OAuth Buttons */}
      <div className="space-y-3 mb-5">
        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="auth-btn-secondary w-full flex items-center justify-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer hover:opacity-90 active:scale-[0.98]"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </form>
        <form action={signInWithGitHub}>
          <button
            type="submit"
            className="auth-btn-secondary w-full flex items-center justify-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer hover:opacity-90 active:scale-[0.98]"
          >
            <GithubIcon />
            Continue with GitHub
          </button>
        </form>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="auth-divider flex-1 h-px" />
        <span className="auth-text-subtle text-xs">or sign in with email</span>
        <div className="auth-divider flex-1 h-px" />
      </div>

      {/* General Error */}
      {state?.errors?.general && (
        <div className="auth-error-box rounded-xl px-4 py-3 mb-4 text-sm">
          {state.errors.general[0]}
        </div>
      )}

      {/* Login Form */}
      <form action={action} className="space-y-4">
        <div>
          <label htmlFor="email" className="auth-text-muted block text-xs font-medium mb-1.5">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            className={`auth-input auth-text w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200 ${state?.errors?.email ? 'auth-surface-error' : 'auth-surface'}`}
          />
          {state?.errors?.email && (
            <p className="auth-text-error mt-1.5 text-xs">{state.errors.email[0]}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="auth-text-muted block text-xs font-medium">
              Password
            </label>
            <Link href="/forgot-password" className="auth-text-crimson text-xs hover:underline transition-colors">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
            className={`auth-input auth-text w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200 ${state?.errors?.password ? 'auth-surface-error' : 'auth-surface'}`}
          />
          {state?.errors?.password && (
            <p className="auth-text-error mt-1.5 text-xs">{state.errors.password[0]}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="auth-btn-primary w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      {/* Footer */}
      <p className="auth-text-subtle text-center text-xs mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="auth-text-crimson font-medium hover:underline transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  )
}
