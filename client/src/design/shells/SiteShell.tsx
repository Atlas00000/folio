import Link from 'next/link';
import type { ReactNode } from 'react';
import { ActionRail } from './ActionRail';

/**
 * Public site chrome — header, nav, footer.
 * Main content is passed as children (may be empty while designing).
 */
export function SiteShell({
  nav,
  meta,
  children,
}: {
  nav?: ReactNode;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-[var(--folio-canvas)] text-[var(--folio-ink)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--folio-void)_0%,transparent_32%)]" />
      </div>

      <header className="relative z-10 border-b border-[var(--folio-hairline-strong)] bg-[var(--folio-void)]/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[var(--folio-content-max)] items-stretch gap-6 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-3 border-r border-[var(--folio-hairline-strong)] py-3.5 pr-6"
          >
            <span
              aria-hidden
              className="h-5 w-[2px] bg-[var(--folio-signal)]"
            />
            <span className="font-[family-name:var(--folio-font-display)] text-2xl leading-none tracking-[var(--folio-tracking-tight)]">
              Folio
            </span>
          </Link>
          <ActionRail className="flex-1 py-3.5" leading={nav} trailing={meta} />
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-[var(--folio-content-max)] flex-1 flex-col px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="relative z-10 mt-auto border-t border-[var(--folio-hairline-strong)] bg-[var(--folio-void)]/90">
        <div className="mx-auto flex w-full max-w-[var(--folio-content-max)] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <span className="font-[family-name:var(--folio-font-display)] text-lg tracking-[var(--folio-tracking-tight)]">
            Folio
          </span>
          <span className="font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] text-[var(--folio-ink-faint)]">
            First-year accounting practice
          </span>
        </div>
      </footer>
    </div>
  );
}
