import type { ReactNode } from 'react';

export type ShellNavItem = {
  href: string;
  label: string;
  /** When true, only exact path matches as active */
  exact?: boolean;
  /** Compact mark for mobile dock — geometric, not emoji */
  mark?: 'ledger' | 'join' | 'plus' | 'pulse' | 'staff';
};

export type AppShellProps = {
  brandHref: string;
  /** Primary destinations — drives desktop rail + mobile dock */
  tabs: ShellNavItem[];
  /** Desktop trailing cluster (theme, identity, sign out) */
  meta?: ReactNode;
  /** Optional greeting shown in mobile top bar */
  greeting?: string | null;
  children: ReactNode;
};
