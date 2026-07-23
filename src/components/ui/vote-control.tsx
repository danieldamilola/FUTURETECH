"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface VoteControlProps {
  initialUpvotes: number;
  initialDownvotes?: number;
  userVote?: number; // 1, -1, or 0
  onVote?: (value: 1 | -1) => Promise<void>;
  orientation?: "vertical" | "inline";
  className?: string;
}

export function VoteControl({
  initialUpvotes,
  initialDownvotes = 0,
  userVote: initialUserVote = 0,
  onVote,
  orientation = "vertical",
  className,
}: VoteControlProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [currentVote, setCurrentVote] = useState(initialUserVote);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async (value: 1 | -1) => {
    if (isSubmitting) return;

    const previousVote = currentVote;
    const previousUp = upvotes;
    const previousDown = downvotes;

    // Optimistic update
    if (currentVote === value) {
      // Toggle off
      setCurrentVote(0);
      if (value === 1) setUpvotes((prev) => prev - 1);
      else setDownvotes((prev) => prev - 1);
    } else {
      // Switch or new vote
      setCurrentVote(value);
      if (value === 1) {
        setUpvotes((prev) => prev + 1);
        if (previousVote === -1) setDownvotes((prev) => prev - 1);
      } else {
        setDownvotes((prev) => prev + 1);
        if (previousVote === 1) setUpvotes((prev) => prev - 1);
      }
    }

    setIsSubmitting(true);
    try {
      if (onVote) {
        await onVote(value);
      }
    } catch {
      // Rollback on error
      setCurrentVote(previousVote);
      setUpvotes(previousUp);
      setDownvotes(previousDown);
    } finally {
      setIsSubmitting(false);
    }
  };

  const netScore = upvotes - downvotes;

  if (orientation === "inline") {
    return (
      <div className={cn("inline-flex items-center gap-1.5 text-xs text-[var(--ink-muted)]", className)}>
        <button
          type="button"
          onClick={() => handleVote(1)}
          aria-label="Upvote"
          className={cn(
            "p-0.5 hover:text-[var(--accent)] transition-colors",
            currentVote === 1 && "text-[var(--accent)] font-semibold"
          )}
        >
          ▲
        </button>
        <span className="font-mono-numbers">{netScore}</span>
        <button
          type="button"
          onClick={() => handleVote(-1)}
          aria-label="Downvote"
          className={cn(
            "p-0.5 hover:text-[var(--downvote)] transition-colors",
            currentVote === -1 && "text-[var(--downvote)] font-semibold"
          )}
        >
          ▼
        </button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center select-none text-[var(--ink-muted)]", className)}>
      <button
        type="button"
        onClick={() => handleVote(1)}
        aria-label="Upvote"
        className={cn(
          "p-1 text-xs hover:text-[var(--accent)] transition-colors cursor-pointer",
          currentVote === 1 && "text-[var(--accent)] font-bold"
        )}
      >
        ▲
      </button>
      <span className="font-mono-numbers text-xs font-medium my-0.5">{netScore}</span>
      <button
        type="button"
        onClick={() => handleVote(-1)}
        aria-label="Downvote"
        className={cn(
          "p-1 text-xs hover:text-[var(--downvote)] transition-colors cursor-pointer",
          currentVote === -1 && "text-[var(--downvote)] font-bold"
        )}
      >
        ▼
      </button>
    </div>
  );
}
