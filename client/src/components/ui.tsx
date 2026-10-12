import Link from 'next/link';
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

export function Shell({
  brandHref,
  nav,
  children,
}: {
  brandHref: string;
  nav: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-[var(--paper)] text-[var(--ink)]">
      <header className="border-b border-[var(--rule)] bg-[var(--paper-raised)]/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link
            href={brandHref}
            className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--ink)]"
          >
            Folio
          </Link>
          <nav className="flex flex-wrap items-center gap-3 text-sm">{nav}</nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger';
}) {
  const styles =
    variant === 'primary'
      ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent-deep)]'
      : variant === 'danger'
        ? 'bg-red-700 text-white hover:bg-red-800'
        : 'bg-transparent text-[var(--ink)] hover:bg-[var(--wash)]';
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition disabled:opacity-50 ${styles} ${className}`}
      {...props}
    />
  );
}

export function Field({
  label,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block space-y-1.5 text-sm" htmlFor={id}>
      <span className="font-medium text-[var(--ink-muted)]">{label}</span>
      <input
        id={id}
        className="w-full rounded-md border border-[var(--rule)] bg-white px-3 py-2 text-[var(--ink)] outline-none ring-[var(--accent)] focus:ring-2"
        {...props}
      />
    </label>
  );
}

export function TextArea({
  label,
  id,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="block space-y-1.5 text-sm" htmlFor={id}>
      <span className="font-medium text-[var(--ink-muted)]">{label}</span>
      <textarea
        id={id}
        className="min-h-28 w-full rounded-md border border-[var(--rule)] bg-white px-3 py-2 text-[var(--ink)] outline-none ring-[var(--accent)] focus:ring-2"
        {...props}
      />
    </label>
  );
}

export function Select({
  label,
  id,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5 text-sm" htmlFor={id}>
      <span className="font-medium text-[var(--ink-muted)]">{label}</span>
      <select
        id={id}
        className="w-full rounded-md border border-[var(--rule)] bg-white px-3 py-2 outline-none ring-[var(--accent)] focus:ring-2"
        {...props}
      >
        {children}
      </select>
    </label>
  );
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
            <h2 className="font-[family-name:var(--font-display)] text-xl">
              {title}
            </h2>
          ) : (
            <span />
          )}
          {action}
        </div>
      )}
      <div className="rounded-lg border border-[var(--rule)] bg-[var(--paper-raised)] p-4 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
        {children}
      </div>
    </section>
  );
}

export function ErrorNote({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
      {children}
    </p>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm text-[var(--ink-muted)]">{children}</p>
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
      className="text-[var(--ink-muted)] hover:text-[var(--accent)]"
    >
      {children}
    </Link>
  );
}
