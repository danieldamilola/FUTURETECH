'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Sidebar } from './sidebar'
import { cn } from '@/lib/utils'

interface MobileNavProps {
  user: { email?: string; name?: string; avatar?: string; role?: string } | null
}

export function MobileNav({ user }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  return (
    <>
      {/* Top Header (Mobile Only) */}
      <div
        className="lg:hidden flex items-center justify-between px-4 py-3 border-b sticky top-0 z-30"
        style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(226,232,240,0.7)' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="p-1 -ml-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-[#18181B]" />
          </button>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: '#B91C1C' }}
          >
            FutureTech
          </span>
        </div>
        
        {/* Placeholder for future top-right actions (e.g. search icon) */}
        <div className="w-8" />
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sliding Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 transform bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[rgba(226,232,240,0.7)]">
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: '#B91C1C' }}
          >
            FutureTech
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 -mr-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-[#71717A]" />
          </button>
        </div>
        
        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto">
          <Sidebar user={user} isMobile />
        </div>
      </div>
    </>
  )
}
