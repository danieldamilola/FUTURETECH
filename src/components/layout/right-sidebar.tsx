"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface TrendingTag {
  name: string;
  count: number;
}

interface TopMentor {
  username: string;
  name: string;
  rating: number;
  sessions: number;
}

interface ActiveJob {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
}

interface RightSidebarProps {
  tags?: TrendingTag[];
  mentors?: TopMentor[];
  jobs?: ActiveJob[];
}

const defaultTags: TrendingTag[] = [
  { name: "TypeScript", count: 412 },
  { name: "React", count: 389 },
  { name: "AI/ML", count: 301 },
  { name: "Rust", count: 244 },
  { name: "WebAssembly", count: 212 },
];

const defaultMentors: TopMentor[] = [
  { username: "priya_sharma", name: "Priya Sharma", rating: 4.9, sessions: 47 },
  { username: "daejung", name: "Dae-Jung Kim", rating: 5.0, sessions: 31 },
  { username: "elena_v", name: "Elena Vasquez", rating: 4.8, sessions: 62 },
];

const defaultJobs: ActiveJob[] = [
  { id: "1", title: "Staff Engineer", company: "Vercel", salary: "$200k–$260k", location: "Remote" },
  { id: "2", title: "Fullstack Engineer", company: "Linear", salary: "$160k–$204k", location: "Remote" },
  { id: "3", title: "DevOps Engineer", company: "Supabase", salary: "$140k–$180k", location: "Remote" },
];

export function RightSidebar({
  tags = defaultTags,
  mentors = defaultMentors,
  jobs = defaultJobs,
}: RightSidebarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Hide right side panel when logged out per user directive
  if (!isLoggedIn) {
    return null;
  }

  return (
    <aside className="w-[320px] shrink-0 border-l border-[var(--border)] bg-[var(--bg)] sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto p-4 hidden lg:block text-xs space-y-6 select-none">
      {/* Trending Tags Section */}
      <div>
        <div className="text-[11px] font-medium text-[var(--ink-muted)] mb-3 tracking-wider uppercase">
          Trending Tags
        </div>
        <div className="space-y-2">
          {tags.map((tag) => (
            <Link
              key={tag.name}
              href={`/explore?tag=${tag.name}`}
              className="flex items-center justify-between text-[var(--ink)] hover:text-[var(--accent)] transition-colors py-0.5"
            >
              <span>#{tag.name}</span>
              <span className="font-mono-numbers text-[var(--ink-muted)] text-[11px]">
                {tag.count}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-[var(--border)]" />

      {/* Top Mentors Section */}
      <div>
        <div className="text-[11px] font-medium text-[var(--ink-muted)] mb-3 tracking-wider uppercase">
          Top Mentors
        </div>
        <div className="space-y-3">
          {mentors.map((mentor) => (
            <Link
              key={mentor.username}
              href={`/mentors/${mentor.username}`}
              className="flex items-center justify-between hover:bg-[var(--surface)] p-1.5 -mx-1.5 rounded-[var(--radius-sm)] transition-colors group"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[var(--surface-high)] text-[var(--ink-muted)] font-bold text-[10px] flex items-center justify-center font-mono-numbers">
                  {mentor.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                    {mentor.name}
                  </div>
                </div>
              </div>
              <div className="font-mono-numbers text-[11px] text-[var(--ink-muted)]">
                {mentor.rating} · {mentor.sessions}s
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-2">
          <Link href="/mentors" className="text-[11px] text-[var(--accent)] hover:underline">
            View all mentors →
          </Link>
        </div>
      </div>

      <div className="border-t border-[var(--border)]" />

      {/* Active Jobs Section */}
      <div>
        <div className="text-[11px] font-medium text-[var(--ink-muted)] mb-3 tracking-wider uppercase">
          Active Jobs
        </div>
        <div className="space-y-2.5">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="block p-2 rounded-[var(--radius-sm)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] transition-colors"
            >
              <div className="font-medium text-[var(--ink)] text-xs">{job.title}</div>
              <div className="flex items-center justify-between mt-1 text-[11px] text-[var(--ink-muted)]">
                <span>{job.company}</span>
                <span className="font-mono-numbers">{job.salary}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-2">
          <Link href="/jobs" className="text-[11px] text-[var(--accent)] hover:underline">
            Browse all jobs →
          </Link>
        </div>
      </div>
    </aside>
  );
}
