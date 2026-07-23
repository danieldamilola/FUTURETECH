"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { VoteControl } from "@/components/ui/vote-control";
import { ContentTag } from "@/components/ui/content-tag";
import { BookmarkButton } from "@/components/ui/bookmark-button";
import { Plus, CheckCircle2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export default function QuestionsPage() {
  const [filter, setFilter] = useState<"all" | "unresolved" | "resolved">("all");
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestions() {
      setIsLoading(true);
      const supabase = createClient();
      const { data } = await (supabase.from("questions") as any)
        .select("id, title, body_html, upvotes_count, answers_count, views, is_resolved, created_at, author:profiles!author_id(display_name, username, avatar_url)")
        .order("created_at", { ascending: false })
        .limit(30);

      if (data) setQuestions(data);
      setIsLoading(false);
    }
    fetchQuestions();
  }, []);

  const filteredQuestions = questions.filter((q) => {
    if (filter === "unresolved") return !q.is_resolved;
    if (filter === "resolved") return q.is_resolved;
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

      {/* Loading State */}
      {isLoading ? (
        <div className="divide-y divide-[var(--border)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="py-4 flex gap-4 items-start">
              <div className="w-8 h-16 bg-[var(--surface-high)] rounded animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="w-16 h-4 bg-[var(--surface-high)] rounded animate-pulse" />
                <div className="w-3/4 h-5 bg-[var(--surface-high)] rounded animate-pulse" />
                <div className="w-full h-4 bg-[var(--surface-high)] rounded animate-pulse" />
                <div className="w-2/3 h-4 bg-[var(--surface-high)] rounded animate-pulse" />
                <div className="flex gap-2 pt-1">
                  <div className="w-20 h-3 bg-[var(--surface-high)] rounded animate-pulse" />
                  <div className="w-20 h-3 bg-[var(--surface-high)] rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-[var(--border)] rounded-[var(--radius-md)] space-y-2">
          <p className="text-sm font-semibold text-[var(--ink)]">No questions yet. Ask the first one!</p>
          <Link href="/new/question" className="text-xs text-[var(--accent)] hover:underline">Ask Question</Link>
        </div>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {filteredQuestions.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--ink-muted)]">No questions match this filter.</div>
          ) : (
            filteredQuestions.map((q) => (
              <div key={q.id} className="py-4 flex gap-4 items-start group">
                <VoteControl
                  initialUpvotes={q.upvotes_count || 0}
                  initialDownvotes={0}
                  orientation="vertical"
                  className="mt-0.5"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <ContentTag type="question" label="QUESTION" />
                    {q.is_resolved && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono-numbers text-[var(--accent)] uppercase font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>RESOLVED</span>
                      </span>
                    )}
                  </div>

                  <h2 className="text-sm font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors leading-snug mb-1">
                    <Link href={`/questions/${q.id}`}>{q.title}</Link>
                  </h2>

                  <div className="text-[11px] text-[var(--ink-muted)] font-mono-numbers flex items-center gap-2 flex-wrap mt-3">
                    <span>{q.author?.display_name || q.author?.username || "Unknown user"}</span>
                    <span>·</span>
                    <span>{new Date(q.created_at).toLocaleDateString()}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 opacity-70" />
                      {q.answers_count || 0} answers
                    </span>
                    <span>·</span>
                    <span>{q.views || 0} views</span>
                    <span className="ml-auto">
                      <BookmarkButton targetType="question" targetId={q.id} />
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
