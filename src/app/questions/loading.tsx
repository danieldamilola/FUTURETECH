export default function QuestionsLoading() {
  return (
    <div className="w-full space-y-4">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex gap-4">
          <div className="h-4 w-24 bg-[var(--surface-high)] rounded animate-pulse" />
          <div className="h-4 w-24 bg-[var(--surface-high)] rounded animate-pulse" />
          <div className="h-4 w-24 bg-[var(--surface-high)] rounded animate-pulse" />
        </div>
        <div className="h-8 w-28 bg-[var(--surface-high)] rounded animate-pulse" />
      </div>

      {/* List Skeleton */}
      <div className="divide-y divide-[var(--border)]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="py-4 flex gap-4 items-start">
            <div className="w-8 h-16 bg-[var(--surface-high)] rounded animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="w-16 h-4 bg-[var(--surface-high)] rounded animate-pulse" />
              <div className="w-3/4 h-5 bg-[var(--surface-high)] rounded animate-pulse" />
              <div className="w-full h-4 bg-[var(--surface-high)] rounded animate-pulse" />
              <div className="w-2/3 h-4 bg-[var(--surface-high)] rounded animate-pulse" />
              <div className="flex gap-2 pt-1">
                <div className="w-20 h-3 bg-[var(--surface-high)] rounded animate-pulse" />
                <div className="w-20 h-3 bg-[var(--surface-high)] rounded animate-pulse" />
                <div className="w-20 h-3 bg-[var(--surface-high)] rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
