'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listCourses } from '@/lib/api/courses';
import type { Course } from '@/lib/types';
import { Empty, ErrorNote, Panel } from '@/components/ui';

export default function LecturerCoursesPage() {
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
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Courses</h1>
        <p className="text-[var(--ink-muted)]">Publish topics, materials, and questions.</p>
      </div>
      <ErrorNote>{error}</ErrorNote>
      <Panel>
        {courses.length === 0 ? (
          <Empty>No courses yet. Create one to start.</Empty>
        ) : (
          <ul className="divide-y divide-[var(--rule)]">
            {courses.map((c) => (
              <li key={c.id} className="py-3">
                <Link
                  href={`/lecturer/courses/${c.id}`}
                  className="hover:text-[var(--accent)]"
                >
                  <span className="font-semibold">
                    {c.code} · {c.title}
                  </span>
                  <span className="mt-1 block text-sm text-[var(--ink-muted)]">
                    {c.term}
                    {c.joinCode ? ` · join ${c.joinCode}` : ''}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
