'use client';

import { FormEvent } from 'react';
import { Button, Text, TextArea } from '@/design/primitives';
import { PageEnter } from '@/design/motion';
import type { SuggestedPrompt } from './types';

export function TutorAskBlotter({
  message,
  onMessageChange,
  prompts,
  pending,
  onSubmit,
}: {
  message: string;
  onMessageChange: (value: string) => void;
  prompts: SuggestedPrompt[];
  pending: boolean;
  onSubmit: (e: FormEvent) => void;
}) {
  return (
    <PageEnter stage={1} className="space-y-4">
      <div className="flex items-end justify-between gap-3 border-b border-[var(--folio-hairline)] pb-2">
        <div>
          <Text as="h2" face="display" size="xl">
            Ask
          </Text>
          <Text as="p" size="sm" tone="muted" className="mt-1">
            Phrase a stuck point — the reply is a hint, not a mark.
          </Text>
        </div>
      </div>

      {prompts.length > 0 ? (
        <div className="space-y-2">
          <Text as="p" face="label" tone="faint">
            Suggested from this course
          </Text>
          <ul className="flex list-none flex-wrap gap-2 p-0">
            {prompts.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => onMessageChange(p.message)}
                  className="max-w-xs truncate border border-[var(--folio-hairline)] px-3 py-1.5 text-left font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] text-[var(--folio-ink-muted)] transition-colors hover:border-[var(--folio-signal)]/40 hover:text-[var(--folio-signal)]"
                >
                  {p.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-4">
        <TextArea
          id="tutor-message"
          name="message"
          label="Your question"
          required
          minLength={3}
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Where do I put the capital entry when cash is invested?"
        />
        <Button type="submit" disabled={pending || message.trim().length < 3}>
          {pending ? 'Retrieving…' : 'Ask for a hint'}
        </Button>
      </form>
    </PageEnter>
  );
}
