'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home, Compass, BookOpen, HelpCircle, Mic, Users, Briefcase,
  PenSquare, BookMarked, Bookmark, Settings, ShieldCheck, ChevronDown,
} from 'lucide-react'

const mainNav = [
  { label: 'Feed',     href: '/feed',      icon: Home },
  { label: 'Explore',  href: '/explore',   icon: Compass },
  { label: 'Articles', href: '/blog',      icon: BookOpen },
  { label: 'Q&A',      href: '/questions', icon: HelpCircle },
  { label: 'Podcasts', href: '/podcasts',  icon: Mic },
  { label: 'Mentors',  href: '/mentors',   icon: Users },
  { label: 'Jobs',     href: '/jobs',      icon: Briefcase },
]

const userNav = [
  { label: 'Write',     href: '/new/post',   icon: PenSquare },
  { label: 'Drafts',    href: '/drafts',     icon: BookMarked },
  { label: 'Bookmarks', href: '/bookmarks',  icon: Bookmark },
  { label: 'Settings',  href: '/settings',   icon: Settings },
]

interface SidebarProps {
  user: { email?: string; name?: string; avatar?: string; role?: string } | null
  isMobile?: boolean
}

export function Sidebar({ user, isMobile }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/feed' ? pathname === '/feed' : pathname.startsWith(href)

  return (
    <aside className="flex flex-col h-full py-6 px-4 gap-1">
      {/* Brand (Desktop only) */}
      {!isMobile && (
        <Link
          href="/feed"
          className="flex items-center gap-2 px-3 mb-6"
        >
          <span className="text-2xl font-normal tracking-tight font-display text-primary">
            FutureTech
          </span>
        </Link>
      )}

      {/* Main Navigation */}
      <nav className="flex flex-col gap-0.5 font-body">
        {mainNav.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              isActive(href)
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Divider */}
      <div className="my-3 h-px bg-border/40" />

      {/* User Nav */}
      {user && (
        <nav className="flex flex-col gap-0.5 font-body">
          {userNav.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive(href)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          ))}
          {user.role === 'admin' && (
            <Link
              href="/admin"
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive('/admin')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              Admin
            </Link>
          )}
        </nav>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* User Profile */}
      {user && (
        <div className="mt-4">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0 bg-primary">
              {(user.name ?? user.email ?? 'U').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0 font-body">
              <p className="text-sm font-medium text-foreground truncate">
                {user.name ?? 'My Account'}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          </Link>
        </div>
      )}
    </aside>
  )
}
