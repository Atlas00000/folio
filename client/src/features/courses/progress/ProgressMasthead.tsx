import Link from 'next/link';
import { Text } from '@/design/primitives';
import { PageEnter } from '@/design/motion';
import type { Course } from '@/lib/types';

export function ProgressMasthead({ course }: { course: Course }) {
  return (
    <PageEnter className="space-y-4 border-b border-[var(--folio-hairline)] pb-6">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-x-3 gap-y-1"
      >
        <Link
          href="/student/courses"
          className="font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] uppercase tracking-[var(--folio-tracking-label)] text-[var(--folio-ink-faint)] hover:text-[var(--folio-signal)]"
        >
          Courses
        </Link>
        <Text as="span" face="mono" size="xs" tone="faint">
          /
        </Text>
        <Link
          href={`/student/courses/${course.id}`}
          className="font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] uppercase tracking-[var(--folio-tracking-label)] text-[var(--folio-ink-faint)] hover:text-[var(--folio-signal)]"
        >
          {course.code}
        </Link>
        <Text as="span" face="mono" size="xs" tone="faint">
          /
        </Text>
        <Text as="span" face="mono" size="xs" tone="muted">
          Progress
        </Text>
      </nav>

      <div className="space-y-2">
        <Text as="p" face="mono" size="xs" tone="muted">
          {course.code} · {course.term}
        </Text>
        <Text
          as="h1"
          face="display"
          size="3xl"
          className="leading-[var(--folio-leading-tight)]"
        >
          Your progress
        </Text>
        <Text as="p" size="md" tone="muted" className="max-w-2xl">
          Mastery by topic from marked attempts in {course.title}.
        </Text>
      </div>
    </PageEnter>
  );
}
