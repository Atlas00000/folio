import Link from 'next/link';
import { Text } from '@/design/primitives';
import { PageEnter } from '@/design/motion';
import type { Course, Topic } from '@/lib/types';

export function TopicMasthead({
  course,
  topic,
}: {
  course: Course;
  topic: Topic;
}) {
  const seq = String(topic.sequence).padStart(2, '0');

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
          Topic {seq}
        </Text>
      </nav>

      <div className="flex gap-4 sm:gap-6">
        <Text
          as="span"
          face="mono"
          className="shrink-0 text-4xl leading-none tracking-[var(--folio-tracking-tight)] text-[var(--folio-signal)] sm:text-5xl"
        >
          {seq}
        </Text>
        <div className="min-w-0 space-y-2">
          <Text as="p" face="mono" size="xs" tone="muted">
            {course.code} · {course.title}
          </Text>
          <Text
            as="h1"
            face="display"
            size="3xl"
            className="leading-[var(--folio-leading-tight)]"
          >
            {topic.title}
          </Text>
          {topic.description ? (
            <Text as="p" size="md" tone="muted" className="max-w-2xl">
              {topic.description}
            </Text>
          ) : null}
        </div>
      </div>
    </PageEnter>
  );
}
