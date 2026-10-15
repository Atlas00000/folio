import type { HTMLAttributes, ReactNode } from 'react';

const sizes = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
} as const;

/**
 * Icon wrapper — hosts SVG paths only. No emoji, no clip-art slots.
 */
export function Icon({
  size = 'md',
  className = '',
  children,
  label,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  size?: keyof typeof sizes;
  children: ReactNode;
  /** Accessible name; omit for decorative icons */
  label?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center text-current ${sizes[size]} ${className}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...props}
    >
      {children}
    </span>
  );
}
