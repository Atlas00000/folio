'use client';

import { useEffect, useRef, useState } from 'react';

function prefersReducedMotion() {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Settles a numeric display toward `value`. No bounce — trading-desk tick.
 */
export function NumberTick({
  value,
  className = '',
  format = (n) => String(Math.round(n)),
}: {
  value: number;
  className?: string;
  format?: (n: number) => string;
}) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    if (prefersReducedMotion() || fromRef.current === value) {
      setDisplay(value);
      fromRef.current = value;
      return;
    }

    const from = fromRef.current;
    const start = performance.now();
    const dur = 480;
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (value - from) * eased);
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        fromRef.current = value;
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <span
      className={`font-[family-name:var(--folio-font-mono)] tabular-nums ${className}`}
    >
      {format(display)}
    </span>
  );
}
