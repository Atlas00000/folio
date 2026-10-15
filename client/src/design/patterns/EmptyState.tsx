import type { ReactNode } from 'react';
import { Text } from '@/design/primitives';

/**
 * Copy-only empty state. No illustration slot, no emoji.
 */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="border border-dashed border-[var(--folio-hairline-strong)] bg-[var(--folio-void)]/40 px-5 py-8">
      <Text as="h3" face="display" size="xl" className="mb-2">
        {title}
      </Text>
      {description ? (
        <Text as="p" size="sm" tone="muted" className="max-w-md">
          {description}
        </Text>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
