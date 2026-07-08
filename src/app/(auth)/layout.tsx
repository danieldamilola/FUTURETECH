import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Join FutureTech',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="auth-bg min-h-dvh flex items-center justify-center p-4">
      {children}
    </main>
  )
}
