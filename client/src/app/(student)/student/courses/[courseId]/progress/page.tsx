'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { myProgress } from '@/lib/api/progress';
import type { ProgressRow } from '@/lib/types';
import { Empty, ErrorNote, Panel } from '@/components/ui';

export default function ProgressPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [rows, setRows] = useState<ProgressRow[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    myProgress(courseId)
      .then(setRows)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'));
  }, [courseId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Your progress</h1>
        <p className="text-[var(--ink-muted)]">Mastery by topic from marked attempts.</p>
      </div>
      <ErrorNote>{error}</ErrorNote>
      <Panel>
        {rows.length === 0 ? (
          <Empty>No progress yet — try a practice question.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--rule)] text-[var(--ink-muted)]">
                  <th className="py-2 pr-3 font-medium">Topic</th>
                  <th className="py-2 pr-3 font-medium">Attempts</th>
                  <th className="py-2 pr-3 font-medium">Correct</th>
                  <th className="py-2 font-medium">Mastery</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.topicId} className="border-b border-[var(--rule)]/70">
                    <td className="py-2 pr-3">{r.topicTitle || r.topicId.slice(0, 8)}</td>
                    <td className="py-2 pr-3">{r.attemptCount}</td>
                    <td className="py-2 pr-3">{r.correctCount}</td>
                    <td className="py-2">{Number(r.masteryScore).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
