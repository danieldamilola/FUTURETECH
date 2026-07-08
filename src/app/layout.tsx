import type { Metadata } from 'next'
import { DM_Serif_Display, JetBrains_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import { Toaster } from 'sonner'

// We will use standard Google fonts for Geist to avoid missing local files
import { Geist, Geist_Mono } from 'next/font/google'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const dmSerif = DM_Serif_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | FutureTech',
    default: 'FutureTech — Where Developers Share Knowledge',
  },
  description:
    'FutureTech is a premier tech blogging and knowledge-sharing community for developers. Read articles, ask questions, listen to podcasts, and connect with mentors.',
  keywords: ['tech blog', 'developer community', 'programming', 'coding', 'mentorship'],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${dmSerif.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh flex flex-col antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'var(--font-geist-sans)',
              borderRadius: '0.75rem',
            },
          }}
        />
      </body>
    </html>
  )
}
