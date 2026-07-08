'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, TrendingUp, Clock, HelpCircle, ChevronRight, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ArticleRow } from '@/components/feed/article-row'
import { QuestionRow } from '@/components/feed/question-row'
import { HeroArticle } from '@/components/feed/hero-article'
import { Article, Question } from '@/types'

type FeedTab = 'foryou' | 'trending' | 'recent' | 'questions'

export default function FeedPage() {
  const router = useRouter()
  const [tab, setTab] = useState<FeedTab>('foryou')
  
  const [articles, setArticles] = useState<Article[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    async function fetchFeed() {
      setIsLoading(true)
      const supabase = createClient()
      
      // Fetch articles
      let articleQuery = supabase
        .from('articles')
        .select(`
          id, title, slug, deck, tags, read_time, published_at, upvotes, comments_count, cover_image, is_draft,
          author:profiles(id, display_name, avatar_url, verified)
        `)
        .eq('is_draft', false)
      
      if (tab === 'trending') {
        articleQuery = articleQuery.order('upvotes', { ascending: false })
      } else {
        articleQuery = articleQuery.order('published_at', { ascending: false })
      }
      
      const { data: articlesData } = await articleQuery.limit(20)
      
      if (articlesData) {
        // Map to expected types
        const mappedArticles: any[] = articlesData.map(a => ({
          ...a,
          author: a.author || { display_name: 'Unknown', verified: false }
        }))
        setArticles(mappedArticles)
      }
      
      // Fetch questions if tab is questions
      if (tab === 'questions') {
        const { data: questionsData } = await supabase
          .from('questions')
          .select(`
            id, title, slug, body, tags, upvotes, answers_count, views, is_solved, created_at,
            author:profiles(id, display_name, avatar_url, verified)
          `)
          .order('created_at', { ascending: false })
          .limit(20)
          
        if (questionsData) {
          const mappedQuestions: any[] = questionsData.map(q => ({
            ...q,
            author: q.author || { display_name: 'Unknown', verified: false }
          }))
          setQuestions(mappedQuestions)
        }
      }
      
      setIsLoading(false)
    }
    
    fetchFeed()
  }, [tab])

  const tabs: { id: FeedTab; label: string; icon: React.ElementType }[] = [
    { id: 'foryou',    label: 'For You',  icon: Sparkles   },
    { id: 'trending',  label: 'Trending', icon: TrendingUp },
    { id: 'recent',    label: 'Recent',   icon: Clock      },
    { id: 'questions', label: 'Q&A',      icon: HelpCircle },
  ]

  const navigate = (path: string) => {
    if (path === 'article') router.push('/blog/1')
    if (path === 'question') router.push('/questions/1')
  }

  const [hero, ...rest] = articles

  return (
    <div className="pt-2">
      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-border mb-12 overflow-x-auto no-scrollbar">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 text-sm px-5 py-3 border-b-2 -mb-px transition-colors flex-shrink-0 ${tab === id ? 'border-primary text-foreground font-medium' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : tab !== 'questions' ? (
        <>
          {articles.length === 0 ? (
             <div className="text-center py-20 text-muted-foreground font-body">
               No articles found. Be the first to <a href="/new/post" className="text-primary hover:underline">write one</a>!
             </div>
          ) : (
            <>
              {/* Hero */}
              {hero && <HeroArticle hero={hero} navigate={navigate} />}

              <div className="my-12 border-t border-border/60" />
              
              {/* Standard List */}
              <div className="divide-y divide-border/60">
                {rest.map(a => <ArticleRow key={a.id} article={a} navigate={navigate} />)}
              </div>
              
              {rest.length > 0 && (
                <div className="mt-10 flex items-center justify-between border-t border-border/60 pt-8">
                  <span className="text-sm text-muted-foreground font-mono">Showing latest articles</span>
                  <button className="flex items-center gap-1.5 text-sm text-foreground border border-border rounded-lg px-5 py-2.5 hover:bg-muted transition-colors font-body font-medium">
                    Load more <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-10">
            <span className="text-sm text-muted-foreground font-mono">{questions.length} open questions</span>
            <button onClick={() => router.push('/new/question')} className="flex items-center gap-1.5 text-sm font-medium bg-foreground text-background px-5 py-2.5 rounded-lg hover:bg-primary transition-colors font-body">
              <HelpCircle className="w-3.5 h-3.5" /> Ask a Question
            </button>
          </div>
          {questions.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground font-body">
              No questions found. Be the first to <a href="/new/question" className="text-primary hover:underline">ask one</a>!
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {questions.map(q => <QuestionRow key={q.id} q={q} navigate={navigate} />)}
            </div>
          )}
        </>
      )}
    </div>
  )
}
