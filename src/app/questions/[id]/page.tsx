"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VoteControl } from "@/components/ui/vote-control";
import { ContentTag } from "@/components/ui/content-tag";
import { createAnswer, acceptAnswer } from "@/lib/actions/answers";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

interface AnswerItem {
  id: string;
  author: string;
  timeAgo: string;
  upvotes: number;
  isAccepted: boolean;
  bodyHtml: string;
}

const mockAnswers: AnswerItem[] = [
  {
    id: "ans-1",
    author: "Priya Sharma",
    timeAgo: "5h ago",
    upvotes: 64,
    isAccepted: true,
    bodyHtml: `
      <p>The deadlock is because <code>std::sync::Mutex</code> is not safe to hold across <code>.await</code> points in Tokio task execution. Use <code>tokio::sync::Mutex</code> instead:</p>
      <pre><code>use tokio::sync::Mutex;\n\nlet pool = Arc::new(Mutex::new(Pool::new(config)));\n\ntokio::spawn(async move {\n    let mut lock = pool.lock().await;\n    let conn = lock.acquire().await;\n});</code></pre>
      <p>Alternatively, use a dedicated async connection pool like <code>bb8</code> or <code>deadpool-postgres</code>.</p>
    `,
  },
  {
    id: "ans-2",
    author: "Alex Rivera",
    timeAgo: "2h ago",
    upvotes: 12,
    isAccepted: false,
    bodyHtml: `
      <p>Another option is the actor pattern using <code>tokio::sync::mpsc</code> channels. Instead of sharing a Mutex, spawn a dedicated background task that owns the Pool exclusively and handles incoming message requests over a channel.</p>
    `,
  },
];

export default function QuestionDetailPage() {
  const [answers, setAnswers] = useState<AnswerItem[]>(mockAnswers);
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
      questionId: "1",
      bodyHtml: `<p>${newAnswerBody}</p>`,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
    } else {
      setAnswers([
        ...answers,
        {
          id: result.data.id,
          author: "You",
          timeAgo: "Just now",
          upvotes: 0,
          isAccepted: false,
          bodyHtml: `<p>${newAnswerBody}</p>`,
        },
      ]);
      setNewAnswerBody("");
    }
  };

  const handleToggleAccept = async (answerId: string) => {
    const result = await acceptAnswer("1", answerId);
    if (result.success) {
      setAnswers(
        answers.map((ans) => ({
          ...ans,
          isAccepted: ans.id === answerId ? !ans.isAccepted : false,
        }))
      );
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Back Link */}
      <div>
        <Link
          href="/questions"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to questions</span>
        </Link>
      </div>

      {/* Question Header & Body */}
      <div className="flex gap-4 items-start">
        <VoteControl initialUpvotes={87} initialDownvotes={0} orientation="vertical" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <ContentTag type="question" label="RUST" />
          </div>

          <h1 className="text-xl font-medium text-[var(--ink)] leading-snug mb-3">
            How do I share state between async tasks without Arc&lt;Mutex&lt;T&gt;&gt; in every call site?
          </h1>

          <div className="text-xs text-[var(--ink-muted)] font-mono-numbers mb-4 flex items-center gap-2">
            <span>Asked by Dae-Jung Kim</span>
            <span>·</span>
            <span>4h ago</span>
            <span>·</span>
            <span>312 views</span>
          </div>

          <div className="text-xs leading-relaxed text-[var(--ink)] space-y-4">
            <p>
              I have a Tokio application where 12 different async tasks all need access to a shared connection pool. Right now I am threading Arc&lt;Mutex&lt;Pool&gt;&gt; through every function signature and it feels deeply wrong.
            </p>
            <p>
              The specific problem: I keep hitting deadlocks under load because one task holds the mutex while doing async I/O.
            </p>
            <pre className="p-3 rounded-[var(--radius-sm)] bg-[var(--surface)] text-[var(--ink)] overflow-x-auto text-xs font-mono">
              <code>{`let pool = Arc::new(Mutex::new(Pool::new(config)));

tokio::spawn(async move {
    let conn = pool.lock().unwrap().acquire().await; // deadlock here
});`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Answers Section */}
      <div className="border-t border-[var(--border)] pt-6 space-y-6">
        <h2 className="text-sm font-medium text-[var(--ink)]">{answers.length} Answers</h2>

        {answers.map((ans) => (
          <div
            key={ans.id}
            className={`flex gap-4 items-start p-4 rounded-[var(--radius-md)] bg-[var(--surface)] border transition-colors ${
              ans.isAccepted
                ? "border-l-2 border-l-[var(--accent)] border-[var(--border)]"
                : "border-[var(--border)]"
            }`}
          >
            <VoteControl initialUpvotes={ans.upvotes} orientation="vertical" />

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-mono-numbers text-[var(--ink-muted)]">
                  <span className="font-semibold text-[var(--ink)]">{ans.author}</span>
                  <span>{ans.timeAgo}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleAccept(ans.id)}
                  className={`inline-flex items-center gap-1 text-[11px] font-mono-numbers cursor-pointer transition-colors ${
                    ans.isAccepted
                      ? "text-[var(--accent)] font-semibold"
                      : "text-[var(--ink-muted)] hover:text-[var(--accent)]"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{ans.isAccepted ? "ACCEPTED ANSWER" : "Mark as accepted"}</span>
                </button>
              </div>

              <div
                className="text-xs leading-relaxed text-[var(--ink)] space-y-3 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: ans.bodyHtml }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Answer Submission Composer */}
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
    </div>
  );
}
