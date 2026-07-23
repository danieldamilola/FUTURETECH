"use client";

import React, { useState } from "react";
import { ContentTag } from "@/components/ui/content-tag";
import { Play, Pause } from "lucide-react";

interface Episode {
  id: string;
  tag: string;
  title: string;
  host: string;
  description: string;
  duration: string;
  date: string;
}

const episodes: Episode[] = [
  {
    id: "1",
    tag: "AI/ML",
    title: "The context window wars: why longer isn't always better",
    host: "Dr. Amanda Chen & Riku Yamamoto",
    description: "We talk to researchers from Anthropic and DeepMind about the real tradeoffs in extending context windows beyond 100k tokens and what 'attention' actually costs.",
    duration: "47:32",
    date: "Jan 13, 2026",
  },
  {
    id: "2",
    tag: "STARTUP",
    title: "Building in public: the honest numbers behind our $2M ARR journey",
    host: "Ava Torres",
    description: "Ava Torres, founder of Flowline, shares real CAC, churn, and burn rate numbers from their $0–$2M ARR journey. No vague percentages, no survivorship bias.",
    duration: "52:14",
    date: "Jan 10, 2026",
  },
  {
    id: "3",
    tag: "POSTGRESQL",
    title: "Postgres as a queue: when it actually works and when it definitely does not",
    host: "Paul Ramirez",
    description: "Paul from PGMQ walks through the practical realities of using Postgres as a message queue for workloads up to 10k msg/s. Advisory locks, SKIP LOCKED, and failure modes.",
    duration: "38:55",
    date: "Jan 7, 2026",
  },
];

export default function PodcastsPage() {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <h1 className="text-sm font-medium text-[var(--ink)]">Podcasts</h1>
        <span className="font-mono-numbers text-xs text-[var(--ink-muted)]">
          {episodes.length} episodes
        </span>
      </div>

      <div className="divide-y divide-[var(--border)]">
        {episodes.map((ep) => {
          const isPlaying = playingId === ep.id;
          return (
            <div key={ep.id} className="py-4 flex gap-4 items-start">
              <button
                type="button"
                onClick={() => togglePlay(ep.id)}
                className="w-10 h-10 rounded-full bg-[var(--surface)] hover:bg-[var(--surface-high)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] shrink-0 transition-colors cursor-pointer"
                aria-label={isPlaying ? "Pause episode" : "Play episode"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <ContentTag type="podcast" label={ep.tag} />
                </div>

                <h2 className="text-sm font-medium text-[var(--ink)] mb-1 leading-snug">
                  {ep.title}
                </h2>

                <div className="text-xs text-[var(--ink-muted)] mb-2">with {ep.host}</div>

                <p className="text-xs text-[var(--ink-muted)] line-clamp-2 mb-3 leading-relaxed">
                  {ep.description}
                </p>

                {/* Scrubber indicator */}
                {isPlaying && (
                  <div className="w-full bg-[var(--surface)] h-1 rounded-full overflow-hidden mb-2">
                    <div className="bg-[var(--accent)] h-full w-1/3 animate-pulse" />
                  </div>
                )}

                <div className="text-[11px] text-[var(--ink-muted)] font-mono-numbers flex items-center justify-between">
                  <span>{ep.date}</span>
                  <span>{ep.duration}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
