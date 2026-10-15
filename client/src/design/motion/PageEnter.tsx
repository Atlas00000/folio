import type { HTMLAttributes, ReactNode } from 'react';

export function PageEnter({
  stage = 0,
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  /** 0–3 staged delay steps */
  stage?: 0 | 1 | 2 | 3;
  children?: ReactNode;
}) {
  const delay =
    stage === 1
      ? 'folio-page-enter-delay-1'
      : stage === 2
        ? 'folio-page-enter-delay-2'
        : stage === 3
          ? 'folio-page-enter-delay-3'
          : '';

  return (
    <div className={`folio-page-enter ${delay} ${className}`} {...props}>
      {children}
    </div>
  );
}
