import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function RightSidebar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [
    { data: tags },
    { data: mentorsData },
    { data: jobsData }
  ] = await Promise.all([
    supabase.from("tags").select("id, name, slug").order("name").limit(8),
    supabase.from("mentor_profiles").select("id, hourly_rate_cents, is_accepting_sessions, profile:profiles!user_id(display_name, username, avatar_url)").eq("is_accepting_sessions", true).limit(3) as any,
    supabase.from("jobs").select("id, title, company_name, salary_range").eq("status", "active").order("created_at", { ascending: false }).limit(3) as any,
  ]);

  const mentors = mentorsData || [];
  const jobs = jobsData || [];

  return (
    <aside className="w-[320px] shrink-0 border-l border-[var(--border)] bg-[var(--bg)] sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto p-4 hidden lg:block text-xs space-y-6 select-none">
      {/* Trending Tags Section */}
      <div>
        <div className="text-[11px] font-medium text-[var(--ink-muted)] mb-3 tracking-wider uppercase">
          Trending Tags
        </div>
        {!tags || tags.length === 0 ? (
          <p className="text-[var(--ink-faint)] text-[11px]">No trending tags yet.</p>
        ) : (
          <div className="space-y-2">
            {tags.map((tag: any) => (
              <Link
                key={tag.id}
                href={`/explore?tag=${tag.slug}`}
                className="flex items-center justify-between text-[var(--ink)] hover:text-[var(--accent)] transition-colors py-0.5"
              >
                <span>#{tag.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {mentors.length > 0 && (
        <>
          <div className="border-t border-[var(--border)]" />
          
          {/* Top Mentors Section */}
          <div>
            <div className="text-[11px] font-medium text-[var(--ink-muted)] mb-3 tracking-wider uppercase">
              Top Mentors
            </div>
            <div className="space-y-3">
              {mentors.map((mentor: any) => (
                <Link
                  key={mentor.id}
                  href={`/mentors/${mentor.profile?.username}`}
                  className="flex items-center justify-between hover:bg-[var(--surface)] p-1.5 -mx-1.5 rounded-[var(--radius-sm)] transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[var(--surface-high)] text-[var(--ink-muted)] font-bold text-[10px] flex items-center justify-center font-mono-numbers">
                      {mentor.profile?.display_name?.slice(0, 2).toUpperCase() || '??'}
                    </div>
                    <div>
                      <div className="font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                        {mentor.profile?.display_name}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono-numbers text-[11px] text-[var(--ink-muted)]">
                    ${(mentor.hourly_rate_cents / 100).toFixed(0)}/hr
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
        </>
      )}

      {jobs.length > 0 && (
        <>
          <div className="border-t border-[var(--border)]" />
          
          {/* Active Jobs Section */}
          <div>
            <div className="text-[11px] font-medium text-[var(--ink-muted)] mb-3 tracking-wider uppercase">
              Active Jobs
            </div>
            <div className="space-y-2.5">
              {jobs.map((job: any) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="block p-2 rounded-[var(--radius-sm)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] transition-colors"
                >
                  <div className="font-medium text-[var(--ink)] text-xs">{job.title}</div>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-[var(--ink-muted)]">
                    <span>{job.company_name}</span>
                    {job.salary_range && (
                      <span className="font-mono-numbers">{job.salary_range}</span>
                    )}
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
        </>
      )}
    </aside>
  );
}
