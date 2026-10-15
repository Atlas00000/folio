import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Text } from '@/design/primitives';
import { NumberTick, PageEnter, StateCrossfade } from '@/design/motion';
import type { TopicAttemptPeek, TopicSignal } from './types';

const AttemptRhythm = dynamic(
  () => import('../viz').then((m) => m.AttemptRhythm),
  { ssr: false },
);

const SIGNAL_TONE: Record<TopicSignal['signal'], string> = {
  untried: 'text-[var(--folio-ink-muted)]',
  weak: 'text-[var(--folio-warn)]',
  reinforce: 'text-[var(--folio-ok)]',
};

export function TopicProgressSignal({
  courseId,
  signal,
  attempts = [],
}: {
  courseId: string;
  signal: TopicSignal;
  attempts?: TopicAttemptPeek[];
}) {
  const tone = SIGNAL_TONE[signal.signal];

  return (
    <PageEnter stage={1}>
      <section
        aria-label="Topic progress"
        className="space-y-4 border-b border-[var(--folio-hairline)] py-6"
      >
        <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="space-y-2">
            <Text as="h2" face="display" size="xl">
              Your signal on this topic
            </Text>
            <Text as="p" size="sm" tone="muted">
              Mastery from marked attempts here only — not the whole course.
            </Text>
            <Link
              href={`/student/courses/${courseId}/progress`}
              className="inline-block font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] uppercase tracking-[var(--folio-tracking-label)] text-[var(--folio-ink-faint)] hover:text-[var(--folio-signal)]"
            >
              Full course progress
            </Link>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <StateCrossfade stateKey={signal.signal}>
              <Text as="p" face="label" className={tone}>
                {signal.label}
              </Text>
            </StateCrossfade>
            <div className="text-left sm:text-right">
              <NumberTick
                value={signal.mastery}
                format={(n) => n.toFixed(0)}
                className={`block text-5xl leading-none tracking-[var(--folio-tracking-tight)] ${tone}`}
              />
              <Text as="p" face="label" tone="faint" className="mt-2">
                Mastery
              </Text>
            </div>
            <div className="flex gap-5 font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] tabular-nums text-[var(--folio-ink-faint)]">
              <span>
                <span className="text-[var(--folio-ink)]">
                  {signal.attempts}
                </span>{' '}
                attempts
              </span>
              <span>
                <span className="text-[var(--folio-ink)]">{signal.correct}</span>{' '}
                correct
              </span>
            </div>
          </div>
        </div>

        <AttemptRhythm attempts={attempts} />
      </section>
    </PageEnter>
  );
}
