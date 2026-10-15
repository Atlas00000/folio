'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { StateCrossfade, PageEnter } from '@/design/motion';
import { EmptyState, Skeleton } from '@/design/patterns';
import {
  buildProgressStats,
  loadProgressPage,
} from './loadProgressPage';
import type { ProgressPageData } from './types';
import { ProgressMasthead } from './ProgressMasthead';
import { ProgressStatsStrip } from './ProgressStatsStrip';
import { ProgressTopicLedger } from './ProgressTopicLedger';

const MasterySpine = dynamic(
  () => import('../viz').then((m) => m.MasterySpine),
  { ssr: false },
);
const AttemptVolumeSpark = dynamic(
  () => import('../viz').then((m) => m.AttemptVolumeSpark),
  { ssr: false },
);
const CorrectRateBars = dynamic(
  () => import('../viz').then((m) => m.CorrectRateBars),
  { ssr: false },
);

type Phase = 'loading' | 'ready' | 'error';

export function ProgressHome({ courseId }: { courseId: string }) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [data, setData] = useState<ProgressPageData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setPhase('loading');
    setError(null);

    loadProgressPage(courseId)
      .then((next) => {
        if (cancelled) return;
        setData(next);
        setPhase('ready');
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Failed to load progress');
        setPhase('error');
      });

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  return (
    <StateCrossfade
      stateKey={phase}
      className="block w-full space-y-10"
    >
      {phase === 'loading' ? <ProgressSkeleton /> : null}
      {phase === 'error' ? (
        <EmptyState
          title="Could not load progress"
          description={error ?? 'Try again shortly.'}
        />
      ) : null}
      {phase === 'ready' && data ? <ProgressReady data={data} /> : null}
    </StateCrossfade>
  );
}

function ProgressReady({ data }: { data: ProgressPageData }) {
  const stats = buildProgressStats(data.spine);

  return (
    <div className="space-y-10">
      <ProgressMasthead course={data.course} />
      <ProgressStatsStrip stats={stats} />

      {data.spine.length > 0 ? (
        <PageEnter stage={1} className="space-y-10">
          <MasterySpine points={data.spine} variant="full" />
          <AttemptVolumeSpark points={data.spine} />
          <CorrectRateBars points={data.spine} />
        </PageEnter>
      ) : null}

      <ProgressTopicLedger points={data.spine} />
    </div>
  );
}

function ProgressSkeleton() {
  return (
    <div className="space-y-10" aria-busy="true" aria-label="Loading progress">
      <div className="space-y-3 border-b border-[var(--folio-hairline)] pb-6">
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid grid-cols-3 gap-px sm:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}
