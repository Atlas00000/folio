'use client';

import { ShellNavLink } from '../ShellNavLink';
import { NavMark } from '../NavMark';
import type { ShellNavItem } from '../types';
import { usePathname } from 'next/navigation';

/**
 * Bottom instrument dock for mobile — hairline, asymmetric marks, safe-area aware.
 */
export function MobileTabDock({ tabs }: { tabs: ShellNavItem[] }) {
  const pathname = usePathname() || '';

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--folio-hairline-strong)] bg-[var(--folio-void)]/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'var(--folio-safe-bottom)' }}
    >
      <ul
        className="mx-auto grid max-w-lg list-none grid-flow-col auto-cols-fr gap-0 p-0"
        style={{ minHeight: 'var(--folio-dock-height)' }}
      >
        {tabs.map((t) => {
          const active = t.exact
            ? pathname === t.href
            : pathname === t.href || pathname.startsWith(`${t.href}/`);
          return (
            <li key={t.href} className="min-w-0">
              <ShellNavLink
                href={t.href}
                exact={t.exact}
                className="relative flex h-full flex-col items-center justify-center gap-1 px-2 py-2 text-[var(--folio-ink-faint)] transition-colors"
                activeClassName="text-[var(--folio-signal)]"
              >
                {active ? (
                  <span
                    aria-hidden
                    className="absolute inset-x-6 top-0 h-[2px] bg-[var(--folio-signal)]"
                  />
                ) : null}
                <NavMark mark={t.mark ?? 'ledger'} active={active} />
                <span className="font-[family-name:var(--folio-font-mono)] text-[10px] uppercase tracking-[var(--folio-tracking-label)]">
                  {t.label}
                </span>
              </ShellNavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
