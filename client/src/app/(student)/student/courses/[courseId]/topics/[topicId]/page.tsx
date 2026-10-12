'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getTopic } from '@/lib/api/topics';
import { listMaterials, materialDownloadUrl } from '@/lib/api/materials';
import { listQuestions } from '@/lib/api/questions';
import type { Material, Question, Topic } from '@/lib/types';
import { Empty, ErrorNote, Panel } from '@/components/ui';

export default function StudentTopicPage() {
  const { courseId, topicId } = useParams<{
    courseId: string;
    topicId: string;
  }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      getTopic(courseId, topicId),
      listMaterials(courseId, topicId),
      listQuestions(courseId, topicId),
    ])
      .then(([t, m, q]) => {
        setTopic(t);
        setMaterials(m);
        setQuestions(q);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'));
  }, [courseId, topicId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">
          {topic?.title || 'Topic'}
        </h1>
        <p className="text-[var(--ink-muted)]">{topic?.description}</p>
      </div>
      <ErrorNote>{error}</ErrorNote>
      <Panel title="Materials">
        {materials.length === 0 ? (
          <Empty>No published materials.</Empty>
        ) : (
          <ul className="space-y-3">
            {materials.map((m) => (
              <li key={m.id} className="space-y-1">
                <div className="font-medium">
                  {m.title}{' '}
                  <span className="text-xs text-[var(--ink-muted)]">({m.type})</span>
                </div>
                {m.body ? (
                  <p className="whitespace-pre-wrap text-sm text-[var(--ink-muted)]">
                    {m.body}
                  </p>
                ) : null}
                {m.externalUrl ? (
                  <a
                    className="text-sm text-[var(--accent)]"
                    href={m.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open link
                  </a>
                ) : null}
                {m.type === 'pdf' || m.type === 'docx' || m.type === 'slides' ? (
                  <a
                    className="ml-3 text-sm text-[var(--accent)]"
                    href={materialDownloadUrl(courseId, m.id)}
                  >
                    Download
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <Panel title="Practice">
        {questions.length === 0 ? (
          <Empty>No published questions.</Empty>
        ) : (
          <ul className="space-y-2">
            {questions.map((q) => (
              <li key={q.id}>
                <Link
                  href={`/student/courses/${courseId}/practice/${q.id}?topicId=${topicId}`}
                  className="hover:text-[var(--accent)]"
                >
                  [{q.type}] {q.prompt.slice(0, 120)}
                  {q.prompt.length > 120 ? '…' : ''}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
