"use client";

import React, { useState } from "react";
import Link from "next/link";
import { bookSession } from "@/lib/actions/mentors";
import { ArrowLeft, Star, Calendar, Clock, CheckCircle2 } from "lucide-react";

export default function MentorDetailPage() {
  const [topic, setTopic] = useState("");
  const [scheduledAt, setScheduledAt] = useState("2026-07-28T15:00");
  const [durationMins, setDurationMins] = useState(45);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Please describe what you want to discuss during the session.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const result = await bookSession({
      mentorId: "123e4567-e89b-12d3-a456-426614174000",
      scheduledAt,
      durationMins,
      topic,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
    } else {
      setIsBooked(true);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <Link
          href="/mentors"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to mentors</span>
        </Link>
      </div>

      {/* Mentor Bio Header */}
      <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] space-y-3">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-[var(--surface-high)] text-[var(--accent)] font-bold text-lg flex items-center justify-center font-mono-numbers shrink-0">
            PS
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-base font-medium text-[var(--ink)]">Priya Sharma</h1>
            <p className="text-xs text-[var(--ink-muted)]">Staff Engineer @ Stripe · Distributed Systems & Rust</p>

            <div className="flex items-center gap-4 mt-2 text-xs font-mono-numbers text-[var(--ink-muted)]">
              <span className="flex items-center gap-1 text-[var(--classifier-podcast)] font-semibold">
                <Star className="w-3.5 h-3.5 fill-current" />
                4.9 (38 reviews)
              </span>
              <span>·</span>
              <span>47 sessions completed</span>
              <span>·</span>
              <span className="text-[var(--accent)] font-semibold">$150/hr</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-[var(--ink-muted)] leading-relaxed pt-2 border-t border-[var(--border)]">
          10+ years building distributed backend infrastructure in Rust, C++, and Go. I help senior engineers level up on concurrency bugs, system design interviews, and architectural refactoring.
        </p>
      </div>

      {/* Booking Form */}
      <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] space-y-4">
        <h2 className="text-xs font-medium text-[var(--ink)] uppercase tracking-wider">
          Book 1-on-1 Mentorship Session
        </h2>

        {isBooked ? (
          <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--accent-soft)] border border-[var(--accent)] text-[var(--accent)] text-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Session Requested Successfully!</span>
            </div>
            <p className="text-[var(--ink-muted)]">
              Priya will review your session topic and confirm the calendar invitation shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBook} className="space-y-4 text-xs">
            {error && (
              <div className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--downvote-soft)] border border-[var(--downvote)] text-[var(--downvote)] text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[var(--ink-muted)] mb-1 font-medium">Session Topic</label>
              <textarea
                rows={3}
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Describe your goals for this call (e.g., Code review of Tokio async mutex deadlocks)..."
                className="w-full p-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[var(--ink-muted)] mb-1 font-medium">Preferred Date & Time</label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" />
                  <input
                    type="datetime-local"
                    required
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] font-mono-numbers focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--ink-muted)] mb-1 font-medium">Duration</label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" />
                  <select
                    value={durationMins}
                    onChange={(e) => setDurationMins(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] font-mono-numbers focus:outline-none focus:border-[var(--accent)]"
                  >
                    <option value={30}>30 mins ($75)</option>
                    <option value={45}>45 mins ($112.50)</option>
                    <option value={60}>60 mins ($150)</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-[var(--accent)] text-[var(--bg)] font-medium rounded-[var(--radius-md)] hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer text-xs"
            >
              {isSubmitting ? "Confirming booking..." : "Request Session & Pay via Stripe"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
