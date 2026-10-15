'use client';

import { useEffect, useState } from 'react';
import { StateCrossfade } from '@/design/motion';
import { EmptyState, Skeleton } from '@/design/patterns';
import {
  buildNeighbours,
  buildTopicSignal,
  loadRecentAttempts,
  loadTopicHome,
  loadTopicReading,
  selectPracticeStart,
} from './loadTopicHome';
import type {
  TopicAttemptPeek,
  TopicHomeData,
  TopicReading,
} from './types';
import { TopicMasthead } from './TopicMasthead';
import { TopicProgressSignal } from './TopicProgressSignal';
import { TopicReadingFocus } from './TopicReadingFocus';
import { TopicMaterialsLedger } from './TopicMaterialsLedger';
import { TopicPracticeStart } from './TopicPracticeStart';
import { TopicQuestionLedger } from './TopicQuestionLedger';
import { TopicRecentAttempts } from './TopicRecentAttempts';
import { TopicNeighbours } from './TopicNeighbours';
import { TopicAssistantRail } from './TopicAssistantRail';

type Phase = 'loading' | 'ready' | 'error';

export function TopicHome({
  courseId,
  topicId,
}: {
  courseId: string;
  topicId: string;
}) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [data, setData] = useState<TopicHomeData | null>(null);
  const [reading, setReading] = useState<TopicReading | null>(null);
  const [attempts, setAttempts] = useState<TopicAttemptPeek[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setPhase('loading');
    setError(null);
    setReading(null);
    setAttempts([]);

    (async () => {
      try {
        const home = await loadTopicHome(courseId, topicId);
        if (cancelled) return;
        setData(home);
        setPhase('ready');

        const [nextReading, nextAttempts] = await Promise.all([
          loadTopicReading(home),
          loadRecentAttempts(home),
        ]);
        if (!cancelled) {
          setReading(nextReading);
          setAttempts(nextAttempts);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load topic');
          setPhase('error');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [courseId, topicId]);

  return (
    <StateCrossfade stateKey={`${phase}:${topicId}`} className="block w-full space-y-10">
      {phase === 'loading' ? <TopicHomeSkeleton /> : null}

      {phase === 'error' ? (
        <EmptyState
          title="Could not load this topic"
          description={error ?? 'Try again shortly.'}
        />
      ) : null}

      {phase === 'ready' && data ? (
        <TopicHomeReady
          data={data}
          reading={reading}
          attempts={attempts}
        />
      ) : null}
    </StateCrossfade>
  );
}

function TopicHomeReady({
  data,
  reading,
  attempts,
}: {
  data: TopicHomeData;
  reading: TopicReading | null;
  attempts: TopicAttemptPeek[];
}) {
  const signal = buildTopicSignal(data);
  const neighbours = buildNeighbours(data);
  const start = selectPracticeStart(data);

  return (
    <div className="space-y-10">
      <TopicMasthead course={data.course} topic={data.topic} />

      <TopicProgressSignal
        courseId={data.course.id}
        signal={signal}
        attempts={attempts}
      />

      <TopicReadingFocus reading={reading} />

      <TopicMaterialsLedger
        courseId={data.course.id}
        materials={data.materials}
        focusMaterialId={reading?.body ? reading.material.id : null}
      />

      <TopicPracticeStart
        question={start?.question ?? null}
        href={start?.href ?? null}
        signalLabel={signal.label}
      />

      <TopicQuestionLedger
        courseId={data.course.id}
        topicId={data.topic.id}
        questions={data.questions}
      />

      <TopicRecentAttempts attempts={attempts} />

      <TopicNeighbours
        neighbours={neighbours}
        courseHref={`/student/courses/${data.course.id}`}
      />

      <TopicAssistantRail
        courseId={data.course.id}
        topicTitle={data.topic.title}
      />
    </div>
  );
}

function TopicHomeSkeleton() {
  return (
    <div className="space-y-10" aria-busy="true" aria-label="Loading topic">
      <div className="space-y-3 border-b border-[var(--folio-hairline)] pb-6">
        <Skeleton className="h-3 w-48" />
        <div className="flex gap-4">
          <Skeleton className="h-12 w-12" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-8 w-2/3 max-w-md" />
            <Skeleton className="h-4 w-full max-w-xl" />
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-6 border-b border-[var(--folio-hairline)] py-6">
        <Skeleton className="h-16 w-48" />
        <Skeleton className="h-16 w-24" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-32 w-full" />
      </div>
      <div className="space-y-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 border-b border-[var(--folio-hairline)] py-4"
          >
            <Skeleton className="h-5 w-8" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
