"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VoteControl } from "@/components/ui/vote-control";
import { ContentTag, ContentType } from "@/components/ui/content-tag";
import { BookmarkButton } from "@/components/ui/bookmark-button";
import { cn } from "@/lib/utils";
import { Share2 } from "lucide-react";

interface FeedItem {
  id: string;
  type: ContentType;
  tagLabel: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  timeAgo: string;
  commentsCount: number;
  readTimeMins: number;
  upvotes: number;
  downvotes: number;
  userVote?: number;
}

const mockFeedItems: FeedItem[] = [
  {
    id: "1",
    type: "article",
    tagLabel: "TYPESCRIPT",
    title: "Type-safe server actions with Zod and the new React 19 form APIs",
    slug: "type-safe-server-actions-zod-react-19",
    excerpt: "A practical guide to eliminating runtime validation drift between your form schemas and server action handlers — the same validator, used twice.",
    author: "Priya Sharma",
    timeAgo: "2h ago",
    commentsCount: 24,
    readTimeMins: 8,
    upvotes: 142,
    downvotes: 0,
  },
  {
    id: "2",
    type: "question",
    tagLabel: "RUST",
    title: "How do I share state between async tasks without Arc<Mutex<T>> in every call site?",
    slug: "share-state-between-async-tasks-rust",
    excerpt: "I have a Tokio application where 12 tasks all need access to a connection pool. Wrapping in Arc<Mutex<...>> everywhere feels wrong and I keep hitting deadlocks.",
    author: "Dae-Jung Kim",
    timeAgo: "4h ago",
    commentsCount: 18,
    readTimeMins: 5,
    upvotes: 87,
    downvotes: 0,
  },
  {
    id: "3",
    type: "article",
    tagLabel: "EDGE COMPUTING",
    title: "Building a globally consistent KV store on Cloudflare Workers: lessons from production",
    slug: "globally-consistent-kv-store-cloudflare-workers",
    excerpt: "Six months of running a multi-region key-value store on the edge. What Durable Objects actually do well, what they don't, and when you need a real database anyway.",
    author: "Elena Vasquez",
    timeAgo: "6h ago",
    commentsCount: 41,
    readTimeMins: 14,
    upvotes: 203,
    downvotes: 0,
  },
  {
    id: "4",
    type: "question",
    tagLabel: "REACT",
    title: "Why does useEffect run twice in development even with an empty dependency array?",
    slug: "why-useeffect-runs-twice-in-development",
    excerpt: "I'm running React 19 with StrictMode. My useEffect with [] fires on mount, cleans up, and fires again. The docs say this is intentional — but what's actually the right pattern?",
    author: "Marcus Webb",
    timeAgo: "9h ago",
    commentsCount: 32,
    readTimeMins: 4,
    upvotes: 155,
    downvotes: 0,
  },
  {
    id: "5",
    type: "podcast",
    tagLabel: "AI/ML",
    title: "The context window wars: why longer isn't always better",
    slug: "context-window-wars-why-longer-isnt-always-better",
    excerpt: "We talk to researchers from Anthropic and DeepMind about the real tradeoffs in extending context windows beyond 100k tokens and what 'attention' actually costs.",
    author: "FutureTech Podcast",
    timeAgo: "1d ago",
    commentsCount: 9,
    readTimeMins: 47,
    upvotes: 89,
    downvotes: 0,
  },
];

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<"for-you" | "trending" | "recent">("for-you");

  return (
    <div className="w-full">
      {/* Feed Sort Tabs */}
      <div className="flex items-center gap-6 border-b border-[var(--border)] pb-3 mb-4 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("for-you")}
          className={cn(
            "pb-1 transition-colors cursor-pointer",
            activeTab === "for-you"
              ? "text-[var(--ink)] font-medium underline underline-offset-8 decoration-2 decoration-[var(--accent)]"
              : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
          )}
        >
          For You
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("trending")}
          className={cn(
            "pb-1 transition-colors cursor-pointer",
            activeTab === "trending"
              ? "text-[var(--ink)] font-medium underline underline-offset-8 decoration-2 decoration-[var(--accent)]"
              : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
          )}
        >
          Trending
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("recent")}
          className={cn(
            "pb-1 transition-colors cursor-pointer",
            activeTab === "recent"
              ? "text-[var(--ink)] font-medium underline underline-offset-8 decoration-2 decoration-[var(--accent)]"
              : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
          )}
        >
          Recent
        </button>
      </div>

      {/* Feed List Rows */}
      <div className="divide-y divide-[var(--border)]">
        {mockFeedItems.map((item) => (
          <div key={item.id} className="py-4 flex gap-4 items-start group">
            {/* Vote Rail */}
            <VoteControl
              initialUpvotes={item.upvotes}
              initialDownvotes={item.downvotes}
              userVote={item.userVote}
              orientation="vertical"
              className="mt-0.5"
            />

            {/* Row Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <ContentTag type={item.type} label={item.tagLabel} />
              </div>

              <h2 className="text-sm font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors leading-snug mb-1">
                <Link href={item.type === "question" ? `/questions/${item.id}` : `/articles/${item.slug}`}>
                  {item.title}
                </Link>
              </h2>

              <p className="text-xs text-[var(--ink-muted)] line-clamp-2 mb-2 leading-relaxed">
                {item.excerpt}
              </p>

              {/* Mono Metadata Line */}
              <div className="text-[11px] text-[var(--ink-muted)] font-mono-numbers flex items-center gap-2 flex-wrap">
                <span>{item.author}</span>
                <span>·</span>
                <span>{item.timeAgo}</span>
                <span>·</span>
                <span>{item.commentsCount} comments</span>
                <span>·</span>
                <span>{item.readTimeMins} min read</span>
                <span className="ml-auto flex items-center gap-1">
                  <BookmarkButton targetType={item.type === "question" ? "question" : item.type === "podcast" ? "podcast" : "article"} targetId={item.id} />
                  <button type="button" aria-label="Share" className="p-1 text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors cursor-pointer">
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
