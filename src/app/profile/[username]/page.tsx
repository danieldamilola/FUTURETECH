"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VoteControl } from "@/components/ui/vote-control";
import { ContentTag } from "@/components/ui/content-tag";
import { Globe, Award, Calendar, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"articles" | "questions" | "bookmarks">("articles");

  return (
    <div className="w-full space-y-6">
      {/* Profile Header */}
      <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-[var(--surface-high)] text-[var(--accent)] font-bold text-lg flex items-center justify-center font-mono-numbers shrink-0">
            PS
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-base font-medium text-[var(--ink)]">Priya Sharma</h1>
                <div className="text-xs text-[var(--ink-muted)] font-mono-numbers">
                  @priya_sharma
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-mono-numbers font-medium">
                <Award className="w-3.5 h-3.5" />
                <span>1,420 karma</span>
              </div>
            </div>

            <p className="text-xs text-[var(--ink-muted)] mt-2 leading-relaxed">
              Software engineer working on distributed systems, TypeScript, and Rust. Writing about WebAssembly and edge computing.
            </p>

            {/* Links & Join Date */}
            <div className="flex items-center gap-4 mt-3 text-[11px] text-[var(--ink-muted)] flex-wrap font-mono-numbers">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 opacity-70" />
                Joined Jan 2025
              </span>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-[var(--ink)]"
              >
                <Link2 className="w-3 h-3 opacity-70" />
                github.com/priyasharma
              </a>
              <a
                href="https://priyasharma.dev"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-[var(--ink)]"
              >
                <Globe className="w-3 h-3 opacity-70" />
                priyasharma.dev
              </a>
            </div>

            {/* Tech Stack Chips */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {["TypeScript", "React", "Rust", "Node.js", "Postgres"].map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded-[var(--radius-sm)] bg-[var(--surface-high)] text-[var(--ink)] text-[10px] font-mono-numbers"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[var(--border)] pb-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("articles")}
          className={cn(
            "pb-1 transition-colors cursor-pointer",
            activeTab === "articles"
              ? "text-[var(--ink)] font-medium underline underline-offset-8 decoration-2 decoration-[var(--accent)]"
              : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
          )}
        >
          Articles (3)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("questions")}
          className={cn(
            "pb-1 transition-colors cursor-pointer",
            activeTab === "questions"
              ? "text-[var(--ink)] font-medium underline underline-offset-8 decoration-2 decoration-[var(--accent)]"
              : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
          )}
        >
          Questions (1)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("bookmarks")}
          className={cn(
            "pb-1 transition-colors cursor-pointer",
            activeTab === "bookmarks"
              ? "text-[var(--ink)] font-medium underline underline-offset-8 decoration-2 decoration-[var(--accent)]"
              : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
          )}
        >
          Bookmarks (2)
        </button>
      </div>

      {/* Tab Content */}
      <div className="divide-y divide-[var(--border)]">
        {activeTab === "articles" && (
          <div className="py-4 flex gap-4 items-start group">
            <VoteControl initialUpvotes={142} orientation="vertical" />
            <div className="flex-1 min-w-0">
              <ContentTag type="article" label="TYPESCRIPT" />
              <h2 className="text-sm font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors mt-1">
                <Link href="/blog/type-safe-server-actions-zod-react-19">
                  Type-safe server actions with Zod and the new React 19 form APIs
                </Link>
              </h2>
              <p className="text-xs text-[var(--ink-muted)] line-clamp-2 mt-1">
                A practical guide to eliminating runtime validation drift between form schemas and server action handlers.
              </p>
              <div className="text-[11px] text-[var(--ink-muted)] font-mono-numbers mt-2 flex items-center gap-2">
                <span>Published 2 days ago</span>
                <span>·</span>
                <span>24 comments</span>
                <span>·</span>
                <span>8 min read</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "questions" && (
          <div className="py-4 flex gap-4 items-start group">
            <VoteControl initialUpvotes={18} orientation="vertical" />
            <div className="flex-1 min-w-0">
              <ContentTag type="question" label="REACT" />
              <h2 className="text-sm font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors mt-1">
                <Link href="/questions/1">
                  How to properly handle async server action state transitions in React 19 useActionState?
                </Link>
              </h2>
              <div className="text-[11px] text-[var(--ink-muted)] font-mono-numbers mt-2 flex items-center gap-2">
                <span>Asked 1 week ago</span>
                <span>·</span>
                <span>5 answers</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "bookmarks" && (
          <div className="py-4 flex gap-4 items-start group">
            <VoteControl initialUpvotes={203} orientation="vertical" />
            <div className="flex-1 min-w-0">
              <ContentTag type="article" label="EDGE COMPUTING" />
              <h2 className="text-sm font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors mt-1">
                <Link href="/blog/globally-consistent-kv-store-cloudflare-workers">
                  Building a globally consistent KV store on Cloudflare Workers: lessons from production
                </Link>
              </h2>
              <div className="text-[11px] text-[var(--ink-muted)] font-mono-numbers mt-2 flex items-center gap-2">
                <span>Elena Vasquez</span>
                <span>·</span>
                <span>Saved 2 days ago</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
