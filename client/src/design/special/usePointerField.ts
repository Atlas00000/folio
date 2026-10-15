'use client';

import { useEffect, useState } from 'react';

export type PointerField = {
  x: number;
  y: number;
  /** -0.5 … 0.5 normalised from centre */
  nx: number;
  ny: number;
  active: boolean;
};

const IDLE: PointerField = { x: 0, y: 0, nx: 0, ny: 0, active: false };

/**
 * Tracks pointer over a surface for parallax / signal glow.
 * Disabled under prefers-reduced-motion.
 */
export function usePointerField(enabled = true) {
  const [field, setField] = useState<PointerField>(IDLE);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onMove = (e: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      setField({
        x: e.clientX,
        y: e.clientY,
        nx: e.clientX / w - 0.5,
        ny: e.clientY / h - 0.5,
        active: true,
      });
    };
    const onLeave = () => setField((f) => ({ ...f, active: false }));

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled]);

  return field;
}
