'use client';

import { useEffect, useId, useRef, useState } from 'react';
import {
  IconMoon,
  IconSun,
  IconSystem,
} from './theme-icons';
import {
  useTheme,
  type FolioThemePreference,
} from './ThemeProvider';

const OPTIONS: {
  value: FolioThemePreference;
  label: string;
  Icon: typeof IconSun;
}[] = [
  { value: 'dark', label: 'Dark', Icon: IconMoon },
  { value: 'light', label: 'Light', Icon: IconSun },
  { value: 'system', label: 'System', Icon: IconSystem },
];

/**
 * Theme control — closed shows the active preference icon;
 * open drops icon-only dark / light / system choices top → bottom.
 */
export function ThemeMenu({ className = '' }: { className?: string }) {
  const { preference, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const active =
    OPTIONS.find((o) => o.value === preference) ?? OPTIONS[0];
  const ActiveIcon = active.Icon;

  useEffect(() => {
    if (!open) return;

    const onPointer = (e: MouseEvent | TouchEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointer);
    document.addEventListener('touchstart', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('touchstart', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={`relative inline-flex items-center ${className}`}
    >
      <button
        type="button"
        aria-label={`Theme: ${active.label}. ${open ? 'Close' : 'Open'} theme menu`}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--folio-radius-sm)] border border-[var(--folio-hairline-strong)] text-[var(--folio-ink-muted)] transition-colors hover:border-[var(--folio-signal)] hover:text-[var(--folio-signal)]"
      >
        <ActiveIcon className="h-4 w-4" />
      </button>

      {open ? (
        <div
          id={listId}
          role="listbox"
          aria-label="Theme"
          className="absolute left-1/2 top-full z-30 mt-1 flex -translate-x-1/2 flex-col gap-0.5 rounded-[var(--folio-radius-sm)] border border-[var(--folio-hairline-strong)] bg-[var(--folio-plane)] p-0.5 shadow-[var(--folio-elev-1)] folio-page-enter"
        >
          {OPTIONS.map(({ value, label, Icon }) => {
            const selected = preference === value;
            return (
              <button
                key={value}
                type="button"
                role="option"
                aria-selected={selected}
                aria-label={label}
                title={label}
                onClick={() => {
                  setTheme(value);
                  setOpen(false);
                }}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-[calc(var(--folio-radius-sm)-1px)] transition-colors ${
                  selected
                    ? 'bg-[var(--folio-signal-dim)] text-[var(--folio-signal)]'
                    : 'text-[var(--folio-ink-muted)] hover:text-[var(--folio-ink)]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
