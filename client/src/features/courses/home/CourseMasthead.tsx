import Link from 'next/link';
import { Badge, Text } from '@/design/primitives';
import { PageEnter } from '@/design/motion';
import {
  labelForCourseLifecycle,
  toneForCourseLifecycle,
} from '@/design/map/backend-ui';
import type { Course } from '@/lib/types';

export function CourseMasthead({ course }: { course: Course }) {
  const status = course.status || 'active';

  return (
    <PageEnter className="space-y-4 border-b border-[var(--folio-hairline)] pb-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Link
          href="/student/courses"
          className="font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] uppercase tracking-[var(--folio-tracking-label)] text-[var(--folio-ink-faint)] hover:text-[var(--folio-signal)]"
        >
          ← Courses
        </Link>
        <Text as="span" face="mono" size="xs" tone="muted">
          {course.term}
        </Text>
        <Badge tone={toneForCourseLifecycle(status)}>
          {labelForCourseLifecycle(status)}
        </Badge>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <Text
            as="p"
            face="mono"
            className="text-3xl leading-none tracking-[var(--folio-tracking-tight)] text-[var(--folio-signal)] sm:text-4xl"
          >
            {course.code}
          </Text>
          <Text
            as="h1"
            face="display"
            size="3xl"
            className="leading-[var(--folio-leading-tight)]"
          >
            {course.title}
          </Text>
          {course.description ? (
            <Text as="p" size="md" tone="muted" className="max-w-2xl">
              {course.description}
            </Text>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            href={`/student/courses/${course.id}/progress`}
            className="font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] uppercase tracking-[var(--folio-tracking-label)] text-[var(--folio-ink-muted)] hover:text-[var(--folio-signal)]"
          >
            Progress
          </Link>
          <Link
            href={`/student/courses/${course.id}/tutor`}
            className="font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] uppercase tracking-[var(--folio-tracking-label)] text-[var(--folio-ink-muted)] hover:text-[var(--folio-signal)]"
          >
            Tutor
          </Link>
        </div>
      </div>
    </PageEnter>
  );
}
