'use client';

import { useEffect, useState } from 'react';
import { Text } from '@/design/primitives';
import { NumberTick } from '@/design/motion';
import { LedgerAtmosphere } from './LedgerAtmosphere';
import { SignalRing } from './SignalRing';
import { TickRail } from './TickRail';
import { SpecialBrand } from './SpecialBrand';
import { StatusCycle } from './StatusCycle';
import { usePointerField } from './usePointerField';

/**
 * Full-viewport loading instrument — pointer-reactive mesh, sweep ring, tick rail.
 */
export function FolioLoadingScreen({
  label = 'Loading Folio',
}: {
  label?: string;
}) {
  const pointer = usePointerField(true);
  const [pulse, setPulse] = useState(0);
  const [nudge, setNudge] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPulse((p) => (p + 7) % 100);
    }, 180);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setNudge((n) => n + 1);
        setPulse((p) => Math.min(99, p + 11));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <LedgerAtmosphere pointer={pointer} accent="signal">
      <div className="mx-auto flex min-h-dvh w-full max-w-[min(75vw,72rem)] flex-col justify-between gap-8 px-4 py-8 sm:gap-12 sm:px-8 sm:py-14">
        <header className="flex flex-wrap items-start justify-between gap-4 sm:gap-6">
          <SpecialBrand
            eyebrow="Instrument online"
            title="Folio"
            subtitle="Settling your accounting blotter — materials, practice, mastery."
          />
          <div className="text-left sm:text-right">
            <Text as="p" face="label" tone="faint">
              Signal
            </Text>
            <NumberTick
              value={pulse}
              format={(n) => `${n.toFixed(0).padStart(2, '0')}%`}
              className="mt-1 block font-[family-name:var(--folio-font-mono)] text-3xl tabular-nums text-[var(--folio-signal)] sm:text-4xl"
            />
          </div>
        </header>

        <main className="grid items-center gap-8 sm:gap-12 lg:grid-cols-[auto_1fr] lg:gap-16">
          <div
            className="justify-self-center lg:justify-self-start"
            style={{
              transform: `translate3d(${pointer.nx * -20}px, ${pointer.ny * -14}px, 0) rotate(${nudge % 2 === 0 ? 0 : 2}deg)`,
              transition: 'transform 200ms var(--folio-ease-out)',
            }}
          >
            <div className="scale-[0.78] sm:scale-100">
              <SignalRing mode="loading" size={260} />
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <Text as="p" face="label" tone="faint">
                {label}
              </Text>
              <StatusCycle />
            </div>

            <TickRail count={16} tone="signal" />

            <div className="flex flex-wrap gap-x-8 gap-y-2 border-t border-[var(--folio-hairline)] pt-4">
              <Text as="span" face="mono" size="xs" tone="faint">
                Move pointer — mesh tracks
              </Text>
              <Text as="span" face="mono" size="xs" tone="faint">
                Space — nudge sweep
              </Text>
            </div>
          </div>
        </main>

        <footer className="flex flex-wrap items-end justify-between gap-4 border-t border-[var(--folio-hairline-strong)] pt-6">
          <Text as="p" face="mono" size="xs" tone="faint">
            LEDGER · SIGNAL · MASTERY
          </Text>
          <Text as="p" face="mono" size="xs" tone="muted">
            Please wait
          </Text>
        </footer>
      </div>
    </LedgerAtmosphere>
  );
}
