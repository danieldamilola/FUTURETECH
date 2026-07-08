import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Clock, Edit2, PenLine, Trash2 } from 'lucide-react'

export const metadata = { title: 'My Drafts | FutureTech' }

export default async function DraftsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch only drafts authored by the current user
  const { data: drafts, error } = await supabase
    .from('articles')
    .select('id, title, slug, deck, updated_at')
    .eq('author_id', user.id)
    .eq('is_draft', true)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching drafts:', error)
  }

  return (
    <div className="max-w-[800px] mx-auto py-6">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-display font-medium text-foreground tracking-tight">My Drafts</h1>
          <p className="text-muted-foreground mt-1 text-sm font-body">Unpublished articles and stories.</p>
        </div>
        <Link
          href="/new/post"
          className="flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-xl hover:bg-primary transition-colors"
        >
          <PenLine className="w-4 h-4" /> New Draft
        </Link>
      </div>

      {(!drafts || drafts.length === 0) ? (
        <div className="border border-border/60 rounded-2xl p-12 text-center bg-card shadow-sm">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <PenLine className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-foreground font-display mb-1">No drafts yet</h3>
          <p className="text-muted-foreground text-sm font-body max-w-[250px] mx-auto mb-6">
            You don't have any unpublished stories. Start writing to share your knowledge!
          </p>
          <Link
            href="/new/post"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-sm font-medium rounded-xl hover:bg-primary transition-colors"
          >
            Start Writing
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {drafts.map((draft) => (
            <div key={draft.id} className="group border border-border/60 bg-card rounded-2xl p-5 hover:border-primary/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm hover:shadow-md">
              <div className="flex-1 min-w-0">
                <Link href={`/new/post?id=${draft.id}`} className="block group-hover:text-primary transition-colors">
                  <h2 className="text-lg font-display font-medium text-foreground mb-1 truncate">
                    {draft.title || 'Untitled Draft'}
                  </h2>
                </Link>
                {draft.deck && (
                  <p className="text-sm text-muted-foreground font-body truncate mb-3">
                    {draft.deck}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  Last edited {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(draft.updated_at || new Date()))}
                </div>
              </div>
              
              <div className="flex items-center gap-2 border-t sm:border-t-0 border-border/40 pt-4 sm:pt-0">
                <Link
                  href={`/new/post?id=${draft.id}`}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </Link>
                <button className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
