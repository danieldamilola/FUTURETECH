'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function NewQuestionForm() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tags, setTags] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 10000)
  }

  const handlePublish = async () => {
    if (!title.trim()) {
      setError('Title is required.')
      return
    }
    if (!body.trim()) {
      setError('Body cannot be empty.')
      return
    }

    setIsPublishing(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('You must be logged in to ask a question.')

      const parsedTags = tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)

      const questionData = {
        title: title.trim(),
        slug: generateSlug(title),
        body: body.trim(),
        tags: parsedTags,
        author_id: user.id,
      }

      const { data, error: dbError } = await supabase
        .from('questions')
        .insert(questionData)
        .select('id')
        .single()

      if (dbError) throw dbError

      router.push(`/questions/${data.id}`)
    } catch (err: any) {
      setError(err.message || 'Something went wrong while posting.')
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="max-w-[800px] mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-body">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className="px-5 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ask Question'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-body">
          {error}
        </div>
      )}

      <div className="space-y-6 bg-card p-8 rounded-2xl border border-border/40 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2 font-display">Question Title</label>
          <input
            type="text"
            placeholder="What's your technical question?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-lg font-body bg-background border border-border/60 outline-none placeholder:text-muted-foreground/40 text-foreground p-4 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2 font-display">Tags</label>
          <input
            type="text"
            placeholder="e.g. React, Supabase, TypeScript (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full text-sm font-mono bg-background border border-border/60 outline-none placeholder:text-muted-foreground/40 text-foreground p-3.5 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2 font-display">Details</label>
          <textarea
            placeholder="Provide context, code snippets, or what you've tried..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full h-64 text-sm font-body bg-background border border-border/60 outline-none placeholder:text-muted-foreground/40 text-foreground p-4 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all resize-none"
          />
        </div>
      </div>
    </div>
  )
}
