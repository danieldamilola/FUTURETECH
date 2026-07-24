"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Editor as TiptapEditor } from "@/components/ui/editor";
import { HashtagInput } from "@/components/ui/hashtag-input";
import { ArrowLeft, Save, Send, Image as ImageIcon, Sparkles, CheckCircle2 } from "lucide-react";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [tags, setTags] = useState<string[]>(["TypeScript", "React"]);
  const [contentHtml, setContentHtml] = useState("<p>Start writing your technical article here...</p>");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handlePublish = async (status: "published" | "draft") => {
    if (!title.trim()) {
      alert("Please enter a title for your article.");
      return;
    }

    setIsSubmitting(true);
    // Simulate server action publish
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(status === "published" ? "Article published successfully!" : "Draft saved!");
      setTimeout(() => setSuccessMessage(null), 3000);
    }, 600);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <Link
          href="/feed"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to feed</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handlePublish("draft")}
            className="px-3 py-1.5 bg-[var(--bg)] border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--ink)] text-xs font-medium rounded-[var(--radius-sm)] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-[var(--ink-muted)]" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handlePublish("published")}
            className="px-3 py-1.5 bg-[var(--accent)] text-[var(--bg)] font-medium text-xs rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Publishing..." : "Publish Article"}</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 rounded-[var(--radius-sm)] bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Post Form Fields */}
      <form className="space-y-4 text-xs">
        <div>
          <label className="block text-[var(--ink-muted)] mb-1 font-medium">
            Article Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Type-safe server actions with Zod"
            className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent)] text-sm"
          />
        </div>

        <div>
          <label className="block text-[var(--ink-muted)] mb-1 font-medium">
            Short Summary / Excerpt
          </label>
          <textarea
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief deck summarizing the technical takeaways..."
            className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent)] text-xs resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[var(--ink-muted)] mb-1 font-medium">
              Cover Image URL (Optional)
            </label>
            <input
              type="url"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent)] text-xs"
            />
          </div>

          <HashtagInput tags={tags} onChange={setTags} />
        </div>
      </form>

      {/* Editor Container */}
      <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--ink-muted)] mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Article Content Editor</span>
        </div>
        <TiptapEditor
          content={contentHtml}
          onChange={(html: string, json: object) => setContentHtml(html)}
        />
      </div>
    </div>
  );
}
