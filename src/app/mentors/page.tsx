import React from "react";
import Link from "next/link";
import { Users, Star, Calendar, Clock, DollarSign } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function MentorsPage() {
  const supabase = await createClient();

  const { data: mentors, error } = await (supabase.from("mentor_profiles") as any)
    .select(
      `
      id,
      headline,
      hourly_rate_cents,
      expertise_tags,
      bio,
      is_accepting_sessions,
      profile:profiles!user_id(id, username, display_name, avatar_url, reputation)
    `
    )
    .eq("is_accepting_sessions", true)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-[var(--radius-lg)] bg-[#16191E] border border-[var(--border-strong)] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent)] mb-1">
            <Users className="w-4 h-4" />
            <span>Developer Mentorship</span>
          </div>
          <h1 className="text-xl font-bold text-[var(--ink)] tracking-tight">
            1-on-1 Technical Mentorship
          </h1>
          <p className="text-xs text-[var(--ink-muted)] mt-1">
            Book private 45-minute code reviews, architecture consultations, and career advice with industry leaders.
          </p>
        </div>
      </div>

      {/* Mentors Directory List */}
      <div className="space-y-4">
        {!mentors || mentors.length === 0 ? (
          <div className="p-10 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] text-center">
            <h3 className="text-sm font-bold text-[var(--ink)] mb-1">
              No Mentors Available
            </h3>
            <p className="text-xs text-[var(--ink-muted)]">
              No mentors available right now. Check back soon or apply to become a mentor in Settings.
            </p>
          </div>
        ) : (
          mentors.map((mentor: any) => {
            const { profile, hourly_rate_cents, headline, bio, expertise_tags } = mentor;
            const rate = hourly_rate_cents === 0 ? "Free" : `$${(hourly_rate_cents / 100).toFixed(0)}`;
            
            return (
              <article
                key={mentor.id}
                className="p-5 rounded-[var(--radius-md)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.display_name}
                        className="w-11 h-11 rounded-full object-cover shrink-0 bg-[var(--surface-high)]"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-[var(--surface-high)] text-[var(--accent)] font-bold text-sm flex items-center justify-center font-mono-numbers shrink-0">
                        {profile.display_name ? profile.display_name.slice(0, 2).toUpperCase() : "?"}
                      </div>
                    )}
                    <div>
                      <h2 className="text-base font-bold text-[var(--ink)] flex items-center gap-2">
                        {profile.display_name}
                      </h2>
                      <div className="text-xs text-[var(--ink-muted)] mt-0.5 font-medium">
                        {headline}
                      </div>
                      <Link href={`/profile/${profile.username}`} className="text-[10px] text-[var(--ink-faint)] hover:text-[var(--accent)] font-mono-numbers mt-1 block">
                        @{profile.username}
                      </Link>
                    </div>
                  </div>

                  {/* Rating & Rate Badge */}
                  <div className="text-right shrink-0">
                    <div className="text-sm font-mono-numbers font-bold text-[var(--ink)] flex items-center gap-1 justify-end">
                      {hourly_rate_cents > 0 && <DollarSign className="w-3.5 h-3.5 text-[var(--accent)]" />}
                      <span>{rate}</span>
                      <span className="text-xs font-normal text-[var(--ink-muted)]">/45m</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-mono-numbers text-[var(--ink-muted)] mt-0.5">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-[var(--ink)]">5.0</span>
                      <span>(New)</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                  {bio}
                </p>

                {/* Expertise Tags & Action */}
                <div className="pt-3 flex items-center justify-between border-t border-[var(--border)]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {Array.isArray(expertise_tags) && expertise_tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[10px] font-mono-numbers bg-[var(--surface-high)] text-[var(--ink-muted)] border border-[var(--border)]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/mentors/${profile.username}`}
                    className="px-3 py-1.5 bg-[var(--accent)] text-[var(--bg)] font-medium text-xs rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Session</span>
                  </Link>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
