export default function QuestionDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Question Header Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-3/4 bg-[var(--surface-high)] rounded" />
        <div className="flex gap-2">
          <div className="h-4 w-16 bg-[var(--surface-high)] rounded" />
          <div className="h-4 w-24 bg-[var(--surface-high)] rounded" />
        </div>
      </div>
      
      {/* Question Body Skeleton */}
      <div className="p-5 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] space-y-3">
        <div className="flex gap-3 items-start">
          <div className="w-10 h-10 rounded-full bg-[var(--surface-high)] shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-full bg-[var(--surface-high)] rounded" />
            <div className="h-4 w-5/6 bg-[var(--surface-high)] rounded" />
            <div className="h-4 w-4/6 bg-[var(--surface-high)] rounded" />
          </div>
        </div>
      </div>

      {/* Answers Skeleton */}
      <div className="space-y-4 pt-4">
        <div className="h-5 w-24 bg-[var(--surface-high)] rounded" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="p-4 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--surface-high)] shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-full bg-[var(--surface-high)] rounded" />
                <div className="h-3 w-5/6 bg-[var(--surface-high)] rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
