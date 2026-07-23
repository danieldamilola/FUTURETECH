import React from "react";
import Link from "next/link";
import { AudioPlayer } from "@/components/podcasts/audio-player";
import { BookmarkButton } from "@/components/ui/bookmark-button";
import { Headphones, Clock, Calendar } from "lucide-react";

interface PodcastEpisode {
  id: string;
  title: string;
  slug: string;
  description: string;
  audioUrl: string;
  durationSeconds: number;
  publishedAt: string;
  hostName: string;
}

const mockEpisodes: PodcastEpisode[] = [
  {
    id: "1",
    title: "Building High-Throughput Distributed KV Stores with Cloudflare Workers & Durable Objects",
    slug: "kv-stores-cloudflare-durable-objects",
    description: "Elena Vasquez joins us to discuss multi-region key-value consistency, state replication, and avoiding deadlock pitfalls in serverless edge runtimes.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    durationSeconds: 2820,
    publishedAt: "July 22, 2026",
    hostName: "Marcus Webb",
  },
  {
    id: "2",
    title: "Rust Memory Safety & Concurrency without Arc<Mutex<T>> Deadlocks",
    slug: "rust-memory-safety-concurrency",
    description: "Dae-Jung Kim breaks down channel-based message passing, lock-free lock ordering, and asynchronous execution patterns in high-concurrency systems.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    durationSeconds: 1980,
    publishedAt: "July 18, 2026",
    hostName: "Priya Sharma",
  },
  {
    id: "3",
    title: "The Context Window Wars: Scaling LLM Attention Beyond 1M Tokens",
    slug: "context-window-wars-llm-attention",
    description: "DeepMind and Anthropic researchers talk memory-efficient attention mechanisms, RAG vs long-context tradeoffs, and future AI developer tools.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    durationSeconds: 3120,
    publishedAt: "July 12, 2026",
    hostName: "FutureTech Editorial",
  },
];

export default function PodcastsPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-[var(--radius-lg)] bg-[#16191E] border border-[var(--border-strong)] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent)] mb-1">
            <Headphones className="w-4 h-4" />
            <span>Developer Audio</span>
          </div>
          <h1 className="text-xl font-bold text-[var(--ink)] tracking-tight">
            FutureTech Podcasts
          </h1>
          <p className="text-xs text-[var(--ink-muted)] mt-1">
            Deep-dive technical interviews, system architecture breakdowns, and career insights.
          </p>
        </div>
      </div>

      {/* Featured Latest Episode Player */}
      <div>
        <h2 className="text-xs font-semibold tracking-wider text-[var(--ink-muted)] uppercase mb-3">
          Featured Episode
        </h2>
        <AudioPlayer
          title={mockEpisodes[0].title}
          audioUrl={mockEpisodes[0].audioUrl}
          durationSeconds={mockEpisodes[0].durationSeconds}
        />
      </div>

      {/* Episodes List */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold tracking-wider text-[var(--ink-muted)] uppercase">
          All Episodes
        </h2>

        {mockEpisodes.map((ep) => (
          <article
            key={ep.id}
            className="p-4 rounded-[var(--radius-md)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] transition-colors space-y-2.5"
          >
            <div className="flex items-center justify-between text-[11px] text-[var(--ink-muted)] font-mono-numbers">
              <span className="flex items-center gap-1.5 text-[var(--accent)] font-semibold">
                Hosted by {ep.hostName}
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {ep.publishedAt}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {String(Math.floor(ep.durationSeconds / 60)).padStart(2, "0")}:{String(ep.durationSeconds % 60).padStart(2, "0")}
                </span>
              </div>
            </div>

            <Link href={`/podcasts/${ep.slug}`} className="block">
              <h3 className="text-sm font-bold text-[var(--ink)] hover:text-[var(--accent)] transition-colors">
                {ep.title}
              </h3>
            </Link>

            <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
              {ep.description}
            </p>

            <div className="pt-2 flex items-center justify-between border-t border-[var(--border)]">
              <Link
                href={`/podcasts/${ep.slug}`}
                className="text-xs text-[var(--accent)] hover:underline font-medium flex items-center gap-1"
              >
                Listen to Episode & Show Notes →
              </Link>
              <BookmarkButton targetType="podcast" targetId={ep.id} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
