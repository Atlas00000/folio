'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listCourses } from '@/lib/api/courses';
import { listEnrolments } from '@/lib/api/enrolments';
import type { Course } from '@/lib/types';
import { Empty, ErrorNote, Panel } from '@/components/ui';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [enrolments, setEnrolments] = useState<unknown[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    listCourses()
      .then(setCourses)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'));
  }, []);

  useEffect(() => {
    if (!selected) return;
    listEnrolments(selected)
      .then((e) => setEnrolments(Array.isArray(e) ? e : []))
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'));
  }, [selected]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Admin</h1>
        <p className="text-[var(--ink-muted)]">Course enrolments overview.</p>
      </div>
      <ErrorNote>{error}</ErrorNote>
      <Panel title="Courses">
        {courses.length === 0 ? (
          <Empty>No courses.</Empty>
        ) : (
          <ul className="space-y-2">
            {courses.map((c) => (
              <li key={c.id} className="flex flex-wrap gap-3 text-sm">
                <button
                  type="button"
                  className="text-left hover:text-[var(--accent)]"
                  onClick={() => setSelected(c.id)}
                >
                  {c.code} · {c.title}
                </button>
                <Link
                  href={`/lecturer/courses/${c.id}`}
                  className="text-[var(--accent)]"
                >
                  Open as lecturer
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      {selected ? (
        <Panel title="Enrolments">
          <pre className="overflow-auto text-xs">
            {JSON.stringify(enrolments, null, 2)}
          </pre>
        </Panel>
      ) : null}
    </div>
  );
}
