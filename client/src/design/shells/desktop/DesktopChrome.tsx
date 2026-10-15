import Link from 'next/link';
import type { ReactNode } from 'react';
import { ActionRail } from '../ActionRail';
import { ShellNavLink } from '../ShellNavLink';
import type { ShellNavItem } from '../types';

/**
 * Web / desktop top instrument rail — hidden below md.
 */
export function DesktopChrome({
  brandHref,
  tabs,
  meta,
}: {
  brandHref: string;
  tabs: ShellNavItem[];
  meta?: ReactNode;
}) {
  return (
    <header className="relative z-20 hidden border-b border-[var(--folio-hairline-strong)] bg-[var(--folio-void)]/90 backdrop-blur-md md:block">
      <div className="mx-auto flex w-full max-w-[var(--folio-content-max)] items-stretch gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          href={brandHref}
          className="flex items-center gap-3 border-r border-[var(--folio-hairline-strong)] py-3.5 pr-6"
        >
          <span
            aria-hidden
            className="h-5 w-[2px] bg-[var(--folio-signal)]"
          />
          <span className="font-[family-name:var(--folio-font-display)] text-2xl leading-none tracking-[var(--folio-tracking-tight)] text-[var(--folio-ink)]">
            Folio
          </span>
        </Link>
        <ActionRail
          className="flex-1 py-3.5"
          leading={
            <>
              {tabs.map((t) => (
                <ShellNavLink
                  key={t.href}
                  href={t.href}
                  exact={t.exact}
                  className="text-[length:var(--folio-text-sm)] text-[var(--folio-ink-muted)] transition-colors duration-[var(--folio-dur-fast)] hover:text-[var(--folio-signal)]"
                  activeClassName="text-[var(--folio-signal)]"
                >
                  {t.label}
                </ShellNavLink>
              ))}
            </>
          }
          trailing={meta}
        />
      </div>
    </header>
  );
}
