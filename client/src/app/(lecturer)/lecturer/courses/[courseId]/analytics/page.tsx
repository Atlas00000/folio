'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { analyticsCsvUrl, courseAnalytics } from '@/lib/api/progress';
import { Empty, ErrorNote, Panel } from '@/components/ui';

export default function AnalyticsPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    courseAnalytics(courseId)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'));
  }, [courseId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl">Analytics</h1>
          <p className="text-[var(--ink-muted)]">Struggle signals by topic.</p>
        </div>
        <a
          className="text-sm text-[var(--accent)]"
          href={analyticsCsvUrl(courseId)}
        >
          Download CSV
        </a>
      </div>
      <ErrorNote>{error}</ErrorNote>
      <Panel>
        {!data ? (
          <Empty>Loading…</Empty>
        ) : (
          <pre className="overflow-auto text-xs">{JSON.stringify(data, null, 2)}</pre>
        )}
      </Panel>
    </div>
  );
}
