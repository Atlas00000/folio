'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getCourse } from '@/lib/api/courses';
import { createTopic, listTopics } from '@/lib/api/topics';
import { listEnrolments } from '@/lib/api/enrolments';
import type { Course, Topic } from '@/lib/types';
import {
  Button,
  Empty,
  ErrorNote,
  Field,
  NavLink,
  Panel,
} from '@/components/ui';

export default function LecturerCoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [enrolments, setEnrolments] = useState<unknown[]>([]);
  const [error, setError] = useState('');

  async function reload() {
    const [c, t, e] = await Promise.all([
      getCourse(courseId),
      listTopics(courseId),
      listEnrolments(courseId),
    ]);
    setCourse(c);
    setTopics(t);
    setEnrolments(Array.isArray(e) ? e : []);
  }

  useEffect(() => {
    reload().catch((err) =>
      setError(err instanceof Error ? err.message : 'Failed'),
    );
  }, [courseId]);

  async function onAddTopic(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await createTopic(courseId, {
        title: String(fd.get('title') || ''),
        sequence: Number(fd.get('sequence') || topics.length + 1),
      });
      e.currentTarget.reset();
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Topic create failed');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl">
            {course?.code || 'Course'}
          </h1>
          <p className="text-[var(--ink-muted)]">
            {course?.title}
            {course?.joinCode ? ` · join code ${course.joinCode}` : ''}
          </p>
        </div>
        <div className="flex gap-3 text-sm">
          <NavLink href={`/lecturer/courses/${courseId}/analytics`}>
            Analytics
          </NavLink>
          <NavLink href={`/lecturer/courses/${courseId}/tutor`}>Tutor flags</NavLink>
        </div>
      </div>
      <ErrorNote>{error}</ErrorNote>
      <Panel title="Topics">
        {topics.length === 0 ? (
          <Empty>No topics yet.</Empty>
        ) : (
          <ul className="mb-4 space-y-2">
            {topics
              .slice()
              .sort((a, b) => a.sequence - b.sequence)
              .map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/lecturer/courses/${courseId}/topics/${t.id}`}
                    className="hover:text-[var(--accent)]"
                  >
                    {t.sequence}. {t.title}
                  </Link>
                </li>
              ))}
          </ul>
        )}
        <form onSubmit={onAddTopic} className="grid gap-3 md:grid-cols-[1fr_6rem_auto]">
          <Field id="title" name="title" label="New topic title" required />
          <Field id="sequence" name="sequence" label="Seq" type="number" defaultValue={topics.length + 1} />
          <div className="flex items-end">
            <Button type="submit">Add topic</Button>
          </div>
        </form>
      </Panel>
      <Panel title="Enrolments">
        {enrolments.length === 0 ? (
          <Empty>No students enrolled yet.</Empty>
        ) : (
          <ul className="space-y-1 text-sm">
            {enrolments.map((row, i) => {
              const r = row as {
                user?: { email?: string; displayName?: string };
                email?: string;
                role?: string;
              };
              return (
                <li key={i}>
                  {r.user?.displayName || r.email || 'Student'}{' '}
                  <span className="text-[var(--ink-muted)]">
                    {r.user?.email || ''} {r.role || ''}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </div>
  );
}
