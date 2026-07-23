"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Editor } from "@/components/ui/editor";
import { HashtagInput } from "@/components/ui/hashtag-input";
import { createQuestion } from "@/lib/actions/questions";
import { ArrowLeft, HelpCircle } from "lucide-react";

export default function NewQuestionPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [bodyJson, setBodyJson] = useState<object>({});
  const [tags, setTags] = useState<string[]>(["Rust"]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a question title.");
      return;
    }
    if (!bodyHtml.trim() || bodyHtml === "<p></p>") {
      setError("Please explain your question in detail.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const result = await createQuestion({
      title,
      bodyHtml,
      bodyJson,
      tags,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
    } else {
      router.push(`/questions/${result.data.id}`);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <Link
          href="/questions"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to questions</span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--ink)]">
          <HelpCircle className="w-4 h-4 text-[var(--accent)]" />
          <span>Ask a Question</span>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--downvote-soft)] border border-[var(--downvote)] text-[var(--downvote)] text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-[var(--ink-muted)] mb-1 font-medium">
            Question Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. How do I share state between async tasks in Tokio?"
            className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent)] text-sm"
          />
        </div>

        <HashtagInput tags={tags} onChange={setTags} />

        <div>
          <label className="block text-[var(--ink-muted)] mb-1 font-medium">
            Details & Code Snippets
          </label>
          <Editor
            placeholder="Describe what you're trying to do, what happened, and include minimal reproducible code..."
            onChange={(html, json) => {
              setBodyHtml(html);
              setBodyJson(json);
            }}
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-[var(--accent)] text-[var(--bg)] font-medium rounded-[var(--radius-md)] hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer text-xs"
          >
            {isSubmitting ? "Posting question..." : "Post Question"}
          </button>
        </div>
      </form>
    </div>
  );
}
