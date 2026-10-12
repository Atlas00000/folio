'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { joinCourse } from '@/lib/api/enrolments';
import { Button, ErrorNote, Field, Panel } from '@/components/ui';

export default function JoinPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    try {
      const res = (await joinCourse(String(fd.get('joinCode') || ''))) as {
        courseId?: string;
        course?: { id: string };
      };
      const id = res.courseId || res.course?.id;
      router.push(id ? `/student/courses/${id}` : '/student/courses');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Join failed');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Join a course</h1>
        <p className="text-[var(--ink-muted)]">Enter the join code from your lecturer.</p>
      </div>
      <Panel>
        <form onSubmit={onSubmit} className="max-w-sm space-y-4">
          <Field id="joinCode" name="joinCode" label="Join code" required />
          <ErrorNote>{error}</ErrorNote>
          <Button type="submit" disabled={pending}>
            {pending ? 'Joining…' : 'Join'}
          </Button>
        </form>
      </Panel>
    </div>
  );
}
