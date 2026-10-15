'use client';

/**
 * Sweeping instrument ring — loading: continuous sweep; 404: broken arc.
 */
export function SignalRing({
  mode = 'loading',
  size = 280,
}: {
  mode?: 'loading' | 'missing';
  size?: number;
}) {
  const stroke = mode === 'missing' ? 'var(--folio-halt)' : 'var(--folio-signal)';
  const dim =
    mode === 'missing' ? 'var(--folio-halt-dim)' : 'var(--folio-signal-dim)';

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="var(--folio-hairline-strong)"
          strokeWidth="0.4"
        />
        <circle
          cx="50"
          cy="50"
          r="34"
          fill="none"
          stroke="var(--folio-hairline)"
          strokeWidth="0.3"
          strokeDasharray="1.5 2.5"
        />
        {mode === 'missing' ? (
          <>
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={stroke}
              strokeWidth="1.2"
              strokeLinecap="square"
              strokeDasharray="40 30 20 180"
              className="folio-special-flicker"
            />
            <line
              x1="38"
              y1="38"
              x2="62"
              y2="62"
              stroke={stroke}
              strokeWidth="0.8"
              opacity="0.7"
            />
          </>
        ) : (
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="var(--folio-hairline)"
            strokeWidth="0.6"
          />
        )}
        <circle
          cx="50"
          cy="50"
          r="6"
          fill={dim}
          stroke={stroke}
          strokeWidth="0.5"
        />
      </svg>

      {mode === 'loading' ? (
        <div
          className="folio-special-sweep pointer-events-none absolute inset-0"
          style={{ transformOrigin: '50% 50%' }}
        >
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={stroke}
              strokeWidth="1.4"
              strokeLinecap="square"
              strokeDasharray="26 240"
            />
            <circle cx="50" cy="8" r="1.6" fill={stroke} />
          </svg>
        </div>
      ) : null}

      {mode === 'loading' ? (
        <div
          aria-hidden
          className="folio-special-scan pointer-events-none absolute inset-x-[18%] top-0 h-8 bg-gradient-to-b from-transparent via-[var(--folio-signal)]/30 to-transparent"
        />
      ) : null}
    </div>
  );
}
