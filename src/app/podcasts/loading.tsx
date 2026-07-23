export default function PodcastsLoading() {
  return (
    <div className="w-full space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-[var(--surface-high)] rounded animate-pulse" />
          <div className="h-6 w-48 bg-[var(--surface-high)] rounded animate-pulse" />
          <div className="h-4 w-64 bg-[var(--surface-high)] rounded animate-pulse" />
        </div>
        <div className="h-8 w-28 bg-[var(--surface-high)] rounded animate-pulse" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 mb-8">
        <div className="h-8 w-24 bg-[var(--surface-high)] rounded animate-pulse" />
        <div className="h-8 w-24 bg-[var(--surface-high)] rounded animate-pulse" />
        <div className="h-8 w-24 bg-[var(--surface-high)] rounded animate-pulse" />
      </div>

      {/* Content Skeleton */}
      <div className="space-y-4">
        <div className="h-5 w-40 bg-[var(--surface-high)] rounded animate-pulse mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] flex flex-col gap-3">
              <div className="w-full aspect-square bg-[var(--surface-high)] rounded-[var(--radius-sm)] animate-pulse" />
              <div className="h-3 w-16 bg-[var(--surface-high)] rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-[var(--surface-high)] rounded animate-pulse" />
              <div className="h-3 w-full bg-[var(--surface-high)] rounded animate-pulse" />
              <div className="h-3 w-5/6 bg-[var(--surface-high)] rounded animate-pulse" />
              <div className="mt-auto h-8 w-full bg-[var(--surface-high)] rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
