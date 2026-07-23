"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VoteControl } from "@/components/ui/vote-control";
import { ContentTag, ContentType } from "@/components/ui/content-tag";
import { Bookmark, Trash2 } from "lucide-react";

interface BookmarkItem {
  id: string;
  type: ContentType;
  tagLabel: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  savedAt: string;
  upvotes: number;
}

const mockBookmarks: BookmarkItem[] = [
  {
    id: "b1",
    type: "article",
    tagLabel: "TYPESCRIPT",
    title: "Type-safe server actions with Zod and the new React 19 form APIs",
    slug: "type-safe-server-actions-zod-react-19",
    excerpt: "A practical guide to eliminating runtime validation drift between your form schemas and server action handlers.",
    author: "Priya Sharma",
    savedAt: "Saved 2 days ago",
    upvotes: 142,
  },
  {
    id: "b2",
    type: "podcast",
    tagLabel: "AI/ML",
    title: "The context window wars: why longer isn't always better",
    slug: "context-window-wars-why-longer-isnt-always-better",
    excerpt: "We talk to researchers from Anthropic and DeepMind about the real tradeoffs in extending context windows beyond 100k tokens.",
    author: "FutureTech Podcast",
    savedAt: "Saved 4 days ago",
    upvotes: 89,
  },
];

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(mockBookmarks);

  const handleRemove = (id: string) => {
    setBookmarks(bookmarks.filter((b) => b.id !== id));
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <h1 className="text-sm font-medium text-[var(--ink)]">Saved Bookmarks</h1>
        <span className="font-mono-numbers text-xs text-[var(--ink-muted)]">
          {bookmarks.length} items
        </span>
      </div>

      {bookmarks.length === 0 ? (
        <div className="py-12 text-center text-xs text-[var(--ink-muted)] border border-dashed border-[var(--border)] rounded-[var(--radius-md)]">
          <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-50 text-[var(--ink-muted)]" />
          <p className="mb-3">No bookmarks saved yet.</p>
          <Link href="/feed" className="text-[var(--accent)] hover:underline">
            Explore articles & podcasts →
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {bookmarks.map((item) => (
            <div key={item.id} className="py-4 flex gap-4 items-start group">
              <VoteControl
                initialUpvotes={item.upvotes}
                orientation="vertical"
                className="mt-0.5"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <ContentTag type={item.type} label={item.tagLabel} />
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    aria-label="Remove bookmark"
                    className="text-[var(--ink-muted)] hover:text-[var(--danger)] transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h2 className="text-sm font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors leading-snug mb-1">
                  <Link href={item.type === "question" ? `/questions/${item.id}` : `/articles/${item.slug}`}>{item.title}</Link>
                </h2>

                <p className="text-xs text-[var(--ink-muted)] line-clamp-2 mb-2 leading-relaxed">
                  {item.excerpt}
                </p>

                <div className="text-[11px] text-[var(--ink-muted)] font-mono-numbers flex items-center gap-2">
                  <span>{item.author}</span>
                  <span>·</span>
                  <span>{item.savedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
