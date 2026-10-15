import type { ButtonHTMLAttributes } from 'react';

const variants = {
  primary:
    'bg-[var(--folio-signal)] text-[var(--folio-on-signal)] hover:bg-[var(--folio-signal-deep)]',
  ghost:
    'bg-transparent text-[var(--folio-ink-muted)] hover:bg-[var(--folio-plane)] hover:text-[var(--folio-ink)] border border-transparent hover:border-[var(--folio-hairline)]',
  danger:
    'bg-[var(--folio-halt-dim)] text-[var(--folio-halt)] border border-[var(--folio-halt)]/40 hover:bg-[var(--folio-halt)] hover:text-[var(--folio-void)]',
  quiet:
    'bg-[var(--folio-plane)] text-[var(--folio-ink)] border border-[var(--folio-hairline-strong)] hover:border-[var(--folio-signal)]/40',
} as const;

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--folio-radius-sm)] px-3.5 py-2 text-[length:var(--folio-text-sm)] font-medium transition-[background,color,border-color,opacity] duration-[var(--folio-dur-base)] disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
