"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookmarkButton } from "@/components/ui/bookmark-button";
import { VoteControl } from "@/components/ui/vote-control";
import { ArrowLeft, Share2, MessageSquare } from "lucide-react";

export default function ArticleDetailPage() {
  const [readingTheme, setReadingTheme] = useState<"light" | "dark">("light");

  return (
    <div
      className="w-full min-h-screen transition-colors duration-200"
      data-reading-theme={readingTheme === "dark" ? "dark" : undefined}
      style={{
        backgroundColor: readingTheme === "dark" ? "#1B1815" : "#F6F1E8",
        color: readingTheme === "dark" ? "#E6E1D8" : "#211E19",
      }}
    >
      {/* Top Bar — Back + Theme Toggle */}
      <div
        className="flex items-center justify-between px-6 py-3 border-b"
        style={{ borderColor: readingTheme === "dark" ? "rgba(230,225,216,0.12)" : "rgba(33,30,25,0.10)" }}
      >
        <Link
          href="/feed"
          className="inline-flex items-center gap-1.5 text-xs transition-colors"
          style={{ color: readingTheme === "dark" ? "#9E968B" : "#6B6459" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to feed</span>
        </Link>

        {/* Paper / Dark reading toggle */}
        <div className="flex items-center gap-1 text-[11px]" style={{ color: readingTheme === "dark" ? "#9E968B" : "#6B6459" }}>
          <button
            type="button"
            onClick={() => setReadingTheme("light")}
            className={`px-2.5 py-1 rounded-[3px] cursor-pointer transition-colors ${readingTheme === "light" ? "font-semibold bg-[#211E19]/10" : "hover:bg-[#211E19]/5"}`}
          >
            Paper
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => setReadingTheme("dark")}
            className={`px-2.5 py-1 rounded-[3px] cursor-pointer transition-colors ${readingTheme === "dark" ? "font-semibold bg-white/10" : "hover:bg-[#211E19]/5"}`}
          >
            Night
          </button>
        </div>
      </div>

      {/* Article Column — max-width 700px per DESIGN.md §5 */}
      <article className="mx-auto px-6 py-10 max-w-[700px]">

        {/* Hashtag / Category */}
        <div className="flex items-center gap-1.5 mb-4">
          <span
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "#A24B25" }}
          >
            TypeScript
          </span>
        </div>

        {/* Title — Fraunces per DESIGN.md §5 */}
        <h1
          className="font-bold leading-tight mb-4"
          style={{
            fontFamily: "var(--font-display, 'Fraunces', Georgia, serif)",
            fontSize: "clamp(28px, 5vw, 40px)",
            color: readingTheme === "dark" ? "#E6E1D8" : "#211E19",
          }}
        >
          Type-safe server actions with Zod and the new React 19 form APIs
        </h1>

        {/* Deck */}
        <p
          className="text-lg leading-relaxed mb-5"
          style={{
            fontFamily: "var(--font-ui, system-ui, sans-serif)",
            fontSize: "18px",
            lineHeight: "1.7",
            color: readingTheme === "dark" ? "#9E968B" : "#6B6459",
          }}
        >
          A practical guide to eliminating runtime validation drift between your form schemas and server action handlers — the same validator, used twice.
        </p>

        {/* Metadata + Actions Line */}
        <div
          className="flex items-center flex-wrap gap-3 py-3 border-y text-[11px] font-mono-numbers mb-8"
          style={{
            borderColor: readingTheme === "dark" ? "rgba(230,225,216,0.12)" : "rgba(33,30,25,0.10)",
            color: readingTheme === "dark" ? "#9E968B" : "#6B6459",
          }}
        >
          <span className="font-semibold" style={{ color: readingTheme === "dark" ? "#E6E1D8" : "#211E19" }}>
            Priya Sharma
          </span>
          <span>·</span>
          <span>Jan 23, 2026</span>
          <span>·</span>
          <span>8 min read</span>
          <span>·</span>
          <span>142 upvotes</span>

          <span className="ml-auto flex items-center gap-2">
            <VoteControl
              initialUpvotes={142}
              initialDownvotes={0}
              orientation="inline"
            />
            <BookmarkButton targetType="article" targetId="type-safe-server-actions" />
            <button
              type="button"
              aria-label="Share article"
              className="p-1 cursor-pointer transition-colors"
              style={{ color: readingTheme === "dark" ? "#9E968B" : "#6B6459" }}
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              aria-label="Jump to comments"
              className="p-1 cursor-pointer transition-colors flex items-center gap-1"
              style={{ color: readingTheme === "dark" ? "#9E968B" : "#6B6459" }}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>24</span>
            </button>
          </span>
        </div>

        {/* Article Body — Switzer at 17px / 1.7 per DESIGN.md §5 */}
        <div
          className="space-y-5 max-w-none"
          style={{
            fontFamily: "var(--font-ui, system-ui, sans-serif)",
            fontSize: "17px",
            lineHeight: "1.7",
            color: readingTheme === "dark" ? "#E6E1D8" : "#211E19",
          }}
        >
          <p>
            When building modern Next.js applications, server actions provide a seamless bridge between user interactions and server-side business logic. However, without strict validation contracts, client form inputs can easily drift from backend runtime expectations.
          </p>

          <h2
            className="font-bold mt-6 mb-2"
            style={{
              fontFamily: "var(--font-display, 'Fraunces', Georgia, serif)",
              fontSize: "22px",
              color: readingTheme === "dark" ? "#E6E1D8" : "#211E19",
            }}
          >
            1. Defining the Single Source of Truth
          </h2>

          <p>
            By defining a single Zod validation schema shared across both client-side form hooks (<code className="text-sm font-mono-numbers px-1.5 py-0.5 rounded" style={{ backgroundColor: readingTheme === "dark" ? "#24201C" : "#FFFFFF", border: "1px solid", borderColor: readingTheme === "dark" ? "rgba(230,225,216,0.12)" : "rgba(33,30,25,0.10)" }}>react-hook-form</code>) and Next.js Server Actions, you ensure that every payload is validated before execution.
          </p>

          <pre
            className="p-4 rounded-[6px] overflow-x-auto text-sm font-mono"
            style={{
              backgroundColor: readingTheme === "dark" ? "#24201C" : "#FFFFFF",
              border: "1px solid",
              borderColor: readingTheme === "dark" ? "rgba(230,225,216,0.12)" : "rgba(33,30,25,0.10)",
              color: readingTheme === "dark" ? "#E6E1D8" : "#211E19",
            }}
          >
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

          <blockquote
            className="border-l-2 pl-4 italic my-4"
            style={{
              borderColor: "#A24B25",
              color: readingTheme === "dark" ? "#9E968B" : "#6B6459",
            }}
          >
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
