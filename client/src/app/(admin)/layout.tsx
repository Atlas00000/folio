'use client';

import { RequireAuth } from '@/features/auth/RequireAuth';
import { useAuth } from '@/features/auth/AuthProvider';
import { AppShell } from '@/design/shells';
import { Button, Text } from '@/design/primitives';
import { ThemeToggle } from '@/design/ThemeProvider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  return (
    <RequireAuth roles={['admin']}>
      <AppShell
        brandHref="/admin/courses"
        greeting={user?.displayName ?? null}
        tabs={[
          {
            href: '/admin/courses',
            label: 'Admin',
            mark: 'staff',
          },
          {
            href: '/lecturer/courses',
            label: 'Staff',
            mark: 'ledger',
          },
        ]}
        meta={
          <>
            <ThemeToggle />
            <Text as="span" size="sm" tone="muted" face="mono">
              {user?.displayName}
            </Text>
            <Button variant="ghost" type="button" onClick={() => void logout()}>
              Sign out
            </Button>
          </>
        }
      >
        {children}
      </AppShell>
    </RequireAuth>
  );
}
