"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Editor } from "@/components/ui/editor";
import { createArticle } from "@/lib/actions/articles";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [contentJson, setContentJson] = useState<object>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (status: "draft" | "published") => {
    if (!title.trim()) {
      setError("Please enter an article title.");
      return;
    }
    if (!contentHtml.trim() || contentHtml === "<p></p>") {
      setError("Please write article content before publishing.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const result = await createArticle({
      title,
      excerpt,
      contentHtml,
      contentJson,
      status,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
    } else {
      if (status === "published") {
        router.push(`/blog/${result.data.slug}`);
      } else {
        router.push("/drafts");
      }
    }
  };

  return (
    <div className="max-w-[820px] mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <Link
          href="/feed"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Cancel</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSave("draft")}
            className="px-3 py-1.5 text-xs text-[var(--ink)] hover:bg-[var(--surface-hover)] border border-[var(--border)] rounded-[var(--radius-sm)] transition-colors disabled:opacity-50 cursor-pointer"
          >
            Save Draft
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSave("published")}
            className="px-4 py-1.5 text-xs bg-[var(--accent)] text-[var(--bg)] font-medium rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            Publish Article
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--downvote-soft)] border border-[var(--downvote)] text-[var(--downvote)] text-xs">
          {error}
        </div>
      )}

      {/* Title Input */}
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article Title..."
          className="w-full text-2xl font-medium bg-transparent border-none text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none"
        />
      </div>

      {/* Excerpt Input */}
      <div>
        <input
          type="text"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Subtitle or short excerpt (optional)..."
          className="w-full text-xs bg-transparent border-b border-[var(--border)] pb-2 text-[var(--ink-muted)] placeholder-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>

      {/* Tiptap Rich Text Editor */}
      <Editor
        onChange={(html, json) => {
          setContentHtml(html);
          setContentJson(json);
        }}
      />
    </div>
  );
}
