'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, TrendingUp, Clock, HelpCircle, ChevronRight } from 'lucide-react'
import { articles, questions } from '@/lib/mock-data'
import { ArticleRow } from '@/components/feed/article-row'
import { QuestionRow } from '@/components/feed/question-row'
import { HeroArticle } from '@/components/feed/hero-article'

type FeedTab = 'foryou' | 'trending' | 'recent' | 'questions'

export default function FeedPage() {
  const router = useRouter()
  const [tab, setTab] = useState<FeedTab>('foryou')
  
  const feed = tab === 'trending' ? [...articles].sort((a, b) => b.upvotes - a.upvotes) : tab === 'recent' ? [...articles].reverse() : articles
  const [hero, ...rest] = feed

  const tabs: { id: FeedTab; label: string; icon: React.ElementType }[] = [
    { id: 'foryou',    label: 'For You',  icon: Sparkles   },
    { id: 'trending',  label: 'Trending', icon: TrendingUp },
    { id: 'recent',    label: 'Recent',   icon: Clock      },
    { id: 'questions', label: 'Q&A',      icon: HelpCircle },
  ]

  const navigate = (path: string) => {
    // Basic navigation mapping from prototype concepts to FutureTech routes
    if (path === 'article') router.push('/blog/1')
    if (path === 'question') router.push('/questions/1')
  }

  return (
    <div className="pt-2">
      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-border mb-12">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 text-sm px-5 py-3 border-b-2 -mb-px transition-colors flex-shrink-0 ${tab === id ? 'border-primary text-foreground font-medium' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {tab !== 'questions' ? (
        <>
          {/* Hero */}
          {hero && <HeroArticle hero={hero} navigate={navigate} />}

          <div className="my-12 border-t border-border/60" />
          
          {/* Standard List */}
          <div className="divide-y divide-border/60">
            {rest.map(a => <ArticleRow key={a.id} article={a} navigate={navigate} />)}
          </div>
          
          <div className="mt-10 flex items-center justify-between border-t border-border/60 pt-8">
            <span className="text-sm text-muted-foreground font-mono">5 of 2,847 articles</span>
            <button className="flex items-center gap-1.5 text-sm text-foreground border border-border rounded-lg px-5 py-2.5 hover:bg-muted transition-colors font-body font-medium">
              Load more <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-10">
            <span className="text-sm text-muted-foreground font-mono">2,847 open questions</span>
            <button onClick={() => router.push('/new/question')} className="flex items-center gap-1.5 text-sm font-medium bg-foreground text-background px-5 py-2.5 rounded-lg hover:bg-primary transition-colors font-body">
              <HelpCircle className="w-3.5 h-3.5" /> Ask a Question
            </button>
          </div>
          <div className="divide-y divide-border/60">
            {questions.map(q => <QuestionRow key={q.id} q={q} navigate={navigate} />)}
          </div>
        </>
      )}
    </div>
  )
}
