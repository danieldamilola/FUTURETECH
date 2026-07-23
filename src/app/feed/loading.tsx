export default function FeedLoading() {
  return (
    <div className="divide-y divide-[var(--border)] animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="py-4 flex gap-4">
          <div className="w-8 space-y-1">
            <div className="h-3 w-6 bg-[var(--surface-high)] rounded" />
            <div className="h-3 w-4 bg-[var(--surface-high)] rounded mx-auto" />
            <div className="h-3 w-6 bg-[var(--surface-high)] rounded" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-2 w-16 bg-[var(--surface-high)] rounded" />
            <div className="h-4 w-3/4 bg-[var(--surface-high)] rounded" />
            <div className="h-3 w-full bg-[var(--surface-high)] rounded" />
            <div className="h-3 w-1/2 bg-[var(--surface-high)] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
