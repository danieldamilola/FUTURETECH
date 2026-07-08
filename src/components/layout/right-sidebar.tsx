'use client'

import React from 'react'
import Link from 'next/link'
import { TrendingUp, Users, Mic, Star, Award, PenLine, Rss } from 'lucide-react'
import { Avatar } from '../ui/avatar'
import { Tag } from '../ui/tag'

// Placeholder data until we hook up Supabase
const trendingTags = [
  { name: 'React', posts: 1420 },
  { name: 'Nextjs', posts: 890 },
  { name: 'SystemDesign', posts: 654 },
  { name: 'TypeScript', posts: 1120 }
]

const topAuthors = [
  { initials: 'AD', name: 'Amara Diallo', verified: true, bio: 'Senior Engineer at Stripe', followers: '12.4k' },
  { initials: 'MW', name: 'Marcus Webb', verified: false, bio: 'Frontend architect', followers: '8.2k' }
]

const jobListings = [
  { id: 1, slug: 'VER', role: 'Frontend Engineer', company: 'Vercel', dept: 'Engineering', locationType: 'Remote', featured: true },
  { id: 2, slug: 'STR', role: 'Backend Developer', company: 'Stripe', dept: 'Engineering', locationType: 'Hybrid', featured: false }
]

const companyBg: Record<string, string> = {
  VER: '#000000',
  STR: '#635BFF'
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground/80 mb-5 font-mono">
      {children}
    </h3>
  )
}

export function RightSidebar() {
  return (
    <aside className="hidden xl:flex flex-col gap-12 w-80 flex-shrink-0 pt-2 pb-10 pr-6">
      <div>
        <SectionLabel>Trending Tags</SectionLabel>
        <ul className="space-y-4">
          {trendingTags.map(tag => (
            <li key={tag.name} className="flex items-center justify-between group cursor-pointer">
              <Link href={`/explore?tag=${tag.name}`} className="flex items-center justify-between w-full">
                <span className="text-[13px] text-foreground group-hover:text-primary transition-colors font-mono">#{tag.name}</span>
                <span className="text-xs text-muted-foreground font-mono">{tag.posts.toLocaleString()}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <SectionLabel>Top Authors</SectionLabel>
        <ul className="space-y-6">
          {topAuthors.map(a => (
            <li key={a.initials} className="group cursor-pointer">
              <Link href="/explore" className="flex items-center gap-3">
                <Avatar initials={a.initials} size={34} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate font-body">{a.name}</p>
                    {a.verified && <Award className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 font-body truncate">{a.bio}</p>
                  <p className="text-[11px] text-muted-foreground mt-1 font-mono">{a.followers} followers</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="flex items-center justify-between mb-5">
          <SectionLabel>Open Roles</SectionLabel>
          <Link href="/jobs" className="text-[10px] text-primary hover:underline font-mono -mt-5">See all</Link>
        </div>
        <ul className="space-y-5">
          {jobListings.map(job => (
            <li key={job.id} className="group cursor-pointer">
              <Link href="/jobs" className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-md flex-shrink-0 flex items-center justify-center mt-0.5"
                  style={{ background: companyBg[job.slug], fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>
                  {job.slug}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug font-body">{job.role}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-body">{job.company}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-primary/5 text-muted-foreground rounded-sm border border-border/60 font-mono">
                      {job.dept.split(" ")[0]}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">{job.locationType}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="border border-border/60 rounded-xl p-5 bg-card shadow-sm">
        <p className="text-[17px] text-foreground mb-2 leading-snug font-display font-medium">
          Write for FutureTech
        </p>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed font-body">
          Share what you know with 48,000 developers.
        </p>
        <Link href="/new/post" className="w-full text-sm font-medium bg-foreground text-background py-2.5 rounded-lg hover:bg-primary transition-colors flex items-center justify-center gap-2">
          <PenLine className="w-4 h-4" /> Start Writing
        </Link>
      </div>

      <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono">
        <Rss className="w-3.5 h-3.5" /> Subscribe via RSS
      </button>
    </aside>
  )
}
