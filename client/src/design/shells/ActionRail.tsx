import type { ReactNode } from 'react';

/**
 * Horizontal action rail — asymmetric cluster for nav + primary actions.
 * Not a equal-width button toolbar.
 */
export function ActionRail({
  leading,
  trailing,
  className = '',
}: {
  leading?: ReactNode;
  trailing?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${className}`}
      role="navigation"
    >
      {leading ? (
        <div className="flex flex-wrap items-center gap-3">{leading}</div>
      ) : null}
      {trailing ? (
        <div className="ml-auto flex flex-wrap items-center gap-2 border-l border-[var(--folio-hairline)] pl-4">
          {trailing}
        </div>
      ) : null}
    </div>
  );
}
