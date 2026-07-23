"use client";

import React, { useState } from "react";
import { createAnswer } from "@/lib/actions/answers";

export function AnswerForm({ questionId, onSuccess }: { questionId: string; onSuccess?: () => void }) {
  const [newAnswerBody, setNewAnswerBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswerBody.trim()) {
      setError("Please write an answer before submitting.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const result = await createAnswer({
      questionId,
      bodyHtml: `<p>${newAnswerBody}</p>`,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
    } else {
      setNewAnswerBody("");
      if (onSuccess) onSuccess();
    }
  };

  return (
    <div className="border-t border-[var(--border)] pt-6">
      <h3 className="text-xs font-medium text-[var(--ink)] mb-2">Your Answer</h3>

      {error && (
        <div className="mb-3 p-2.5 rounded-[var(--radius-sm)] bg-[var(--downvote-soft)] border border-[var(--downvote)] text-[var(--downvote)] text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handlePostAnswer}>
        <textarea
          rows={5}
          value={newAnswerBody}
          onChange={(e) => setNewAnswerBody(e.target.value)}
          placeholder="Write your answer with code examples and clear reasoning..."
          className="w-full p-3 text-xs bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors mb-3"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-[var(--accent)] text-[var(--bg)] font-medium text-xs rounded-[var(--radius-md)] hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "Posting answer..." : "Post Answer"}
        </button>
      </form>
    </div>
  );
}
