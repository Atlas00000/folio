'use client';

import { FormEvent, useState } from 'react';
import { useParams } from 'next/navigation';
import { askTutor } from '@/lib/api/tutor';
import { Button, ErrorNote, Panel, TextArea } from '@/components/ui';

type TutorReply = {
  reply: string;
  citations: { title: string; locator: string }[];
  insufficientEvidence?: boolean;
  state: string;
};

export default function TutorPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [error, setError] = useState('');
  const [reply, setReply] = useState<TutorReply | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    try {
      const res = await askTutor(courseId, {
        message: String(fd.get('message') || ''),
      });
      setReply(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tutor unavailable');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Grounded tutor</h1>
        <p className="text-[var(--ink-muted)]">
          Hint-first help grounded in published course materials only.
        </p>
      </div>
      <Panel title="Ask">
        <form onSubmit={onSubmit} className="space-y-4">
          <TextArea
            id="message"
            name="message"
            label="Your question"
            required
            placeholder="Where do I put the capital entry when cash is invested?"
          />
          <ErrorNote>{error}</ErrorNote>
          <Button type="submit" disabled={pending}>
            {pending ? 'Thinking…' : 'Ask tutor'}
          </Button>
        </form>
      </Panel>
      {reply && (
        <Panel title="Reply">
          {reply.insufficientEvidence ? (
            <p className="text-sm text-amber-800">
              Insufficient evidence in published materials to answer confidently.
            </p>
          ) : null}
          <p className="whitespace-pre-wrap text-sm">{reply.reply}</p>
          {reply.citations.length > 0 ? (
            <ul className="mt-4 space-y-1 text-sm text-[var(--ink-muted)]">
              {reply.citations.map((c, i) => (
                <li key={i}>
                  {c.title} — {c.locator}
                </li>
              ))}
            </ul>
          ) : null}
        </Panel>
      )}
    </div>
  );
}
