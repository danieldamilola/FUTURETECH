export default function ExploreLoading() {
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[var(--surface-high)] animate-pulse" />
          <div className="h-5 w-24 bg-[var(--surface-high)] rounded animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="p-3 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] animate-pulse">
            <div className="h-4 w-1/3 bg-[var(--surface-high)] rounded mb-2" />
            <div className="h-3 w-full bg-[var(--surface-high)] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
