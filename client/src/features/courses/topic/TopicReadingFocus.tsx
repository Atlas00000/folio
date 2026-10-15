import { Text } from '@/design/primitives';
import { PageEnter } from '@/design/motion';
import type { TopicReading } from './types';

function labelForMaterialType(type: string) {
  if (!type) return 'Material';
  return type.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function TopicReadingFocus({ reading }: { reading: TopicReading | null }) {
  if (!reading?.body) return null;

  return (
    <PageEnter stage={1} className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--folio-hairline)] pb-2">
        <div>
          <Text as="h2" face="display" size="xl">
            Reading focus
          </Text>
          <Text as="p" size="sm" tone="muted" className="mt-1">
            {reading.material.title}
          </Text>
        </div>
        <Text as="p" face="label" tone="faint">
          {labelForMaterialType(reading.material.type)}
          {reading.material.version != null
            ? ` · v${reading.material.version}`
            : ''}
        </Text>
      </div>

      <div
        className="relative overflow-hidden border-y border-[var(--folio-hairline-strong)] py-6"
        style={{
          backgroundImage:
            'linear-gradient(var(--folio-hairline) 1px, transparent 1px)',
          backgroundSize: '100% 1.75rem',
        }}
      >
        <Text
          as="p"
          size="md"
          className="relative max-w-3xl whitespace-pre-wrap leading-[1.75]"
        >
          {reading.body}
        </Text>
      </div>
    </PageEnter>
  );
}
