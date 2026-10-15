'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { askTutor } from '@/lib/api/tutor';
import { listQuestions } from '@/lib/api/questions';
import { StateCrossfade } from '@/design/motion';
import { EmptyState, Skeleton } from '@/design/patterns';
import { Text } from '@/design/primitives';
import {
  buildSuggestedPrompts,
  loadTutorPage,
  resolveTutorContext,
} from './loadTutorPage';
import type {
  TutorContext,
  TutorPageData,
  TutorReply,
} from './types';
import { TutorMasthead } from './TutorMasthead';
import { TutorGroundingCharter } from './TutorGroundingCharter';
import { TutorContextChip } from './TutorContextChip';
import { TutorAskBlotter } from './TutorAskBlotter';
import { TutorReplyInstrument } from './TutorReplyInstrument';
import { TutorCitationLedger } from './TutorCitationLedger';
import { TutorAfterHintActions } from './TutorAfterHintActions';
import { TutorCoveragePeek } from './TutorCoveragePeek';
import { TutorWeakFootholds } from './TutorWeakFootholds';

type Phase = 'loading' | 'ready' | 'error';

export function TutorHome({ courseId }: { courseId: string }) {
  const search = useSearchParams();
  const topicIdParam = search.get('topicId');
  const questionIdParam = search.get('questionId');

  const [phase, setPhase] = useState<Phase>('loading');
  const [data, setData] = useState<TutorPageData | null>(null);
  const [context, setContext] = useState<TutorContext>({
    topicId: topicIdParam,
    questionId: questionIdParam,
    topic: null,
    question: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [askError, setAskError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);
  const [reply, setReply] = useState<TutorReply | null>(null);
  const [practiceHref, setPracticeHref] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setPhase('loading');
    setError(null);

    (async () => {
      try {
        const home = await loadTutorPage(courseId);
        if (cancelled) return;
        setData(home);
        const ctx = await resolveTutorContext(
          courseId,
          topicIdParam,
          questionIdParam,
          home.topics,
        );
        if (cancelled) return;
        setContext(ctx);
        setPhase('ready');
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load tutor');
          setPhase('error');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [courseId, topicIdParam, questionIdParam]);

  useEffect(() => {
    if (!data?.continueTarget) {
      setPracticeHref(null);
      return;
    }
    const target = data.continueTarget;
    let cancelled = false;
    listQuestions(courseId, target.topic.topicId)
      .then((qs) => {
        if (cancelled) return;
        const first =
          qs.find((q) => q.status === 'published') ?? qs[0] ?? null;
        setPracticeHref(
          first
            ? `/student/courses/${courseId}/practice/${first.id}?topicId=${target.topic.topicId}`
            : null,
        );
      })
      .catch(() => {
        if (!cancelled) setPracticeHref(null);
      });
    return () => {
      cancelled = true;
    };
  }, [courseId, data?.continueTarget]);

  const prompts = useMemo(
    () => (data ? buildSuggestedPrompts(data) : []),
    [data],
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setPending(true);
    setAskError(null);
    try {
      const res = await askTutor(courseId, {
        message: message.trim(),
        questionId: context.questionId ?? undefined,
      });
      setReply(res);
    } catch (err) {
      setAskError(err instanceof Error ? err.message : 'Tutor unavailable');
    } finally {
      setPending(false);
    }
  }

  return (
    <StateCrossfade stateKey={phase} className="block w-full space-y-10">
      {phase === 'loading' ? <TutorSkeleton /> : null}
      {phase === 'error' ? (
        <EmptyState
          title="Could not load the learning assistant"
          description={error ?? 'Try again shortly.'}
        />
      ) : null}
      {phase === 'ready' && data ? (
        <div className="space-y-10">
          <TutorMasthead course={data.course} />
          <TutorGroundingCharter />
          <TutorContextChip courseId={courseId} context={context} />

          <TutorAskBlotter
            message={message}
            onMessageChange={setMessage}
            prompts={prompts}
            pending={pending}
            onSubmit={onSubmit}
          />
          {askError ? (
            <Text as="p" size="sm" className="text-[var(--folio-halt)]">
              {askError}
            </Text>
          ) : null}

          <TutorReplyInstrument reply={reply} />
          <TutorCitationLedger
            courseId={courseId}
            citations={reply?.citations ?? []}
            materials={data.materials}
          />
          <TutorAfterHintActions
            courseId={courseId}
            reply={reply}
            materials={data.materials}
            continueTarget={data.continueTarget}
            practiceHref={
              context.question && context.topic
                ? `/student/courses/${courseId}/practice/${context.question.id}?topicId=${context.topic.id}`
                : practiceHref
            }
          />

          <div className="grid gap-10 border-t border-[var(--folio-hairline)] pt-8 sm:grid-cols-2 sm:gap-12">
            <TutorCoveragePeek
              courseId={courseId}
              materials={data.materials}
            />
            <TutorWeakFootholds data={data} onAskAbout={setMessage} />
          </div>
        </div>
      ) : null}
    </StateCrossfade>
  );
}

function TutorSkeleton() {
  return (
    <div className="space-y-10" aria-busy="true" aria-label="Loading tutor">
      <div className="space-y-3 border-b border-[var(--folio-hairline)] pb-6">
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
