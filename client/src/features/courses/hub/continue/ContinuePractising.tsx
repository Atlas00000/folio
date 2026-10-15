'use client';

import { useEffect, useState } from 'react';
import { listQuestions } from '@/lib/api/questions';
import { PageEnter } from '@/design/motion';
import type { ContinueQuestionPeek, ContinueTarget } from './continue-types';
import { ContinueMetaRail } from './ContinueMetaRail';
import { ContinueSignalMark } from './ContinueSignalMark';
import { ContinueActionCluster } from './ContinueActionCluster';

export function ContinuePractising({
  target,
}: {
  target: ContinueTarget | null;
}) {
  const [peek, setPeek] = useState<ContinueQuestionPeek | null>(null);

  useEffect(() => {
    if (!target) {
      setPeek(null);
      return;
    }

    let cancelled = false;
    listQuestions(target.course.id, target.topic.topicId)
      .then((questions) => {
        if (cancelled) return;
        const first = questions.find((q) => q.status === 'published') ?? questions[0];
        if (!first) {
          setPeek(null);
          return;
        }
        setPeek({
          question: first,
          href: `/student/courses/${target.course.id}/practice/${first.id}`,
        });
      })
      .catch(() => {
        if (!cancelled) setPeek(null);
      });

    return () => {
      cancelled = true;
    };
  }, [target]);

  if (!target) return null;

  return (
    <PageEnter stage={1}>
      <section
        aria-label="Continue practising"
        className="relative overflow-hidden"
      >
        {/* Asymmetric atmosphere — hairline mesh, no neon wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              'linear-gradient(var(--folio-hairline) 1px, transparent 1px)',
            backgroundSize: '100% 28px',
            maskImage:
              'linear-gradient(90deg, black 0%, transparent 72%)',
          }}
        />

        <div className="relative grid gap-8 border-y border-[var(--folio-hairline-strong)] py-7 sm:grid-cols-[minmax(0,1.35fr)_minmax(10rem,0.65fr)] sm:items-end sm:gap-10 sm:py-9">
          <ContinueMetaRail target={target} />
          <ContinueSignalMark
            signal={target.signal}
            mastery={target.mastery}
            attempts={target.attempts}
            correct={target.correct}
          />
        </div>

        <ContinueActionCluster target={target} peek={peek} />
      </section>
    </PageEnter>
  );
}
