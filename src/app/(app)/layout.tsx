import { isSupabaseConfigured } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/sidebar'
import { RightSidebar } from '@/components/layout/right-sidebar'
import { MobileNav } from '@/components/layout/mobile-nav'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  let sidebarUser = null

  // Only attempt Supabase calls if credentials are configured
  if (isSupabaseConfigured) {
    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, avatar_url, role')
          .eq('id', user.id)
          .single()

        sidebarUser = {
          email: user.email,
          name: profile?.display_name ?? undefined,
          avatar: profile?.avatar_url ?? undefined,
          role: profile?.role ?? undefined,
        }
      }
    } catch {
      // Supabase not reachable — render layout without user data
    }
  }

  return (
    <div className="min-h-dvh flex bg-background">
      {/* Left Sidebar — fixed on desktop */}
      <div className="hidden lg:flex flex-col w-60 xl:w-64 flex-shrink-0 fixed top-0 left-0 h-full border-r border-border/40 bg-card">
        <Sidebar user={sidebarUser} />
      </div>

      {/* Main content + Right Sidebar */}
      <div className="flex-1 lg:ml-60 xl:ml-64 flex flex-col min-h-dvh">
        <MobileNav user={sidebarUser} />
        
        {/* We constrain the feed wrapper to show the main content and right sidebar side-by-side */}
        <div className="flex-1 max-w-[1440px] mx-auto w-full px-6 md:px-12 py-10 flex gap-12 lg:gap-20 xl:gap-24">
          <main className="flex-1 min-w-0 max-w-[840px]">
            {children}
          </main>

          {/* Right Sidebar */}
          <RightSidebar />
        </div>
      </div>
    </div>
  )
}
