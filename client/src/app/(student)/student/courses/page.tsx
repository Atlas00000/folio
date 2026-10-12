'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listCourses } from '@/lib/api/courses';
import type { Course } from '@/lib/types';
import { Empty, ErrorNote, Panel } from '@/components/ui';

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    listCourses()
      .then(setCourses)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Your courses</h1>
        <p className="text-[var(--ink-muted)]">Open a course to practise and track progress.</p>
      </div>
      <ErrorNote>{error}</ErrorNote>
      <Panel>
        {courses.length === 0 ? (
          <Empty>No enrolments yet. Join with a course code.</Empty>
        ) : (
          <ul className="divide-y divide-[var(--rule)]">
            {courses.map((c) => (
              <li key={c.id} className="py-3 first:pt-0 last:pb-0">
                <Link
                  href={`/student/courses/${c.id}`}
                  className="flex flex-col gap-1 hover:text-[var(--accent)]"
                >
                  <span className="font-semibold">
                    {c.code} · {c.title}
                  </span>
                  <span className="text-sm text-[var(--ink-muted)]">{c.term}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
