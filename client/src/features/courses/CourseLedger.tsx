'use client';

import { Text } from '@/design/primitives';
import { NumberTick, PageEnter } from '@/design/motion';
import type { Course } from '@/lib/types';
import { CourseLedgerEmpty } from './CourseLedgerEmpty';
import { CourseLedgerItem } from './CourseLedgerItem';
import { CourseLedgerSkeleton } from './CourseLedgerSkeleton';

export function CourseLedger({
  courses,
  loading = false,
  hrefFor,
  ownerName,
}: {
  courses: Course[];
  loading?: boolean;
  hrefFor: (course: Course) => string;
  /** When set, labels the ledger as this learner’s enrolments */
  ownerName?: string;
}) {
  if (loading) {
    return <CourseLedgerSkeleton />;
  }

  if (courses.length === 0) {
    return <CourseLedgerEmpty />;
  }

  return (
    <section aria-label="Enrolled courses" className="relative">
      <PageEnter className="mb-2 flex items-end justify-between gap-4 border-b border-[var(--folio-hairline-strong)] pb-3">
        <div>
          <Text as="p" face="label" tone="faint">
            {ownerName ? `${ownerName}'s enrolments` : 'Enrolled'}
          </Text>
          <Text as="p" size="sm" tone="muted" className="mt-1 max-w-sm">
            Open a course to practise topics and track progress.
          </Text>
        </div>
        <div className="text-right">
          <NumberTick
            value={courses.length}
            className="block text-3xl leading-none text-[var(--folio-ink)]"
          />
          <Text as="p" face="label" tone="faint" className="mt-1">
            {courses.length === 1 ? 'Course' : 'Courses'}
          </Text>
        </div>
      </PageEnter>

      <ul className="list-none p-0">
        {courses.map((course, index) => (
          <li key={course.id}>
            <CourseLedgerItem
              course={course}
              href={hrefFor(course)}
              index={index}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
