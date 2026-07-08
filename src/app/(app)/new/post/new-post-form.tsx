'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RichTextEditor } from '@/components/editor/editor'
import { Loader2, ArrowLeft, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function NewPostForm() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [deck, setDeck] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 10000)
  }

  const handleSave = async (isDraft: boolean) => {
    if (!title.trim()) {
      setError('Title is required.')
      return
    }
    if (!content.trim() || content === '<p></p>') {
      setError('Content cannot be empty.')
      return
    }

    if (isDraft) setIsSavingDraft(true)
    else setIsPublishing(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('You must be logged in to publish.')

      const parsedTags = tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)

      const articleData = {
        title: title.trim(),
        slug: generateSlug(title),
        deck: deck.trim(),
        content,
        tags: parsedTags,
        author_id: user.id,
        is_draft: isDraft,
        published_at: isDraft ? null : new Date().toISOString(),
      }

      const { data, error: dbError } = await supabase
        .from('articles')
        .insert(articleData)
        .select('slug')
        .single()

      if (dbError) throw dbError

      if (isDraft) {
        router.push('/drafts')
      } else {
        router.push(`/blog/${data.slug}`)
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong while saving.')
    } finally {
      setIsSavingDraft(false)
      setIsPublishing(false)
    }
  }

  return (
    <div className="max-w-[800px] mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-body">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave(true)}
            disabled={isSavingDraft || isPublishing}
            className="px-5 py-2 text-sm font-medium text-foreground bg-transparent border border-border rounded-xl hover:bg-muted transition-colors disabled:opacity-50"
          >
            {isSavingDraft ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Draft'}
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={isSavingDraft || isPublishing}
            className="px-5 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-body">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Article Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-4xl sm:text-5xl font-display font-medium bg-transparent border-none outline-none placeholder:text-muted-foreground/30 text-foreground"
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="A short subtitle or deck..."
            value={deck}
            onChange={(e) => setDeck(e.target.value)}
            className="w-full text-lg sm:text-xl font-body bg-transparent border-none outline-none placeholder:text-muted-foreground/40 text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-3 border-y border-border/40 py-4">
          <input
            type="text"
            placeholder="Add tags separated by commas (e.g. React, UI/UX, Nextjs)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm font-mono placeholder:text-muted-foreground/40 text-foreground"
          />
          <button className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md hover:bg-muted">
            <ImageIcon className="w-3.5 h-3.5" /> Cover Image
          </button>
        </div>

        <div className="pt-4">
          <RichTextEditor content={content} onChange={setContent} />
        </div>
      </div>
    </div>
  )
}
