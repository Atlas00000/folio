'use client';

import { useEffect, type ReactNode } from 'react';
import { Text } from '@/design/primitives';

/**
 * Slide-up account / theme sheet — ledger panel, not a modal card stack.
 */
export function MobileMoreSheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close menu"
        className="absolute inset-0 bg-[var(--folio-void)]/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="absolute inset-x-0 bottom-0 border-t border-[var(--folio-hairline-strong)] bg-[var(--folio-canvas)] px-4 pt-4 folio-page-enter"
        style={{ paddingBottom: 'calc(1rem + var(--folio-safe-bottom))' }}
      >
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <Text as="p" face="label" tone="faint">
              Session
            </Text>
            <Text as="p" face="display" size="xl" className="mt-1">
              Account & theme
            </Text>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] uppercase tracking-[var(--folio-tracking-label)] text-[var(--folio-ink-faint)] hover:text-[var(--folio-signal)]"
          >
            Close
          </button>
        </div>
        <div className="flex flex-col gap-3 border-t border-[var(--folio-hairline)] pt-4">
          {children}
        </div>
      </div>
    </div>
  );
}
