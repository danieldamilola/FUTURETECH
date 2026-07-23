"use client";

import React, { useState } from "react";
import { toggleVote, TargetType } from "@/lib/actions/vote";
import { AuthModal } from "@/components/auth/auth-modal";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";

interface VoteRailProps {
  targetType: TargetType;
  targetId: string;
  initialUpvotes?: number;
  initialDownvotes?: number;
  initialUserVote?: 1 | -1 | 0;
  layout?: "vertical" | "horizontal" | "responsive";
}

export function VoteRail({
  targetType,
  targetId,
  initialUpvotes = 0,
  initialDownvotes = 0,
  initialUserVote = 0,
  layout = "responsive",
}: VoteRailProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState<1 | -1 | 0>(initialUserVote);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const netScore = upvotes - downvotes;

  const handleVote = async (value: 1 | -1) => {
    // Optimistic UI state calculation
    const prevVote = userVote;
    let newUp = upvotes;
    let newDown = downvotes;
    let newVote: 1 | -1 | 0 = value;

    if (prevVote === value) {
      // Toggle off
      newVote = 0;
      if (value === 1) newUp--;
      if (value === -1) newDown--;
    } else {
      if (prevVote === 1) newUp--;
      if (prevVote === -1) newDown--;
      if (value === 1) newUp++;
      if (value === -1) newDown++;
    }

    setUpvotes(newUp);
    setDownvotes(newDown);
    setUserVote(newVote);

    const result = await toggleVote(targetType, targetId, value);

    if (!result.success) {
      // Rollback on auth or server error
      setUpvotes(upvotes);
      setDownvotes(downvotes);
      setUserVote(prevVote);
      if (result.error?.includes("signed in")) {
        setIsAuthModalOpen(true);
      }
    }
  };

  const verticalMarkup = (
    <div className="flex flex-col items-center justify-center gap-0.5 select-none font-mono-numbers">
      <button
        type="button"
        onClick={() => handleVote(1)}
        aria-label="Upvote"
        className={cn(
          "p-1 rounded-[var(--radius-sm)] transition-colors cursor-pointer",
          userVote === 1
            ? "text-[var(--accent)] bg-[var(--surface-high)]"
            : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)]"
        )}
      >
        <ChevronUp className="w-4 h-4" />
      </button>
      <span
        className={cn(
          "text-xs font-bold my-0.5 min-w-[20px] text-center",
          userVote === 1
            ? "text-[var(--accent)]"
            : userVote === -1
            ? "text-[var(--downvote)]"
            : "text-[var(--ink)]"
        )}
      >
        {netScore}
      </span>
      <button
        type="button"
        onClick={() => handleVote(-1)}
        aria-label="Downvote"
        className={cn(
          "p-1 rounded-[var(--radius-sm)] transition-colors cursor-pointer",
          userVote === -1
            ? "text-[var(--downvote)] bg-[var(--surface-high)]"
            : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)]"
        )}
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );

  const horizontalMarkup = (
    <div className="inline-flex items-center gap-1 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] px-1.5 py-0.5 select-none font-mono-numbers text-xs">
      <button
        type="button"
        onClick={() => handleVote(1)}
        aria-label="Upvote"
        className={cn(
          "p-0.5 rounded transition-colors cursor-pointer",
          userVote === 1 ? "text-[var(--accent)] font-bold" : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
        )}
      >
        <ChevronUp className="w-3.5 h-3.5" />
      </button>
      <span
        className={cn(
          "px-1 font-bold",
          userVote === 1
            ? "text-[var(--accent)]"
            : userVote === -1
            ? "text-[var(--downvote)]"
            : "text-[var(--ink)]"
        )}
      >
        {netScore}
      </span>
      <button
        type="button"
        onClick={() => handleVote(-1)}
        aria-label="Downvote"
        className={cn(
          "p-0.5 rounded transition-colors cursor-pointer",
          userVote === -1 ? "text-[var(--downvote)] font-bold" : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
        )}
      >
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  return (
    <>
      {layout === "vertical" && verticalMarkup}
      {layout === "horizontal" && horizontalMarkup}
      {layout === "responsive" && (
        <>
          <div className="hidden sm:block">{verticalMarkup}</div>
          <div className="sm:hidden">{horizontalMarkup}</div>
        </>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        defaultMode="signin"
      />
    </>
  );
}
