"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Compass, Hash } from "lucide-react";

interface TagInfo {
  name: string;
  count: number;
  description: string;
}

const tagsList: TagInfo[] = [
  { name: "TypeScript", count: 412, description: "Typed JavaScript at any scale." },
  { name: "React", count: 389, description: "The library for web and native user interfaces." },
  { name: "AI/ML", count: 301, description: "Artificial intelligence, machine learning, and LLM engineering." },
  { name: "Rust", count: 244, description: "A language empowering everyone to build reliable and efficient software." },
  { name: "WebAssembly", count: 212, description: "High-performance code execution in modern web browsers." },
  { name: "Edge Computing", count: 184, description: "Running application logic close to the end user." },
  { name: "PostgreSQL", count: 167, description: "The world's most advanced open-source relational database." },
  { name: "Next.js", count: 155, description: "The React framework for the web." },
];

export default function ExplorePage() {
  const [filter, setFilter] = useState("");

  const filteredTags = tagsList.filter((t) =>
    t.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[var(--accent)]" />
          <h1 className="text-sm font-medium text-[var(--ink)]">Explore Topics</h1>
        </div>
        <span className="font-mono-numbers text-xs text-[var(--ink-muted)]">
          {tagsList.length} topics
        </span>
      </div>

      <div>
        <input
          type="search"
          placeholder="Filter topics..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-sm px-3 py-1.5 text-xs bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent)]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredTags.map((tag) => (
          <Link
            key={tag.name}
            href={`/feed?tag=${tag.name}`}
            className="p-3 rounded-[var(--radius-sm)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] transition-colors block group"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="font-medium text-xs text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors flex items-center gap-1">
                <Hash className="w-3 h-3 text-[var(--accent)]" />
                <span>{tag.name}</span>
              </div>
              <span className="font-mono-numbers text-[11px] text-[var(--ink-muted)]">
                {tag.count} posts
              </span>
            </div>
            <p className="text-[11px] text-[var(--ink-muted)] line-clamp-2">
              {tag.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
