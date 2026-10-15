'use client';

import { useEffect, useState } from 'react';

export type ViewportMode = 'mobile' | 'desktop';

/**
 * JS companion to CSS dual layout (md = 768).
 * Prefer CSS visibility for chrome; use this for behaviour that must branch.
 */
export function useViewportMode(breakpointPx = 768): ViewportMode {
  const [mode, setMode] = useState<ViewportMode>('desktop');

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${breakpointPx}px)`);
    const apply = () => setMode(mq.matches ? 'desktop' : 'mobile');
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [breakpointPx]);

  return mode;
}
