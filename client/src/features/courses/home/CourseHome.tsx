'use client';

import { useEffect, useState } from 'react';
import { StateCrossfade } from '@/design/motion';
import { EmptyState, Skeleton } from '@/design/patterns';
import { ContinuePractising } from '../hub/continue';
import { CourseMasthead } from './CourseMasthead';
import { CourseProgressSnapshot } from './CourseProgressSnapshot';
import { CourseTopicLedger } from './CourseTopicLedger';
import { CourseMaterialsPeek } from './CourseMaterialsPeek';
import { CoursePracticeFoothold } from './CoursePracticeFoothold';
import { CourseAssistantRail } from './CourseAssistantRail';
import { buildMasterySpinePoints } from '../viz/buildMasterySpine';
import {
  buildProgressStats,
  buildTopicLedgerRows,
  loadCourseHome,
  loadCoursePeeks,
} from './loadCourseHome';
import type { CourseHomeData, CourseHomePeeks } from './types';

type Phase = 'loading' | 'ready' | 'error';

export function CourseHome({ courseId }: { courseId: string }) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [data, setData] = useState<CourseHomeData | null>(null);
  const [peeks, setPeeks] = useState<CourseHomePeeks | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setPhase('loading');
    setError(null);

    (async () => {
      try {
        const home = await loadCourseHome(courseId);
        if (cancelled) return;
        setData(home);
        setPhase('ready');

        const nextPeeks = await loadCoursePeeks(home);
        if (!cancelled) setPeeks(nextPeeks);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load course');
          setPhase('error');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  return (
    <StateCrossfade stateKey={phase} className="block w-full space-y-10">
      {phase === 'loading' ? <CourseHomeSkeleton /> : null}

      {phase === 'error' ? (
        <EmptyState
          title="Could not load this course"
          description={error ?? 'Try again shortly.'}
        />
      ) : null}

      {phase === 'ready' && data ? (
        <CourseHomeReady data={data} peeks={peeks} />
      ) : null}
    </StateCrossfade>
  );
}

function CourseHomeReady({
  data,
  peeks,
}: {
  data: CourseHomeData;
  peeks: CourseHomePeeks | null;
}) {
  const rows = buildTopicLedgerRows(data);
  const stats = buildProgressStats(data);
  const spine = buildMasterySpinePoints(data);
  const continueTarget = peeks?.continueTarget ?? null;

  return (
    <div className="space-y-10">
      <CourseMasthead course={data.course} />

      <ContinuePractising target={continueTarget} />

      <CourseProgressSnapshot
        courseId={data.course.id}
        stats={stats}
        spine={spine}
      />

      <CourseTopicLedger rows={rows} />

      {continueTarget ? (
        <div className="grid gap-10 border-t border-[var(--folio-hairline)] pt-8 sm:grid-cols-2 sm:gap-12">
          <CourseMaterialsPeek
            materials={peeks?.materials ?? []}
            continueTarget={continueTarget}
          />
          <CoursePracticeFoothold
            question={peeks?.question ?? null}
            href={peeks?.questionHref ?? null}
            continueTarget={continueTarget}
          />
        </div>
      ) : null}

      <CourseAssistantRail
        courseId={data.course.id}
        courseCode={data.course.code}
      />
    </div>
  );
}

function CourseHomeSkeleton() {
  return (
    <div className="space-y-10" aria-busy="true" aria-label="Loading course">
      <div className="space-y-3 border-b border-[var(--folio-hairline)] pb-6">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-8 w-2/3 max-w-md" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      <div className="space-y-3 border-y border-[var(--folio-hairline)] py-8">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-2 gap-px sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
      <div className="space-y-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 border-b border-[var(--folio-hairline)] py-4"
          >
            <Skeleton className="h-6 w-10" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
