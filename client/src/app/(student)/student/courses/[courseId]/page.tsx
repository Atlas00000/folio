'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getCourse } from '@/lib/api/courses';
import { listTopics } from '@/lib/api/topics';
import type { Course, Topic } from '@/lib/types';
import { Empty, ErrorNote, NavLink, Panel } from '@/components/ui';

export default function StudentCoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getCourse(courseId), listTopics(courseId)])
      .then(([c, t]) => {
        setCourse(c);
        setTopics(t);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'));
  }, [courseId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl">
            {course ? `${course.code}` : 'Course'}
          </h1>
          <p className="text-[var(--ink-muted)]">{course?.title}</p>
        </div>
        <div className="flex gap-3 text-sm">
          <NavLink href={`/student/courses/${courseId}/progress`}>Progress</NavLink>
          <NavLink href={`/student/courses/${courseId}/tutor`}>Tutor</NavLink>
        </div>
      </div>
      <ErrorNote>{error}</ErrorNote>
      <Panel title="Topics">
        {topics.length === 0 ? (
          <Empty>No topics published yet.</Empty>
        ) : (
          <ul className="space-y-2">
            {topics
              .slice()
              .sort((a, b) => a.sequence - b.sequence)
              .map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/student/courses/${courseId}/topics/${t.id}`}
                    className="hover:text-[var(--accent)]"
                  >
                    {t.sequence}. {t.title}
                  </Link>
                </li>
              ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
