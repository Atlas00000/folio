import Link from 'next/link';
import { Text } from '@/design/primitives';
import { PageEnter } from '@/design/motion';

export function JoinRail() {
  return (
    <PageEnter stage={2}>
      <aside className="relative border-y border-[var(--folio-hairline)] bg-[color-mix(in_srgb,var(--folio-plane)_22%,transparent)] py-6">
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-md space-y-2">
            <Text as="p" face="label" tone="faint">
              Enrolment
            </Text>
            <Text as="h2" face="display" size="2xl" className="leading-tight">
              Have a join code?
            </Text>
            <Text as="p" size="sm" tone="muted">
              Your lecturer issues a course code. Join with it to add another
              module to this ledger.
            </Text>
          </div>
          <Link
            href="/student/join"
            className="inline-flex shrink-0 items-center justify-center rounded-[var(--folio-radius-sm)] border border-[var(--folio-hairline-strong)] bg-transparent px-4 py-2 text-[length:var(--folio-text-sm)] font-medium text-[var(--folio-ink-muted)] transition-colors hover:border-[var(--folio-signal)]/50 hover:text-[var(--folio-signal)]"
          >
            Join a course
          </Link>
        </div>
      </aside>
    </PageEnter>
  );
}
