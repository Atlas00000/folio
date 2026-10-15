/**
 * Resolve Folio CSS variables for D3 paint — keep charts on-theme.
 */
export function folioCssVar(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

export function folioVizColors() {
  return {
    ink: folioCssVar('--folio-ink', '#e8edf4'),
    muted: folioCssVar('--folio-ink-muted', '#8b97a8'),
    faint: folioCssVar('--folio-ink-faint', '#5c6878'),
    hairline: folioCssVar('--folio-hairline', 'rgba(232,237,244,0.08)'),
    hairlineStrong: folioCssVar(
      '--folio-hairline-strong',
      'rgba(232,237,244,0.16)',
    ),
    signal: folioCssVar('--folio-signal', '#2ec4b6'),
    signalDim: folioCssVar('--folio-signal-dim', 'rgba(46,196,182,0.12)'),
    ok: folioCssVar('--folio-ok', '#3ecf8e'),
    warn: folioCssVar('--folio-warn', '#d4a017'),
    halt: folioCssVar('--folio-halt', '#e85d5d'),
    canvas: folioCssVar('--folio-canvas', '#0c1014'),
  };
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
