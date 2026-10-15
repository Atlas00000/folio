import type { HTMLAttributes, ReactNode } from 'react';

const variants = {
  void: 'bg-[var(--folio-void)]',
  canvas: 'bg-[var(--folio-canvas)]',
  plane: 'bg-[var(--folio-plane)] border border-[var(--folio-hairline)]',
  raised:
    'bg-[var(--folio-plane-raised)] border border-[var(--folio-hairline)] shadow-[var(--folio-elev-1)]',
  signal:
    'bg-[var(--folio-plane-raised)] border border-[var(--folio-signal)]/30 shadow-[var(--folio-elev-signal)]',
} as const;

export type SurfaceVariant = keyof typeof variants;

export function Surface({
  variant = 'plane',
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  variant?: SurfaceVariant;
  children?: ReactNode;
}) {
  return (
    <div
      className={`rounded-[var(--folio-radius-md)] ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
