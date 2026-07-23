"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { acceptAnswer } from "@/lib/actions/answers";

export function AcceptButton({
  questionId,
  answerId,
  isAccepted,
  canAccept,
}: {
  questionId: string;
  answerId: string;
  isAccepted: boolean;
  canAccept: boolean;
}) {
  const [optimisticAccepted, setOptimisticAccepted] = React.useState(isAccepted);

  const handleToggleAccept = async () => {
    if (!canAccept) return;
    setOptimisticAccepted(!optimisticAccepted);
    const result = await acceptAnswer(questionId, answerId);
    if (!result.success) {
      setOptimisticAccepted(isAccepted); // Revert on failure
    }
  };

  if (!canAccept && !optimisticAccepted) return null;

  return (
    <button
      type="button"
      onClick={handleToggleAccept}
      disabled={!canAccept}
      className={`inline-flex items-center gap-1 text-[11px] font-mono-numbers transition-colors ${
        optimisticAccepted
          ? "text-[var(--accent)] font-semibold"
          : "text-[var(--ink-muted)] hover:text-[var(--accent)] cursor-pointer"
      } ${!canAccept ? "cursor-default" : ""}`}
    >
      <CheckCircle2 className="w-3.5 h-3.5" />
      <span>{optimisticAccepted ? "ACCEPTED ANSWER" : "Mark as accepted"}</span>
    </button>
  );
}
