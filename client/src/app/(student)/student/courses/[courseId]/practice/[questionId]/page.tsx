'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { listQuestions } from '@/lib/api/questions';
import {
  revealAnswer,
  requestHint,
  submitAttempt,
} from '@/lib/api/attempts';
import type { AttemptSubmitResponse, JournalLine, Question } from '@/lib/types';
import { Button, Empty, ErrorNote, Field, Panel, Select } from '@/components/ui';

export default function PracticePage() {
  const { courseId, questionId } = useParams<{
    courseId: string;
    questionId: string;
  }>();
  const topicId = useSearchParams().get('topicId') || '';
  const [question, setQuestion] = useState<Question | null>(null);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AttemptSubmitResponse | null>(null);
  const [hint, setHint] = useState('');
  const [reveal, setReveal] = useState<unknown>(null);
  const [lines, setLines] = useState<JournalLine[]>([
    { account: '', direction: 'debit', amount: '' },
    { account: '', direction: 'credit', amount: '' },
  ]);

  useEffect(() => {
    if (!topicId) return;
    listQuestions(courseId, topicId)
      .then((qs) => setQuestion(qs.find((q) => q.id === questionId) || null))
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'));
  }, [courseId, topicId, questionId]);

  const canHint = result?.next?.canRequestHint;
  const canReveal = result?.next?.canReveal;

  const title = useMemo(
    () => question?.prompt || 'Practice question',
    [question],
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const fd = new FormData(e.currentTarget);
    try {
      let body: {
        selectedOptionId?: string;
        value?: string;
        lines?: JournalLine[];
      } = {};
      if (question?.type === 'mcq') {
        body = { selectedOptionId: String(fd.get('selectedOptionId') || '') };
      } else if (question?.type === 'numerical') {
        body = { value: String(fd.get('value') || '') };
      } else {
        body = { lines };
      }
      const res = await submitAttempt(courseId, questionId, body);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submit failed');
    }
  }

  if (!topicId) {
    return <Empty>Open this question from a topic list so the topic is known.</Empty>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-wide text-[var(--accent)]">
          {question?.type || 'question'}
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl">
          {title}
        </h1>
      </div>
      <ErrorNote>{error}</ErrorNote>
      <Panel title="Your answer">
        {!question ? (
          <Empty>Loading question…</Empty>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {question.type === 'mcq' && (
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-[var(--ink-muted)]">
                  Options
                </legend>
                {(question.options || []).map((o) => (
                  <label key={o.id} className="flex items-center gap-2 text-sm">
                    <input type="radio" name="selectedOptionId" value={o.id} required />
                    {o.label}
                  </label>
                ))}
              </fieldset>
            )}
            {question.type === 'numerical' && (
              <Field id="value" name="value" label="Answer" required />
            )}
            {question.type === 'journal' && (
              <div className="space-y-3">
                {lines.map((line, idx) => (
                  <div
                    key={idx}
                    className="grid gap-2 md:grid-cols-3"
                  >
                    <Field
                      id={`account-${idx}`}
                      label="Account"
                      value={line.account}
                      onChange={(e) => {
                        const next = [...lines];
                        next[idx] = { ...next[idx], account: e.target.value };
                        setLines(next);
                      }}
                      required
                    />
                    <Select
                      id={`dir-${idx}`}
                      label="Direction"
                      value={line.direction}
                      onChange={(e) => {
                        const next = [...lines];
                        next[idx] = {
                          ...next[idx],
                          direction: e.target.value as 'debit' | 'credit',
                        };
                        setLines(next);
                      }}
                    >
                      <option value="debit">Debit</option>
                      <option value="credit">Credit</option>
                    </Select>
                    <Field
                      id={`amt-${idx}`}
                      label="Amount"
                      value={line.amount}
                      onChange={(e) => {
                        const next = [...lines];
                        next[idx] = { ...next[idx], amount: e.target.value };
                        setLines(next);
                      }}
                      required
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    setLines([
                      ...lines,
                      { account: '', direction: 'debit', amount: '' },
                    ])
                  }
                >
                  Add line
                </Button>
              </div>
            )}
            <Button type="submit">Submit attempt</Button>
          </form>
        )}
      </Panel>
      {result && (
        <Panel title="Feedback">
          <p className="font-medium">
            {result.mark.correct ? 'Correct' : 'Not quite'} · score{' '}
            {result.mark.score}
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {result.mark.feedback.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            {canHint && (
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  requestHint(courseId, questionId)
                    .then((r) => setHint(r.hint))
                    .catch((e) =>
                      setError(e instanceof Error ? e.message : 'Hint failed'),
                    )
                }
              >
                Request hint
              </Button>
            )}
            {canReveal && (
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  revealAnswer(courseId, questionId)
                    .then(setReveal)
                    .catch((e) =>
                      setError(e instanceof Error ? e.message : 'Reveal failed'),
                    )
                }
              >
                Reveal
              </Button>
            )}
          </div>
          {hint ? (
            <p className="mt-3 rounded-md bg-[var(--wash)] px-3 py-2 text-sm">
              Hint: {hint}
            </p>
          ) : null}
          {reveal ? (
            <pre className="mt-3 overflow-auto rounded-md bg-[var(--wash)] p-3 text-xs">
              {JSON.stringify(reveal, null, 2)}
            </pre>
          ) : null}
        </Panel>
      )}
    </div>
  );
}
