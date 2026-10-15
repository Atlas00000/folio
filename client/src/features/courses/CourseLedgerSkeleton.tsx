import { Skeleton, SkeletonBlock } from '@/design/patterns';

export function CourseLedgerSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <div className="space-y-0" aria-busy="true" aria-label="Loading courses">
      <div className="mb-4 flex items-end justify-between border-b border-[var(--folio-hairline-strong)] pb-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-10" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[minmax(5.5rem,7.5rem)_1fr] gap-x-5 border-b border-[var(--folio-hairline)] py-5 sm:grid-cols-[minmax(6.5rem,9rem)_1fr_auto]"
        >
          <div className="space-y-2">
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-2.5 w-16" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-7 w-3/4 max-w-md" />
            <Skeleton className="h-3 w-full max-w-lg" />
          </div>
          <SkeletonBlock className="hidden h-6 w-16 sm:block" />
        </div>
      ))}
    </div>
  );
}
