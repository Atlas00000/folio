'use client';

/**
 * Asymmetric mono tick rail — visual heartbeat for loading / missing states.
 */
export function TickRail({
  count = 12,
  tone = 'signal',
}: {
  count?: number;
  tone?: 'signal' | 'halt';
}) {
  const color =
    tone === 'halt' ? 'var(--folio-halt)' : 'var(--folio-signal)';

  return (
    <div
      className="flex h-12 items-end gap-[3px]"
      aria-hidden
      role="presentation"
    >
      {Array.from({ length: count }).map((_, i) => {
        const h = 20 + ((i * 17) % 28);
        return (
          <span
            key={i}
            className="folio-special-tick inline-block w-[3px] rounded-[1px]"
            style={{
              height: h,
              background: color,
              opacity: 0.35 + (i % 5) * 0.1,
              animationDelay: `${i * 90}ms`,
            }}
          />
        );
      })}
    </div>
  );
}
