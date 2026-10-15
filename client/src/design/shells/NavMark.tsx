/**
 * Geometric dock marks — Folio ledger language, no icons packs / emoji.
 */
export function NavMark({
  mark = 'ledger',
  active = false,
}: {
  mark?: 'ledger' | 'join' | 'plus' | 'pulse' | 'staff';
  active?: boolean;
}) {
  const stroke = active ? 'var(--folio-signal)' : 'var(--folio-ink-muted)';

  return (
    <span
      aria-hidden
      className="relative inline-flex h-5 w-5 items-center justify-center"
    >
      {mark === 'ledger' ? (
        <span className="flex h-4 w-4 flex-col justify-between">
          <span className="h-[2px] w-full" style={{ background: stroke }} />
          <span className="h-[2px] w-3/4" style={{ background: stroke }} />
          <span className="h-[2px] w-full" style={{ background: stroke }} />
        </span>
      ) : null}
      {mark === 'join' || mark === 'plus' ? (
        <span className="relative h-4 w-4">
          <span
            className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2"
            style={{ background: stroke }}
          />
          <span
            className="absolute bottom-0 left-1/2 top-0 w-[2px] -translate-x-1/2"
            style={{ background: stroke }}
          />
        </span>
      ) : null}
      {mark === 'pulse' ? (
        <span
          className="h-2.5 w-2.5 rounded-full border-2"
          style={{ borderColor: stroke }}
        />
      ) : null}
      {mark === 'staff' ? (
        <span
          className="h-4 w-[2px]"
          style={{ background: stroke }}
        />
      ) : null}
    </span>
  );
}
