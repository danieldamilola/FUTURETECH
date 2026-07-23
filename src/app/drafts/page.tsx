"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileEdit, Trash2 } from "lucide-react";

interface DraftItem {
  id: string;
  title: string;
  updatedAt: string;
  wordCount: number;
}

const mockDrafts: DraftItem[] = [
  {
    id: "1",
    title: "Understanding memory layout in WebAssembly vs native C++",
    updatedAt: "2 hours ago",
    wordCount: 420,
  },
  {
    id: "2",
    title: "Micro-frontends in 2026: when Module Federation makes sense",
    updatedAt: "3 days ago",
    wordCount: 890,
  },
];

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<DraftItem[]>(mockDrafts);

  const handleDelete = (id: string) => {
    setDrafts(drafts.filter((d) => d.id !== id));
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <h1 className="text-sm font-medium text-[var(--ink)]">Your Drafts</h1>
        <span className="font-mono-numbers text-xs text-[var(--ink-muted)]">
          {drafts.length} saved
        </span>
      </div>

      {drafts.length === 0 ? (
        <div className="py-12 text-center text-xs text-[var(--ink-muted)] border border-dashed border-[var(--border)] rounded-[var(--radius-md)]">
          <FileEdit className="w-8 h-8 mx-auto mb-2 opacity-50 text-[var(--ink-muted)]" />
          <p className="mb-3">You don&apos;t have any saved drafts.</p>
          <Link
            href="/new/post"
            className="inline-block px-3 py-1.5 bg-[var(--accent)] text-[var(--bg)] font-medium rounded-[var(--radius-sm)]"
          >
            Create a post
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {drafts.map((draft) => (
            <div key={draft.id} className="py-3 flex items-center justify-between group">
              <div>
                <h2 className="text-xs font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                  <Link href="/new/post">{draft.title}</Link>
                </h2>
                <div className="text-[11px] text-[var(--ink-muted)] font-mono-numbers mt-1 flex items-center gap-2">
                  <span>Last edited {draft.updatedAt}</span>
                  <span>·</span>
                  <span>{draft.wordCount} words</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/new/post"
                  className="text-xs text-[var(--accent)] hover:underline font-medium"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(draft.id)}
                  aria-label="Delete draft"
                  className="text-[var(--ink-muted)] hover:text-[var(--danger)] transition-colors p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
