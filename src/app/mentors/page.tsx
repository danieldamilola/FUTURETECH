"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, Star, DollarSign, Award } from "lucide-react";

interface MentorItem {
  username: string;
  name: string;
  headline: string;
  hourlyRate: string;
  rating: number;
  reviewsCount: number;
  sessionsCount: number;
  expertise: string[];
}

const mentorsList: MentorItem[] = [
  {
    username: "priya_sharma",
    name: "Priya Sharma",
    headline: "Staff Engineer @ Stripe · Distributed Systems & Rust",
    hourlyRate: "$150/hr",
    rating: 4.9,
    reviewsCount: 38,
    sessionsCount: 47,
    expertise: ["TypeScript", "Rust", "PostgreSQL", "Distributed Systems"],
  },
  {
    username: "daejung",
    name: "Dae-Jung Kim",
    headline: "Principal Architect @ Vercel · Next.js & Turbopack",
    hourlyRate: "$180/hr",
    rating: 5.0,
    reviewsCount: 29,
    sessionsCount: 31,
    expertise: ["Next.js", "React", "WebAssembly", "Performance"],
  },
  {
    username: "elena_v",
    name: "Elena Vasquez",
    headline: "Engineering Lead @ Cloudflare · Edge Computing & Go",
    hourlyRate: "$140/hr",
    rating: 4.8,
    reviewsCount: 54,
    sessionsCount: 62,
    expertise: ["Go", "Edge Computing", "Kubernetes", "DevOps"],
  },
];

export default function MentorsDirectoryPage() {
  const [techFilter, setTechFilter] = useState("");

  const filteredMentors = mentorsList.filter((m) =>
    techFilter === ""
      ? true
      : m.expertise.some((e) => e.toLowerCase().includes(techFilter.toLowerCase()))
  );

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[var(--accent)]" />
          <h1 className="text-sm font-medium text-[var(--ink)]">Technical Mentors</h1>
        </div>
        <span className="font-mono-numbers text-xs text-[var(--ink-muted)]">
          {mentorsList.length} verified mentors
        </span>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="search"
          placeholder="Filter by skill (e.g. Rust, Next.js)..."
          value={techFilter}
          onChange={(e) => setTechFilter(e.target.value)}
          className="w-full max-w-sm px-3 py-1.5 text-xs bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent)]"
        />
      </div>

      <div className="space-y-3">
        {filteredMentors.map((mentor) => (
          <div
            key={mentor.username}
            className="p-4 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--surface-high)] text-[var(--accent)] font-bold text-xs flex items-center justify-center font-mono-numbers shrink-0">
                  {mentor.name.slice(0, 2).toUpperCase()}
                </div>

                <div>
                  <h2 className="text-sm font-medium text-[var(--ink)]">
                    <Link href={`/mentors/${mentor.username}`} className="hover:underline">
                      {mentor.name}
                    </Link>
                  </h2>
                  <p className="text-xs text-[var(--ink-muted)] mt-0.5">{mentor.headline}</p>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {mentor.expertise.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-[var(--radius-sm)] bg-[var(--surface-high)] text-[var(--ink)] text-[10px] font-mono-numbers"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-mono-numbers text-xs font-semibold text-[var(--ink)] flex items-center justify-end gap-0.5">
                  <DollarSign className="w-3 h-3 text-[var(--accent)]" />
                  <span>{mentor.hourlyRate}</span>
                </div>

                <div className="flex items-center justify-end gap-1 text-[11px] font-mono-numbers text-[var(--ink-muted)] mt-1">
                  <Star className="w-3 h-3 fill-[var(--classifier-podcast)] text-[var(--classifier-podcast)]" />
                  <span>{mentor.rating}</span>
                  <span>({mentor.reviewsCount})</span>
                </div>

                <div className="mt-3">
                  <Link
                    href={`/mentors/${mentor.username}`}
                    className="inline-block px-3 py-1 bg-[var(--accent)] text-[var(--bg)] text-xs font-medium rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
                  >
                    Book Session
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
