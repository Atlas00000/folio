'use client';

import Link from 'next/link';
import { Text } from '@/design/primitives';

/**
 * Compact mobile top strip — brand + greeting; actions live in the dock sheet.
 */
export function MobileTopBar({
  brandHref,
  greeting,
  onOpenMore,
}: {
  brandHref: string;
  greeting?: string | null;
  onOpenMore: () => void;
}) {
  return (
    <header
      className="fixed inset-x-0 top-0 z-30 border-b border-[var(--folio-hairline-strong)] bg-[var(--folio-void)]/95 backdrop-blur-md md:hidden"
      style={{ paddingTop: 'var(--folio-safe-top)' }}
    >
      <div
        className="mx-auto flex w-full items-center justify-between gap-3 px-4"
        style={{ minHeight: 'var(--folio-mobile-top)' }}
      >
        <Link href={brandHref} className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden
            className="h-4 w-[2px] shrink-0 bg-[var(--folio-signal)]"
          />
          <span className="font-[family-name:var(--folio-font-display)] text-xl leading-none tracking-[var(--folio-tracking-tight)]">
            Folio
          </span>
          {greeting ? (
            <Text
              as="span"
              face="mono"
              size="xs"
              tone="faint"
              className="truncate"
            >
              · {greeting}
            </Text>
          ) : null}
        </Link>

        <button
          type="button"
          onClick={onOpenMore}
          aria-label="Open account and theme"
          className="inline-flex h-9 items-center gap-2 border border-[var(--folio-hairline-strong)] px-3 font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] uppercase tracking-[var(--folio-tracking-label)] text-[var(--folio-ink-muted)] transition-colors hover:border-[var(--folio-signal)]/40 hover:text-[var(--folio-signal)]"
        >
          More
          <span aria-hidden className="text-[var(--folio-signal)]">
            ≡
          </span>
        </button>
      </div>
    </header>
  );
}
