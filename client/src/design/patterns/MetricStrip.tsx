import { Text } from '@/design/primitives';
import { NumberTick, PageEnter } from '@/design/motion';

export type MetricItem = {
  label: string;
  value: number | string;
  hint?: string;
};

/**
 * Asymmetric metric strip — first item leads wider; not equal card tiles.
 */
export function MetricStrip({
  items,
  className = '',
}: {
  items: MetricItem[];
  className?: string;
}) {
  return (
    <PageEnter
      stage={1}
      className={`grid gap-px overflow-hidden rounded-[var(--folio-radius-md)] border border-[var(--folio-hairline)] bg-[var(--folio-hairline)] sm:grid-cols-[1.4fr_repeat(auto-fit,minmax(7rem,1fr))] ${className}`}
    >
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`bg-[var(--folio-plane)] px-4 py-3 ${i === 0 ? 'sm:py-4' : ''}`}
        >
          <Text as="p" face="label" tone="faint" className="mb-1">
            {item.label}
          </Text>
          {typeof item.value === 'number' ? (
            <NumberTick
              value={item.value}
              className={`text-[var(--folio-ink)] ${i === 0 ? 'text-2xl' : 'text-lg'}`}
            />
          ) : (
            <Text
              as="p"
              face="mono"
              size={i === 0 ? '2xl' : 'lg'}
              className="leading-none"
            >
              {item.value}
            </Text>
          )}
          {item.hint ? (
            <Text as="p" size="xs" tone="muted" className="mt-1">
              {item.hint}
            </Text>
          ) : null}
        </div>
      ))}
    </PageEnter>
  );
}
