import React from "react";
import { Users } from "lucide-react";

export default function MentorsLoading() {
  return (
    <div className="space-y-6">
      {/* Header Banner Skeleton */}
      <div className="p-5 rounded-[var(--radius-lg)] bg-[#16191E] border border-[var(--border-strong)] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent)] mb-1">
            <Users className="w-4 h-4" />
            <span>Developer Mentorship</span>
          </div>
          <h1 className="text-xl font-bold text-[var(--ink)] tracking-tight">
            1-on-1 Technical Mentorship
          </h1>
          <p className="text-xs text-[var(--ink-muted)] mt-1">
            Book private 45-minute code reviews, architecture consultations, and career advice with industry leaders.
          </p>
        </div>
      </div>

      {/* Grid of 3 skeleton cards */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] animate-pulse space-y-3"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-[var(--surface-high)] shrink-0"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-[var(--surface-high)] rounded w-1/4"></div>
                <div className="h-3 bg-[var(--surface-high)] rounded w-1/2"></div>
                <div className="h-2 bg-[var(--surface-high)] rounded w-1/6"></div>
              </div>
              <div className="shrink-0 space-y-2">
                <div className="h-4 bg-[var(--surface-high)] rounded w-16 ml-auto"></div>
                <div className="h-3 bg-[var(--surface-high)] rounded w-20 ml-auto"></div>
              </div>
            </div>

            <div className="space-y-2 mt-2">
              <div className="h-2 bg-[var(--surface-high)] rounded w-full"></div>
              <div className="h-2 bg-[var(--surface-high)] rounded w-5/6"></div>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-[var(--border)]">
              <div className="flex items-center gap-2">
                <div className="w-12 h-4 bg-[var(--surface-high)] rounded"></div>
                <div className="w-16 h-4 bg-[var(--surface-high)] rounded"></div>
              </div>
              <div className="w-24 h-8 bg-[var(--surface-high)] rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
