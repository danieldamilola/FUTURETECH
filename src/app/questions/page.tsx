"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VoteControl } from "@/components/ui/vote-control";
import { ContentTag } from "@/components/ui/content-tag";
import { Plus, CheckCircle2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionItem {
  id: string;
  tagLabel: string;
  title: string;
  excerpt: string;
  author: string;
  timeAgo: string;
  answersCount: number;
  views: number;
  upvotes: number;
  downvotes: number;
  isResolved: boolean;
}

const mockQuestions: QuestionItem[] = [
  {
    id: "1",
    tagLabel: "RUST",
    title: "How do I share state between async tasks without Arc<Mutex<T>> in every call site?",
    excerpt: "I have a Tokio application where 12 tasks all need access to a connection pool. Wrapping in Arc<Mutex<...>> everywhere feels wrong.",
    author: "Dae-Jung Kim",
    timeAgo: "4h ago",
    answersCount: 2,
    views: 312,
    upvotes: 87,
    downvotes: 0,
    isResolved: true,
  },
  {
    id: "2",
    tagLabel: "REACT",
    title: "Why does useEffect run twice in development even with an empty dependency array?",
    excerpt: "I'm running React 19 with StrictMode. My useEffect with [] fires on mount, cleans up, and fires again. What's the right pattern?",
    author: "Marcus Webb",
    timeAgo: "9h ago",
    answersCount: 5,
    views: 540,
    upvotes: 155,
    downvotes: 0,
    isResolved: false,
  },
  {
    id: "3",
    tagLabel: "POSTGRESQL",
    title: "How to index JSONB array elements for fast subset querying in Postgres 16?",
    excerpt: "We store user permission tags inside a jsonb column `permissions: ['read', 'write']`. GIN indexing on the entire jsonb object is slow under high volume.",
    author: "Sarah Jenkins",
    timeAgo: "1d ago",
    answersCount: 3,
    views: 210,
    upvotes: 42,
    downvotes: 0,
    isResolved: true,
  },
];

export default function QuestionsPage() {
  const [filter, setFilter] = useState<"all" | "unresolved" | "resolved">("all");

  const filteredQuestions = mockQuestions.filter((q) => {
    if (filter === "unresolved") return !q.isResolved;
    if (filter === "resolved") return q.isResolved;
    return true;
  });

  return (
    <div className="w-full space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-6 text-xs">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "pb-1 transition-colors cursor-pointer",
              filter === "all"
                ? "text-[var(--ink)] font-medium underline underline-offset-8 decoration-2 decoration-[var(--accent)]"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
            )}
          >
            All Questions
          </button>
          <button
            type="button"
            onClick={() => setFilter("unresolved")}
            className={cn(
              "pb-1 transition-colors cursor-pointer",
              filter === "unresolved"
                ? "text-[var(--ink)] font-medium underline underline-offset-8 decoration-2 decoration-[var(--accent)]"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
            )}
          >
            Unresolved
          </button>
          <button
            type="button"
            onClick={() => setFilter("resolved")}
            className={cn(
              "pb-1 transition-colors cursor-pointer",
              filter === "resolved"
                ? "text-[var(--ink)] font-medium underline underline-offset-8 decoration-2 decoration-[var(--accent)]"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
            )}
          >
            Resolved
          </button>
        </div>

        <Link
          href="/new/question"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--accent)] text-[var(--bg)] font-medium text-xs rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ask Question</span>
        </Link>
      </div>

      {/* Questions List */}
      <div className="divide-y divide-[var(--border)]">
        {filteredQuestions.map((q) => (
          <div key={q.id} className="py-4 flex gap-4 items-start group">
            <VoteControl
              initialUpvotes={q.upvotes}
              initialDownvotes={q.downvotes}
              orientation="vertical"
              className="mt-0.5"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <ContentTag type="question" label={q.tagLabel} />
                {q.isResolved && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono-numbers text-[var(--accent)] uppercase font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>RESOLVED</span>
                  </span>
                )}
              </div>

              <h2 className="text-sm font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors leading-snug mb-1">
                <Link href={`/questions/${q.id}`}>{q.title}</Link>
              </h2>

              <p className="text-xs text-[var(--ink-muted)] line-clamp-2 mb-2 leading-relaxed">
                {q.excerpt}
              </p>

              <div className="text-[11px] text-[var(--ink-muted)] font-mono-numbers flex items-center gap-2">
                <span>{q.author}</span>
                <span>·</span>
                <span>{q.timeAgo}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 opacity-70" />
                  {q.answersCount} answers
                </span>
                <span>·</span>
                <span>{q.views} views</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
