'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCourse } from '@/lib/api/courses';
import { Button, ErrorNote, Field, Panel, TextArea } from '@/components/ui';

export default function NewCoursePage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    try {
      const course = await createCourse({
        code: String(fd.get('code') || ''),
        title: String(fd.get('title') || ''),
        term: String(fd.get('term') || ''),
        description: String(fd.get('description') || '') || undefined,
      });
      router.push(`/lecturer/courses/${course.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl">New course</h1>
      <Panel>
        <form onSubmit={onSubmit} className="max-w-lg space-y-4">
          <Field id="code" name="code" label="Code" required placeholder="ACC101" />
          <Field id="title" name="title" label="Title" required />
          <Field id="term" name="term" label="Term" required placeholder="2026-T1" />
          <TextArea id="description" name="description" label="Description" />
          <ErrorNote>{error}</ErrorNote>
          <Button type="submit" disabled={pending}>
            {pending ? 'Creating…' : 'Create course'}
          </Button>
        </form>
      </Panel>
    </div>
  );
}
