import type { HTMLAttributes } from 'react';

function pulseClass(className: string) {
  return `rounded-[var(--folio-radius-sm)] bg-[linear-gradient(90deg,var(--folio-plane)_0%,var(--folio-plane-raised)_50%,var(--folio-plane)_100%)] bg-[length:200%_100%] animate-[folio-skeleton_1.4s_var(--folio-ease-in-out)_infinite] ${className}`;
}

export function Skeleton({
  className = 'h-4 w-full',
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={pulseClass(className)}
      role="status"
      aria-label="Loading"
      {...props}
    />
  );
}

export function SkeletonLine({ width = '100%' }: { width?: string }) {
  return <Skeleton className="h-3" style={{ width }} />;
}

export function SkeletonBlock({ className = 'h-24 w-full' }: { className?: string }) {
  return <Skeleton className={className} />;
}

export function SkeletonPage() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="space-y-3 border-b border-[var(--folio-hairline)] pb-6">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-9 w-64 max-w-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-px overflow-hidden rounded-[var(--folio-radius-md)] border border-[var(--folio-hairline)] bg-[var(--folio-hairline)] sm:grid-cols-3">
        <SkeletonBlock className="h-20 rounded-none" />
        <SkeletonBlock className="h-20 rounded-none" />
        <SkeletonBlock className="h-20 rounded-none" />
      </div>
      <SkeletonBlock className="h-40" />
    </div>
  );
}
