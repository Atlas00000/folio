'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { listTutorFlags, previewTutor } from '@/lib/api/tutor';
import { Button, Empty, ErrorNote, Panel, TextArea } from '@/components/ui';

export default function LecturerTutorPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [flags, setFlags] = useState<unknown[]>([]);
  const [preview, setPreview] = useState<unknown>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    listTutorFlags(courseId)
      .then((r) => setFlags(Array.isArray(r) ? r : []))
      .catch(() => setFlags([]));
  }, [courseId]);

  async function onPreview(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      const res = await previewTutor(courseId, {
        message: String(fd.get('message') || ''),
      });
      setPreview(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Preview failed');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Tutor oversight</h1>
        <p className="text-[var(--ink-muted)]">Preview grounded replies and review flags.</p>
      </div>
      <ErrorNote>{error}</ErrorNote>
      <Panel title="Preview">
        <form onSubmit={onPreview} className="space-y-3">
          <TextArea id="message" name="message" label="Sample student question" required />
          <Button type="submit">Preview reply</Button>
        </form>
        {preview ? (
          <pre className="mt-3 overflow-auto rounded-md bg-[var(--wash)] p-3 text-xs">
            {JSON.stringify(preview, null, 2)}
          </pre>
        ) : null}
      </Panel>
      <Panel title="Flags">
        {flags.length === 0 ? (
          <Empty>No flagged threads.</Empty>
        ) : (
          <pre className="overflow-auto text-xs">{JSON.stringify(flags, null, 2)}</pre>
        )}
      </Panel>
    </div>
  );
}
