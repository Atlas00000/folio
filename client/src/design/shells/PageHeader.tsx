import type { ReactNode } from 'react';
import { Text } from '@/design/primitives';
import { PageEnter } from '@/design/motion';

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <PageEnter
      className="mb-8 flex flex-col gap-4 border-b border-[var(--folio-hairline)] pb-6 sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="min-w-0 space-y-2">
        {eyebrow ? (
          <Text as="p" face="label" tone="signal">
            {eyebrow}
          </Text>
        ) : null}
        <Text as="h1" face="display" size="3xl" className="leading-[var(--folio-leading-tight)]">
          {title}
        </Text>
        {description ? (
          <Text as="p" size="md" tone="muted" className="max-w-xl">
            {description}
          </Text>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </PageEnter>
  );
}
