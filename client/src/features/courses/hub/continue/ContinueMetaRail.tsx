import { Text } from '@/design/primitives';
import type { ContinueTarget } from './continue-types';

export function ContinueMetaRail({ target }: { target: ContinueTarget }) {
  const { course, topic, topicDescription, reason } = target;
  const seq = String(topic.sequence).padStart(2, '0');

  return (
    <div className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <Text as="span" face="label" tone="faint">
          Next practice
        </Text>
        <Text as="span" face="mono" size="xs" tone="muted">
          {course.code}
        </Text>
        <Text as="span" face="mono" size="xs" tone="faint">
          {course.term}
        </Text>
        {course.status ? (
          <Text as="span" face="mono" size="xs" tone="faint">
            {course.status}
          </Text>
        ) : null}
      </div>

      <div className="flex gap-4 sm:gap-6">
        <Text
          as="span"
          face="mono"
          className="shrink-0 text-4xl leading-none tracking-[var(--folio-tracking-tight)] text-[var(--folio-signal)] sm:text-5xl"
        >
          {seq}
        </Text>
        <div className="min-w-0 space-y-2">
          <Text
            as="h2"
            face="display"
            size="2xl"
            className="leading-[var(--folio-leading-tight)] sm:text-[length:var(--folio-text-3xl)]"
          >
            {topic.title}
          </Text>
          {topicDescription ? (
            <Text as="p" size="sm" tone="muted" className="max-w-xl">
              {topicDescription}
            </Text>
          ) : null}
          <Text as="p" size="sm" tone="muted">
            {course.title}
          </Text>
          <Text as="p" face="mono" size="sm" tone="signal" className="pt-1">
            {reason}
          </Text>
        </div>
      </div>
    </div>
  );
}
