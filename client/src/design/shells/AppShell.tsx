'use client';

import { useState } from 'react';
import { PageEnter } from '@/design/motion';
import { DesktopChrome } from './desktop/DesktopChrome';
import { MobileTopBar } from './mobile/MobileTopBar';
import { MobileTabDock } from './mobile/MobileTabDock';
import { MobileMoreSheet } from './mobile/MobileMoreSheet';
import type { AppShellProps } from './types';

/**
 * Dual layout shell:
 * - Desktop (md+): top brand + action rail
 * - Mobile: fixed top bar + bottom tab dock + more sheet
 *
 * Both chromes stay in the DOM; CSS toggles visibility (no layout flash).
 */
export function AppShell({
  brandHref,
  tabs,
  meta,
  greeting,
  children,
}: AppShellProps) {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <div className="relative min-h-dvh bg-[var(--folio-canvas)] text-[var(--folio-ink)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--folio-void)_0%,transparent_32%)]" />
        <div
          className="absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage:
              'linear-gradient(var(--folio-hairline) 1px, transparent 1px), linear-gradient(90deg, var(--folio-hairline) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'linear-gradient(180deg, black 0%, transparent 55%)',
          }}
        />
      </div>

      <DesktopChrome brandHref={brandHref} tabs={tabs} meta={meta} />

      <MobileTopBar
        brandHref={brandHref}
        greeting={greeting}
        onOpenMore={() => setMoreOpen(true)}
      />
      <MobileTabDock tabs={tabs} />
      <MobileMoreSheet open={moreOpen} onClose={() => setMoreOpen(false)}>
        <div className="flex flex-col items-stretch gap-3 [&_button]:w-full [&_button]:justify-start">
          {meta}
        </div>
      </MobileMoreSheet>

      <main className="relative z-10 mx-auto w-full max-w-[var(--folio-content-max)] px-4 pt-[calc(var(--folio-mobile-top)+var(--folio-safe-top)+1rem)] pb-[calc(var(--folio-dock-height)+var(--folio-safe-bottom)+1.25rem)] sm:px-6 md:px-8 md:py-10">
        <PageEnter>{children}</PageEnter>
      </main>
    </div>
  );
}
