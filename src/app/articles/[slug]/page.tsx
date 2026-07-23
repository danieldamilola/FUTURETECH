"use client";

import React from "react";
import Link from "next/link";
import { VoteControl } from "@/components/ui/vote-control";
import { ArrowLeft, Bookmark, Share2 } from "lucide-react";

export default function ArticleDetailPage() {
  return (
    <div className="w-full space-y-6">
      {/* Back Link */}
      <div>
        <Link
          href="/feed"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to feed</span>
        </Link>
      </div>

      {/* Article Container (Rich Dark Slate Surface — no white flashbang) */}
      <article className="p-6 md:p-8 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] space-y-6">
        {/* Article Title */}
        <h1
          className="text-2xl md:text-3xl font-serif leading-tight font-normal text-[var(--ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Type-safe server actions with Zod and the new React 19 form APIs
        </h1>

        {/* Deck / Excerpt */}
        <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
          A practical guide to eliminating runtime validation drift between your form schemas and server action handlers — the same validator, used twice.
        </p>

        {/* Metadata & Inline Vote Line */}
        <div className="flex items-center justify-between border-y border-[var(--border)] py-2.5 text-xs text-[var(--ink-muted)] font-mono-numbers">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--ink)]">Priya Sharma</span>
            <span>·</span>
            <span>Jan 23, 2026</span>
            <span>·</span>
            <span>8 min read</span>
          </div>

          <div className="flex items-center gap-4">
            <VoteControl
              initialUpvotes={142}
              initialDownvotes={0}
              orientation="inline"
            />
            <button
              type="button"
              className="hover:text-[var(--ink)] transition-colors p-1 cursor-pointer"
              aria-label="Bookmark article"
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="hover:text-[var(--ink)] transition-colors p-1 cursor-pointer"
              aria-label="Share article"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Article Body */}
        <div className="prose max-w-none text-xs leading-relaxed text-[var(--ink)] space-y-4">
          <p>
            When building modern Next.js applications, server actions provide a seamless bridge between user interactions and server-side business logic. However, without strict validation contracts, client form inputs can easily drift from backend runtime expectations.
          </p>

          <h2
            className="text-lg font-serif text-[var(--ink)] pt-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            1. Defining the Single Source of Truth
          </h2>

          <p>
            By defining a single Zod validation schema shared across both client-side form hooks (<code>react-hook-form</code>) and Next.js Server Actions, you ensure that every payload is validated before execution.
          </p>

          <pre className="p-4 rounded-[var(--radius-sm)] bg-[var(--bg)] text-[var(--ink)] overflow-x-auto text-xs font-mono border border-[var(--border)]">
            <code>{`import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  tags: z.array(z.string()).max(5),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;`}</code>
          </pre>

          <p>
            This schema serves as both the runtime validator inside your server action and the compile-time type constraint for your React components.
          </p>

          <blockquote className="border-l-2 border-[var(--accent)] pl-4 italic text-[var(--ink-muted)] my-4">
            &ldquo;Validation logic should live where data originates, but contract enforcement must happen where data executes.&rdquo;
          </blockquote>

          <p>
            In the next section, we will look at how to hook this directly into React 19&apos;s new form state APIs with zero client JavaScript overhead.
          </p>
        </div>
      </article>
    </div>
  );
}
