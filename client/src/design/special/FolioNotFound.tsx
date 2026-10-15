'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Text } from '@/design/primitives';
import { LedgerAtmosphere } from './LedgerAtmosphere';
import { SignalRing } from './SignalRing';
import { TickRail } from './TickRail';
import { SpecialBrand } from './SpecialBrand';
import { MissingBlotterRow } from './MissingBlotterRow';
import { usePointerField } from './usePointerField';

const GLYPHS = '404LEDGERNULL—·/';

/**
 * Interactive 404 — missing blotter row, broken signal ring, Folio CTAs (not boxed).
 */
export function FolioNotFound() {
  const pointer = usePointerField(true);
  const [code, setCode] = useState('404');
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCode('404');
      setRevealed(true);
      return;
    }

    let frame = 0;
    let step = 0;
    const target = '404';
    const id = window.setInterval(() => {
      step += 1;
      if (step < 14) {
        setCode(
          Array.from({ length: 3 }, () =>
            GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          ).join(''),
        );
      } else {
        setCode(target);
        setRevealed(true);
        window.clearInterval(id);
      }
      frame += 1;
      void frame;
    }, 70);

    return () => window.clearInterval(id);
  }, []);

  return (
    <LedgerAtmosphere pointer={pointer} accent="halt">
      <div className="mx-auto flex min-h-dvh w-full max-w-[min(75vw,72rem)] flex-col justify-between gap-8 px-4 py-8 sm:gap-12 sm:px-8 sm:py-14">
        <header className="flex flex-wrap items-start justify-between gap-4 sm:gap-6">
          <SpecialBrand
            eyebrow="Route unsettled"
            title="Folio"
            subtitle="That ledger path is not on the books for this session."
          />
          <div className="text-left sm:text-right">
            <Text as="p" face="label" tone="faint">
              Status
            </Text>
            <p
              className={`mt-1 font-[family-name:var(--folio-font-mono)] text-4xl leading-none tracking-[var(--folio-tracking-tight)] text-[var(--folio-halt)] sm:text-6xl ${
                revealed ? '' : 'folio-special-flicker'
              }`}
              aria-live="polite"
            >
              {code}
            </p>
          </div>
        </header>

        <main className="grid items-center gap-8 sm:gap-12 lg:grid-cols-[auto_1fr] lg:gap-16">
          <div
            className="justify-self-center lg:justify-self-start"
            style={{
              transform: `translate3d(${pointer.nx * 16}px, ${pointer.ny * 12}px, 0)`,
              transition: 'transform 160ms var(--folio-ease-out)',
            }}
          >
            <div className="scale-[0.78] sm:scale-100">
              <SignalRing mode="missing" size={240} />
            </div>
          </div>

          <div className="space-y-8">
            <MissingBlotterRow pointer={pointer} />

            <TickRail count={14} tone="halt" />

            <div className="space-y-3">
              <Text as="h2" face="display" size="2xl">
                Page not found
              </Text>
              <Text as="p" size="md" tone="muted" className="max-w-lg">
                The URL does not match a course, topic, practice question, or
                progress path. Move the pointer — the missing row tracks with
                you.
              </Text>
            </div>

            <nav
              aria-label="Recovery"
              className="flex flex-col gap-4 border-t border-[var(--folio-hairline-strong)] pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8"
            >
              <Link
                href="/student/courses"
                className="group inline-flex items-baseline gap-2 border-b-2 border-[var(--folio-signal)] pb-0.5 font-[family-name:var(--folio-font-display)] text-2xl tracking-[var(--folio-tracking-tight)] text-[var(--folio-ink)] transition-colors hover:text-[var(--folio-signal)]"
              >
                My Courses
                <span
                  aria-hidden
                  className="text-[var(--folio-signal)] transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
              <Link
                href="/"
                className="font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] uppercase tracking-[var(--folio-tracking-label)] text-[var(--folio-ink-faint)] hover:text-[var(--folio-signal)]"
              >
                Home
              </Link>
              <Link
                href="/login"
                className="font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] uppercase tracking-[var(--folio-tracking-label)] text-[var(--folio-ink-faint)] hover:text-[var(--folio-signal)]"
              >
                Sign in
              </Link>
            </nav>
          </div>
        </main>

        <footer className="flex flex-wrap items-end justify-between gap-4 border-t border-[var(--folio-hairline)] pt-6">
          <Text as="p" face="mono" size="xs" tone="faint">
            ERR · LEDGER_ROW_ABSENT
          </Text>
          <Text as="p" face="mono" size="xs" tone="muted">
            Folio keeps the rest of the books intact
          </Text>
        </footer>
      </div>
    </LedgerAtmosphere>
  );
}
