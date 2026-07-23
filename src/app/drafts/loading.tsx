export default function DraftsLoading() {
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <h1 className="text-sm font-medium text-[var(--ink)]">Your Drafts</h1>
        <span className="h-3 w-12 bg-[var(--surface-high)] rounded animate-pulse" />
      </div>

      <div className="divide-y divide-[var(--border)] animate-pulse">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="py-3 flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 w-48 bg-[var(--surface-high)] rounded" />
              <div className="h-3 w-32 bg-[var(--surface-high)] rounded" />
            </div>
            <div className="flex gap-3">
              <div className="h-4 w-8 bg-[var(--surface-high)] rounded" />
              <div className="h-4 w-4 bg-[var(--surface-high)] rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
