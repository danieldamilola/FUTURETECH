"use client";

import React, { useState } from "react";
import { toggleUserFollow, toggleShowFollow } from "@/lib/actions/follows";
import { AuthModal } from "@/components/auth/auth-modal";
import { cn } from "@/lib/utils";
import { UserPlus, UserCheck, Rss } from "lucide-react";

interface FollowButtonProps {
  targetType: "user" | "show";
  targetId: string;
  initialFollowing?: boolean;
  /** Compact = just an icon+text pill. Full = wider button with label */
  size?: "sm" | "md";
  className?: string;
}

export function FollowButton({
  targetType,
  targetId,
  initialFollowing = false,
  size = "md",
  className,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;

    const prev = isFollowing;
    setIsFollowing(!prev);
    setIsLoading(true);

    const result =
      targetType === "user"
        ? await toggleUserFollow(targetId)
        : await toggleShowFollow(targetId);

    setIsLoading(false);

    if (!result.success) {
      setIsFollowing(prev);
      if (result.error?.toLowerCase().includes("sign in")) {
        setIsAuthModalOpen(true);
      }
    }
  };

  const Icon = targetType === "show" ? Rss : isFollowing ? UserCheck : UserPlus;
  const label = targetType === "show"
    ? isFollowing ? "Following" : "Follow Show"
    : isFollowing ? "Following" : "Follow";

  return (
    <>
      <button
        type="button"
        onClick={handleToggle}
        disabled={isLoading}
        aria-label={label}
        className={cn(
          "inline-flex items-center gap-1.5 font-medium transition-all cursor-pointer disabled:opacity-50 select-none",
          size === "sm"
            ? "px-2.5 py-1 text-[11px] rounded-[var(--radius-sm)]"
            : "px-3 py-1.5 text-xs rounded-[var(--radius-sm)]",
          isFollowing
            ? "bg-[var(--surface-high)] text-[var(--ink)] border border-[var(--border-strong)] hover:border-[var(--danger)]/60 hover:text-[var(--danger)]"
            : "bg-[var(--accent)] text-[var(--bg)] hover:opacity-90 border border-transparent",
          className
        )}
      >
        <Icon className={cn("shrink-0", size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5")} />
        <span>{label}</span>
      </button>

      <AuthModal
        isOpen={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        defaultMode="signin"
      />
    </>
  );
}
