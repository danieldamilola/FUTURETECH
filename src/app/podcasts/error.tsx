"use client";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="py-16 text-center border border-dashed border-[var(--border)] rounded-[var(--radius-md)]">
      <p className="text-sm font-semibold text-[var(--ink)] mb-2">Something went wrong!</p>
      <p className="text-xs text-[var(--ink-muted)] mb-4">Failed to load content. Please try again.</p>
      <button onClick={reset} className="px-3 py-1.5 bg-[var(--surface-high)] text-[var(--ink)] rounded-[var(--radius-sm)] text-xs font-medium hover:bg-[var(--surface-hover)] transition-colors">Retry</button>
    </div>
  );
}
