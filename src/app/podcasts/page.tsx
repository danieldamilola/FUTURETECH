"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AudioPlayer } from "@/components/podcasts/audio-player";
import { BookmarkButton } from "@/components/ui/bookmark-button";
import { FollowButton } from "@/components/ui/follow-button";
import {
  Headphones, Clock, Calendar, TrendingUp, Users, Radio,
  Play, Plus, Mic, ChevronRight, Flame
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────
interface PodcastShow {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImageUrl: string;
  category: string;
  authorName: string;
  authorUsername: string;
  followersCount: number;
  episodesCount: number;
  isFollowing: boolean;
}

interface PodcastEpisode {
  id: string;
  slug: string;
  title: string;
  description: string;
  audioUrl: string;
  durationSeconds: number;
  publishedAt: string;
  showTitle: string;
  showId: string;
  authorName: string;
  authorUsername: string;
  playsCount: number;
  coverImageUrl?: string;
}

// ── Mock Data ──────────────────────────────────────────────────
const mockShows: PodcastShow[] = [
  {
    id: "show-1",
    slug: "the-rust-runtime",
    title: "The Rust Runtime",
    description: "Deep dives into async Rust, memory safety patterns, and systems programming with the language that refuses to let you shoot yourself in the foot.",
    coverImageUrl: "",
    category: "Systems",
    authorName: "Dae-Jung Kim",
    authorUsername: "daejung_kim",
    followersCount: 2840,
    episodesCount: 34,
    isFollowing: false,
  },
  {
    id: "show-2",
    slug: "typescript-uncovered",
    title: "TypeScript Uncovered",
    description: "Every edge case, type-level trick, and compiler quirk you never knew existed. Weekly episodes from the trenches of large-scale TypeScript codebases.",
    coverImageUrl: "",
    category: "Language",
    authorName: "Priya Sharma",
    authorUsername: "priya_sharma",
    followersCount: 5120,
    episodesCount: 61,
    isFollowing: true,
  },
  {
    id: "show-3",
    slug: "ml-engineering-live",
    title: "ML Engineering Live",
    description: "Production ML: inference optimization, model serving, RAG architectures, and what no one tells you about running LLMs at scale.",
    coverImageUrl: "",
    category: "AI/ML",
    authorName: "Elena Vasquez",
    authorUsername: "elena_vasquez",
    followersCount: 8930,
    episodesCount: 22,
    isFollowing: false,
  },
  {
    id: "show-4",
    slug: "edge-architecture",
    title: "Edge Architecture",
    description: "Cloudflare Workers, Durable Objects, edge databases, and building globally distributed systems that actually stay consistent.",
    coverImageUrl: "",
    category: "Infrastructure",
    authorName: "Marcus Webb",
    authorUsername: "marcus_webb",
    followersCount: 1470,
    episodesCount: 18,
    isFollowing: false,
  },
];

const mockTrendingEpisodes: PodcastEpisode[] = [
  {
    id: "ep-1",
    slug: "kv-stores-cloudflare-durable-objects",
    title: "Building High-Throughput KV Stores with Cloudflare Workers & Durable Objects",
    description: "Elena Vasquez joins us to discuss multi-region key-value consistency, state replication, and avoiding deadlock pitfalls in serverless edge runtimes.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    durationSeconds: 2820,
    publishedAt: "July 22, 2026",
    showTitle: "Edge Architecture",
    showId: "show-4",
    authorName: "Marcus Webb",
    authorUsername: "marcus_webb",
    playsCount: 14200,
    coverImageUrl: "",
  },
  {
    id: "ep-2",
    slug: "rust-memory-safety-concurrency",
    title: "Rust Memory Safety & Concurrency without Arc<Mutex<T>> Deadlocks",
    description: "Dae-Jung Kim breaks down channel-based message passing, lock-free lock ordering, and asynchronous execution patterns in high-concurrency Tokio systems.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    durationSeconds: 1980,
    publishedAt: "July 18, 2026",
    showTitle: "The Rust Runtime",
    showId: "show-1",
    authorName: "Dae-Jung Kim",
    authorUsername: "daejung_kim",
    playsCount: 9800,
    coverImageUrl: "",
  },
  {
    id: "ep-3",
    slug: "context-window-wars-llm-attention",
    title: "The Context Window Wars: Scaling LLM Attention Beyond 1M Tokens",
    description: "DeepMind and Anthropic researchers talk memory-efficient attention mechanisms, RAG vs long-context tradeoffs, and future AI developer tools.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    durationSeconds: 3120,
    publishedAt: "July 12, 2026",
    showTitle: "ML Engineering Live",
    showId: "show-3",
    authorName: "Elena Vasquez",
    authorUsername: "elena_vasquez",
    playsCount: 21500,
    coverImageUrl: "",
  },
];

// Episodes from shows the user follows (mock — would be real DB query)
const mockFollowingEpisodes: PodcastEpisode[] = [
  {
    id: "ep-4",
    slug: "typescript-5-5-type-predicates",
    title: "TypeScript 5.5 — Inferred Type Predicates & What They Actually Fix",
    description: "We walk through every notable change in TS 5.5 focusing on inferred type predicates, isolated declarations, and the new performance improvements to the compiler pipeline.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    durationSeconds: 2340,
    publishedAt: "July 21, 2026",
    showTitle: "TypeScript Uncovered",
    showId: "show-2",
    authorName: "Priya Sharma",
    authorUsername: "priya_sharma",
    playsCount: 4200,
    coverImageUrl: "",
  },
];

// ── Helpers ────────────────────────────────────────────────────
function fmt(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function fmtPlays(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

// ── Show Card ──────────────────────────────────────────────────
function ShowCard({ show }: { show: PodcastShow }) {
  const [isFollowing, setIsFollowing] = useState(show.isFollowing);
  const initials = show.title.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const bgColors = ["#2B3D3A", "#2B3038", "#1E2B3A", "#2B2B1E"];
  const bg = bgColors[show.id.charCodeAt(5) % bgColors.length];

  return (
    <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors flex flex-col gap-3 group">
      {/* Cover art */}
      <div
        className="w-full aspect-square rounded-[var(--radius-sm)] flex items-center justify-center text-3xl font-bold text-[var(--ink-muted)] overflow-hidden"
        style={{ backgroundColor: bg }}
      >
        {show.coverImageUrl ? (
          <img src={show.coverImageUrl} alt={show.title} className="w-full h-full object-cover" />
        ) : (
          <span className="font-mono-numbers text-xl opacity-60">{initials}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        {/* Category */}
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#C9954C] mb-1 block">
          {show.category}
        </span>
        <Link href={`/podcasts/show/${show.slug}`}>
          <h3 className="text-xs font-bold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors leading-snug line-clamp-1 mb-1">
            {show.title}
          </h3>
        </Link>
        <p className="text-[11px] text-[var(--ink-muted)] line-clamp-2 leading-relaxed mb-2">
          {show.description}
        </p>
        <div className="text-[10px] font-mono-numbers text-[var(--ink-muted)] flex items-center gap-2 mb-3">
          <span>by @{show.authorUsername}</span>
          <span>·</span>
          <span>{fmtPlays(show.followersCount)} followers</span>
          <span>·</span>
          <span>{show.episodesCount} eps</span>
        </div>
      </div>

      <FollowButton
        targetType="show"
        targetId={show.id}
        initialFollowing={isFollowing}
        size="sm"
        className="w-full justify-center"
      />
    </div>
  );
}

// ── Episode Row ────────────────────────────────────────────────
function EpisodeRow({ ep, featured = false }: { ep: PodcastEpisode; featured?: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={cn(
      "rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-colors",
      "hover:bg-[var(--surface-hover)]"
    )}>
      <div className="p-4 flex gap-3 items-start">
        {/* Mini cover art */}
        <div
          className="w-10 h-10 rounded-[var(--radius-sm)] shrink-0 flex items-center justify-center text-xs font-bold text-[var(--ink-muted)] bg-[var(--surface-high)]"
          style={{ minWidth: 40 }}
        >
          {ep.coverImageUrl ? (
            <img src={ep.coverImageUrl} alt="" className="w-full h-full object-cover rounded-[var(--radius-sm)]" />
          ) : (
            <Mic className="w-4 h-4 opacity-40" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Show badge */}
          <Link
            href={`/podcasts/show/${ep.showId}`}
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#C9954C] mb-1 hover:opacity-80 transition-opacity"
          >
            <Radio className="w-2.5 h-2.5" />
            <span>{ep.showTitle}</span>
          </Link>

          {/* Title */}
          <Link href={`/podcasts/${ep.slug}`}>
            <h3 className="text-xs font-semibold text-[var(--ink)] leading-snug mb-1 hover:text-[var(--accent)] transition-colors line-clamp-2">
              {ep.title}
            </h3>
          </Link>

          {/* Meta */}
          <div className="text-[10px] font-mono-numbers text-[var(--ink-muted)] flex items-center gap-2 flex-wrap mb-2">
            <span>@{ep.authorUsername}</span>
            <span>·</span>
            <span className="flex items-center gap-0.5"><Calendar className="w-2.5 h-2.5" />{ep.publishedAt}</span>
            <span>·</span>
            <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{fmt(ep.durationSeconds)}</span>
            <span>·</span>
            <span className="flex items-center gap-0.5"><Play className="w-2.5 h-2.5 fill-current" />{fmtPlays(ep.playsCount)} plays</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-medium bg-[var(--accent)] text-[var(--bg)] rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Play className="w-2.5 h-2.5 fill-current" />
              {expanded ? "Close player" : "Play episode"}
            </button>
            <BookmarkButton targetType="podcast" targetId={ep.id} />
            <Link
              href={`/podcasts/${ep.slug}`}
              className="text-[10px] text-[var(--ink-muted)] hover:text-[var(--accent)] transition-colors"
            >
              Show notes →
            </Link>
          </div>
        </div>
      </div>

      {/* Inline Audio Player */}
      {expanded && (
        <div className="border-t border-[var(--border)] px-4 pb-4 pt-3">
          <AudioPlayer
            title={ep.title}
            audioUrl={ep.audioUrl}
            durationSeconds={ep.durationSeconds}
          />
        </div>
      )}
    </div>
  );
}

// ── Section Header ─────────────────────────────────────────────
function SectionHeader({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="text-[var(--accent)]">{icon}</div>
        <div>
          <h2 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider">{title}</h2>
          {subtitle && <p className="text-[11px] text-[var(--ink-muted)] mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
type Tab = "discover" | "following" | "shows";

export default function PodcastsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("discover");
  const [shows, setShows] = useState(mockShows);

  const followingEpisodes = mockFollowingEpisodes;
  const hasFollowing = followingEpisodes.length > 0;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "discover", label: "Discover", icon: <Flame className="w-3 h-3" /> },
    { id: "following", label: "Following", icon: <Users className="w-3 h-3" /> },
    { id: "shows", label: "All Shows", icon: <Radio className="w-3 h-3" /> },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[var(--accent)] mb-1">
            <Headphones className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-widest">FutureTech Podcasts</span>
          </div>
          <h1 className="text-lg font-bold text-[var(--ink)] tracking-tight">Developer Audio</h1>
          <p className="text-xs text-[var(--ink-muted)] mt-0.5">
            Technical deep-dives, architecture breakdowns, and career insights — created by the community.
          </p>
        </div>

        <Link
          href="/new/podcast"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--accent)] text-[var(--bg)] text-xs font-semibold rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Start a Show
        </Link>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[var(--radius-sm)] transition-colors cursor-pointer",
              activeTab === t.id
                ? "bg-[var(--surface-high)] text-[var(--ink)]"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)]"
            )}
          >
            {t.icon}
            {t.label}
            {t.id === "following" && hasFollowing && (
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
            )}
          </button>
        ))}
      </div>

      {/* ── TAB: DISCOVER ── */}
      {activeTab === "discover" && (
        <div className="space-y-8">
          {/* Featured Player */}
          <div>
            <SectionHeader
              icon={<TrendingUp className="w-4 h-4" />}
              title="Trending this week"
              subtitle={`${fmtPlays(mockTrendingEpisodes[0].playsCount)} plays this week`}
            />
            <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-[var(--radius-sm)] bg-[var(--surface-high)] flex items-center justify-center shrink-0">
                  <Mic className="w-5 h-5 text-[var(--ink-muted)] opacity-50" />
                </div>
                <div>
                  <Link href={`/podcasts/show/${mockTrendingEpisodes[0].showId}`}>
                    <span className="text-[10px] font-semibold text-[#C9954C] flex items-center gap-1 mb-1 hover:opacity-80 transition-opacity">
                      <Radio className="w-2.5 h-2.5" />
                      {mockTrendingEpisodes[0].showTitle}
                    </span>
                  </Link>
                  <h3 className="text-sm font-bold text-[var(--ink)] leading-snug mb-1">
                    {mockTrendingEpisodes[0].title}
                  </h3>
                  <p className="text-[11px] text-[var(--ink-muted)] line-clamp-2 leading-relaxed">
                    {mockTrendingEpisodes[0].description}
                  </p>
                </div>
              </div>
              <AudioPlayer
                title={mockTrendingEpisodes[0].title}
                audioUrl={mockTrendingEpisodes[0].audioUrl}
                durationSeconds={mockTrendingEpisodes[0].durationSeconds}
              />
            </div>
          </div>

          {/* More Trending */}
          <div>
            <SectionHeader
              icon={<Flame className="w-4 h-4" />}
              title="More trending episodes"
            />
            <div className="space-y-3">
              {mockTrendingEpisodes.slice(1).map((ep) => (
                <EpisodeRow key={ep.id} ep={ep} />
              ))}
            </div>
          </div>

          {/* Featured Shows */}
          <div>
            <SectionHeader
              icon={<Radio className="w-4 h-4" />}
              title="Popular shows"
              subtitle="Community-created developer podcasts"
              action={
                <button
                  type="button"
                  onClick={() => setActiveTab("shows")}
                  className="text-[11px] text-[var(--accent)] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  View all <ChevronRight className="w-3 h-3" />
                </button>
              }
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {shows.slice(0, 4).map((show) => (
                <ShowCard key={show.id} show={show} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: FOLLOWING ── */}
      {activeTab === "following" && (
        <div className="space-y-4">
          {hasFollowing ? (
            <>
              <SectionHeader
                icon={<Users className="w-4 h-4" />}
                title="New from shows you follow"
                subtitle={`${followingEpisodes.length} new episode${followingEpisodes.length !== 1 ? "s" : ""}`}
              />
              <div className="space-y-3">
                {followingEpisodes.map((ep) => (
                  <EpisodeRow key={ep.id} ep={ep} />
                ))}
              </div>
            </>
          ) : (
            <div className="py-16 text-center border border-dashed border-[var(--border)] rounded-[var(--radius-md)]">
              <Users className="w-8 h-8 mx-auto mb-3 text-[var(--ink-muted)] opacity-50" />
              <p className="text-sm font-semibold text-[var(--ink)] mb-1">No shows followed yet</p>
              <p className="text-xs text-[var(--ink-muted)] mb-4">
                Follow shows to get their new episodes here as soon as they drop.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("shows")}
                className="px-3 py-1.5 text-xs font-medium bg-[var(--accent)] text-[var(--bg)] rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity cursor-pointer"
              >
                Browse shows →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: ALL SHOWS ── */}
      {activeTab === "shows" && (
        <div className="space-y-4">
          <SectionHeader
            icon={<Radio className="w-4 h-4" />}
            title="All shows"
            subtitle={`${shows.length} shows from the community`}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {shows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
