import Link from 'next/link';
import { EmptyState } from '@/design/patterns';

export function CourseLedgerEmpty() {
  return (
    <EmptyState
      title="No enrolments yet"
      description="Join a course with the code from your lecturer, then it will appear in this ledger."
      action={
        <Link
          href="/student/join"
          className="inline-flex items-center justify-center rounded-[var(--folio-radius-sm)] bg-[var(--folio-signal)] px-3.5 py-2 text-[length:var(--folio-text-sm)] font-medium text-[var(--folio-on-signal)] transition-[background] duration-[var(--folio-dur-base)] hover:bg-[var(--folio-signal-deep)]"
        >
          Join a course
        </Link>
      }
    />
  );
}
