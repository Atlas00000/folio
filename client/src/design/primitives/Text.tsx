import type { HTMLAttributes, ReactNode } from 'react';
import { toneClass, type Tone } from '@/design/tokens';

const sizes = {
  xs: 'text-[length:var(--folio-text-xs)]',
  sm: 'text-[length:var(--folio-text-sm)]',
  md: 'text-[length:var(--folio-text-md)]',
  lg: 'text-[length:var(--folio-text-lg)]',
  xl: 'text-[length:var(--folio-text-xl)]',
  '2xl': 'text-[length:var(--folio-text-2xl)]',
  '3xl': 'text-[length:var(--folio-text-3xl)]',
  hero: 'text-[length:var(--folio-text-hero)]',
} as const;

const faces = {
  display: 'font-[family-name:var(--folio-font-display)] tracking-[var(--folio-tracking-tight)]',
  body: 'font-[family-name:var(--folio-font-body)]',
  mono: 'font-[family-name:var(--folio-font-mono)] tabular-nums',
  label:
    'font-[family-name:var(--folio-font-body)] uppercase tracking-[var(--folio-tracking-label)] text-[length:var(--folio-text-xs)]',
} as const;

type As = 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'label' | 'div';

export function Text({
  as: Tag = 'p',
  size = 'md',
  face = 'body',
  tone = 'ink',
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLElement> & {
  as?: As;
  size?: keyof typeof sizes;
  face?: keyof typeof faces;
  tone?: Tone;
  children?: ReactNode;
}) {
  return (
    <Tag
      className={`${sizes[size]} ${faces[face]} ${toneClass[tone]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
