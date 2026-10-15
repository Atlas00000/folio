'use client';

import Link from 'next/link';
import { Badge, Text } from '@/design/primitives';
import { PageEnter, StateCrossfade } from '@/design/motion';
import {
  labelForCourseLifecycle,
  toneForCourseLifecycle,
} from '@/design/map/backend-ui';
import type { Course } from '@/lib/types';
import { labelForCourseRole } from './course-role';

export function CourseLedgerItem({
  course,
  href,
  index = 0,
}: {
  course: Course;
  href: string;
  index?: number;
}) {
  const status = course.status || 'active';
  const statusTone = toneForCourseLifecycle(status);
  const statusLabel = labelForCourseLifecycle(status);
  const roleLabel = labelForCourseRole(course.myRole);
  const stage = Math.min(index, 3) as 0 | 1 | 2 | 3;

  return (
    <PageEnter stage={stage}>
      <Link
        href={href}
        className="group relative grid grid-cols-[minmax(5.5rem,7.5rem)_1fr] gap-x-5 gap-y-2 border-b border-[var(--folio-hairline)] py-5 pl-3 transition-[background,padding] duration-[var(--folio-dur-base)] hover:bg-[var(--folio-plane)] hover:pl-4 focus-visible:bg-[var(--folio-plane)] focus-visible:pl-4 sm:grid-cols-[minmax(6.5rem,9rem)_1fr_auto] sm:items-center sm:gap-x-8 sm:pl-4 sm:hover:pl-5"
      >
        <span
          aria-hidden
          className="absolute bottom-2 left-0 top-2 w-[2px] origin-center scale-y-50 bg-[var(--folio-signal)] opacity-0 transition-[transform,opacity] duration-[var(--folio-dur-base)] group-hover:scale-y-100 group-hover:opacity-100 group-focus-visible:scale-y-100 group-focus-visible:opacity-100"
        />

        <div className="min-w-0">
          <Text
            as="span"
            face="mono"
            size={index === 0 ? '2xl' : 'xl'}
            className="block leading-none tracking-[var(--folio-tracking-tight)] transition-colors duration-[var(--folio-dur-fast)] group-hover:text-[var(--folio-signal)]"
          >
            {course.code}
          </Text>
          <Text as="span" face="label" tone="faint" className="mt-2 block">
            {course.term}
          </Text>
        </div>

        <div className="min-w-0 space-y-1.5">
          <Text
            as="span"
            face="display"
            size={index === 0 ? '2xl' : 'xl'}
            className="block leading-[var(--folio-leading-tight)]"
          >
            {course.title}
          </Text>
          {course.description ? (
            <Text as="span" size="sm" tone="muted" className="line-clamp-2 block max-w-2xl">
              {course.description}
            </Text>
          ) : null}
        </div>

        <div className="col-span-2 flex flex-wrap items-center gap-2 sm:col-span-1 sm:flex-col sm:items-end sm:gap-2">
          <StateCrossfade stateKey={status}>
            <Badge tone={statusTone}>{statusLabel}</Badge>
          </StateCrossfade>
          {roleLabel ? (
            <Text as="span" face="mono" size="xs" tone="faint">
              {roleLabel}
            </Text>
          ) : null}
          <Text
            as="span"
            face="label"
            tone="signal"
            className="opacity-0 transition-opacity duration-[var(--folio-dur-base)] group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            Open
          </Text>
        </div>
      </Link>
    </PageEnter>
  );
}
