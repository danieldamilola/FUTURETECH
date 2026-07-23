"use client";

import React, { useState } from "react";
import { toggleBookmark, BookmarkTargetType } from "@/lib/actions/bookmark";
import { AuthModal } from "@/components/auth/auth-modal";
import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";

interface BookmarkButtonProps {
  targetType: BookmarkTargetType;
  targetId: string;
  initialBookmarked?: boolean;
  className?: string;
}

export function BookmarkButton({
  targetType,
  targetId,
  initialBookmarked = false,
  className,
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic toggle
    const prev = isBookmarked;
    setIsBookmarked(!prev);

    const result = await toggleBookmark(targetType, targetId);

    if (!result.success) {
      setIsBookmarked(prev);
      if (result.error?.includes("signed in")) {
        setIsAuthModalOpen(true);
      }
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isBookmarked ? "Remove bookmark" : "Save bookmark"}
        className={cn(
          "p-1 rounded-[var(--radius-sm)] transition-colors cursor-pointer flex items-center gap-1 text-xs",
          isBookmarked
            ? "text-[var(--accent)] font-semibold"
            : "text-[var(--ink-muted)] hover:text-[var(--ink)]",
          className
        )}
      >
        <Bookmark
          className={cn(
            "w-3.5 h-3.5 transition-transform active:scale-125",
            isBookmarked && "fill-current text-[var(--accent)]"
          )}
        />
        {isBookmarked && <span className="text-[10px]">Saved</span>}
      </button>

      <AuthModal
        isOpen={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        defaultMode="signin"
      />
    </>
  );
}
