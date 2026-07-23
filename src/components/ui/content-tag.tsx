import React from "react";
import { cn } from "@/lib/utils";

export type ContentType = "article" | "question" | "podcast" | "job" | "mentor";

interface ContentTagProps {
  type: ContentType;
  label: string;
  className?: string;
}

const colorMap: Record<ContentType, string> = {
  article: "var(--classifier-article)",
  question: "var(--classifier-question)",
  podcast: "var(--classifier-podcast)",
  job: "var(--classifier-job)",
  mentor: "var(--classifier-mentor)",
};

export function ContentTag({ type, label, className }: ContentTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-[var(--ink-muted)]",
        className
      )}
    >
      <span
        className="w-1.5 h-1.5 rounded-full inline-block"
        style={{ backgroundColor: colorMap[type] }}
        aria-hidden="true"
      />
      <span>{label}</span>
    </span>
  );
}
