/**
 * Compatibility facade — existing pages keep importing from here.
 * New work should prefer `@/design/*` directly.
 */
import Link from 'next/link';
import type { ReactNode } from 'react';
import { AppShell } from '@/design/shells';
import { Button as DsButton } from '@/design/primitives/Button';
import { Field as DsField, TextArea as DsTextArea, Select as DsSelect } from '@/design/primitives/Input';
import { Surface } from '@/design/primitives/Surface';
import { Text } from '@/design/primitives/Text';

export { AppShell };

export function Shell({
  brandHref,
  children,
}: {
  brandHref: string;
  /** @deprecated ignored — use AppShell with `tabs` */
  nav?: ReactNode;
  children: ReactNode;
}) {
  return (
    <AppShell
      brandHref={brandHref}
      tabs={[{ href: brandHref, label: 'Home', mark: 'ledger' }]}
    >
      {children}
    </AppShell>
  );
}

export function Button(
  props: React.ComponentProps<typeof DsButton>,
) {
  return <DsButton {...props} />;
}

export function Field(props: React.ComponentProps<typeof DsField>) {
  return <DsField {...props} />;
}

export function TextArea(props: React.ComponentProps<typeof DsTextArea>) {
  return <DsTextArea {...props} />;
}

export function Select(props: React.ComponentProps<typeof DsSelect>) {
  return <DsSelect {...props} />;
}

export function Panel({
  title,
  children,
  action,
}: {
  title?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="space-y-3">
      {(title || action) && (
        <div className="flex items-end justify-between gap-3">
          {title ? (
            <Text as="h2" face="display" size="xl">
              {title}
            </Text>
          ) : (
            <span />
          )}
          {action}
        </div>
      )}
      <Surface variant="raised" className="p-4">
        {children}
      </Surface>
    </section>
  );
}

export function ErrorNote({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <p
      className="rounded-[var(--folio-radius-sm)] border border-[var(--folio-halt)]/40 bg-[var(--folio-halt-dim)] px-3 py-2 text-[length:var(--folio-text-sm)] text-[var(--folio-halt)]"
      role="alert"
    >
      {children}
    </p>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="text-[length:var(--folio-text-sm)] text-[var(--folio-ink-muted)]">
      {children}
    </p>
  );
}

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-[length:var(--folio-text-sm)] text-[var(--folio-ink-muted)] transition-colors duration-[var(--folio-dur-fast)] hover:text-[var(--folio-signal)]"
    >
      {children}
    </Link>
  );
}
