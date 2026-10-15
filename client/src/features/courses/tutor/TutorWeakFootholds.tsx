import { Text } from '@/design/primitives';
import { PageEnter } from '@/design/motion';
import { weakFootholds } from './loadTutorPage';
import type { TutorPageData } from './types';

export function TutorWeakFootholds({
  data,
  onAskAbout,
}: {
  data: TutorPageData;
  onAskAbout: (prompt: string) => void;
}) {
  const rows = weakFootholds(data);
  if (rows.length === 0) return null;

  return (
    <PageEnter stage={3} className="space-y-3">
      <div className="flex items-end justify-between gap-3 border-b border-[var(--folio-hairline)] pb-2">
        <div>
          <Text as="h2" face="display" size="lg">
            Ask from a weak or untried topic
          </Text>
          <Text as="p" size="sm" tone="muted" className="mt-1">
            Prefills the ask from your real progress signals.
          </Text>
        </div>
      </div>

      <ul className="list-none p-0">
        {rows.map((r) => (
          <li key={r.topicId}>
            <button
              type="button"
              onClick={() => onAskAbout(r.prompt)}
              className="group flex w-full items-baseline justify-between gap-4 border-b border-[var(--folio-hairline)] py-3 text-left transition-colors hover:border-[var(--folio-hairline-strong)]"
            >
              <span className="min-w-0">
                <Text as="span" face="mono" size="xs" tone="signal">
                  {String(r.sequence).padStart(2, '0')}
                </Text>{' '}
                <Text
                  as="span"
                  size="sm"
                  className="group-hover:text-[var(--folio-signal)]"
                >
                  {r.title}
                </Text>
              </span>
              <Text
                as="span"
                face="label"
                className={
                  r.attempts === 0
                    ? 'text-[var(--folio-ink-faint)]'
                    : 'text-[var(--folio-warn)]'
                }
              >
                {r.attempts === 0 ? 'Untried' : 'Revisit'}
              </Text>
            </button>
          </li>
        ))}
      </ul>
    </PageEnter>
  );
}
