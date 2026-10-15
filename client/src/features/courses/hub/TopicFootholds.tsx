'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Text } from '@/design/primitives';
import { NumberTick, PageEnter } from '@/design/motion';
import type { CourseHubSlice } from './types';

/**
 * Compact topic index — one row per course.
 * Expand a single course for footholds; keeps the hub short.
 */
export function TopicFootholds({ slices }: { slices: CourseHubSlice[] }) {
  const withTopics = slices
    .filter((s) => s.topics.length > 0)
    .map((s) => ({
      ...s,
      topics: [...s.topics].sort((a, b) => a.sequence - b.sequence),
    }));

  const [openId, setOpenId] = useState<string | null>(null);

  if (withTopics.length === 0) return null;

  return (
    <PageEnter stage={1} className="space-y-3">
      <div className="flex items-end justify-between gap-3 border-b border-[var(--folio-hairline)] pb-2">
        <div>
          <Text as="h2" face="display" size="xl">
            Topics
          </Text>
          <Text as="p" size="sm" tone="muted" className="mt-1">
            Peek into a module — full lists live inside each course.
          </Text>
        </div>
        <Text as="p" face="label" tone="faint">
          Index
        </Text>
      </div>

      <ul className="divide-y divide-[var(--folio-hairline)]">
        {withTopics.map(({ course, topics }) => {
          const open = openId === course.id;
          const peek = topics.slice(0, 3);
          const rest = topics.length - peek.length;

          return (
            <li key={course.id}>
              <div className="grid grid-cols-[minmax(4.5rem,6rem)_1fr_auto] items-center gap-3 py-3 sm:gap-5">
                <Text as="span" face="mono" size="sm" className="tabular-nums">
                  {course.code}
                </Text>
                <div className="min-w-0">
                  <Text as="p" size="sm" className="truncate">
                    {course.title}
                  </Text>
                  <Text as="p" face="mono" size="xs" tone="faint" className="mt-0.5">
                    {topics[0]?.title ?? '—'}
                    {topics.length > 1 ? ' · …' : ''}
                  </Text>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="hidden text-right sm:block">
                    <NumberTick
                      value={topics.length}
                      className="text-base text-[var(--folio-ink)]"
                    />
                    <Text as="span" face="label" tone="faint" className="mt-0.5 block">
                      Topics
                    </Text>
                  </div>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenId(open ? null : course.id)}
                    className="rounded-[var(--folio-radius-sm)] border border-[var(--folio-hairline-strong)] px-2.5 py-1 font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] uppercase tracking-[0.08em] text-[var(--folio-ink-muted)] transition-colors hover:border-[var(--folio-signal)]/50 hover:text-[var(--folio-signal)]"
                  >
                    {open ? 'Hide' : 'Peek'}
                  </button>
                  <Link
                    href={`/student/courses/${course.id}`}
                    className="font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] uppercase tracking-[0.08em] text-[var(--folio-ink-faint)] hover:text-[var(--folio-signal)]"
                  >
                    Open
                  </Link>
                </div>
              </div>

              {open ? (
                <div className="mb-3 border-l border-[var(--folio-hairline-strong)] pl-4 sm:ml-[6rem]">
                  <ul className="space-y-1.5 pb-2">
                    {peek.map((topic) => (
                      <li key={topic.id}>
                        <Link
                          href={`/student/courses/${course.id}/topics/${topic.id}`}
                          className="group flex items-baseline gap-3 py-1 text-[length:var(--folio-text-sm)] hover:text-[var(--folio-signal)]"
                        >
                          <span className="font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] tabular-nums text-[var(--folio-ink-faint)]">
                            {String(topic.sequence).padStart(2, '0')}
                          </span>
                          <span>{topic.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {rest > 0 ? (
                    <Link
                      href={`/student/courses/${course.id}`}
                      className="inline-block pb-2 font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] uppercase tracking-[0.08em] text-[var(--folio-ink-faint)] hover:text-[var(--folio-signal)]"
                    >
                      +{rest} more in course
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </PageEnter>
  );
}
