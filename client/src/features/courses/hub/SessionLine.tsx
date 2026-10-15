import { Text } from '@/design/primitives';
import { PageEnter } from '@/design/motion';
import type { Course, GlobalRole } from '@/lib/types';
import { roleLabel } from './greeting';

export function SessionLine({
  displayName,
  email,
  globalRole,
  courses,
}: {
  displayName: string;
  email?: string;
  globalRole?: GlobalRole | string;
  courses: Course[];
}) {
  const terms = [...new Set(courses.map((c) => c.term).filter(Boolean))];
  const primaryTerm = terms[0] ?? null;
  const focus =
    terms.length > 1
      ? terms.join(' · ')
      : primaryTerm
        ? `${primaryTerm} · ${courses.length} enrolled`
        : courses.length
          ? `${courses.length} enrolled`
          : 'No enrolments yet';

  return (
    <PageEnter className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--folio-hairline)] pb-4">
      <div className="min-w-0 space-y-1">
        <Text as="p" face="label" tone="faint">
          Signed in as
        </Text>
        <Text as="p" face="display" size="lg" className="truncate leading-tight">
          {displayName}
        </Text>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
          {globalRole ? (
            <Text as="span" face="mono" size="xs" tone="muted">
              {roleLabel(globalRole)}
            </Text>
          ) : null}
          {email ? (
            <Text as="span" face="mono" size="xs" tone="faint" className="truncate">
              {email}
            </Text>
          ) : null}
        </div>
      </div>
      <div className="text-right">
        <Text as="p" face="label" tone="faint">
          Term focus
        </Text>
        <Text as="p" face="mono" size="sm" tone="muted" className="mt-1">
          {focus}
        </Text>
      </div>
    </PageEnter>
  );
}
