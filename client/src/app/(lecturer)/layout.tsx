'use client';

import { RequireAuth } from '@/features/auth/RequireAuth';
import { useAuth } from '@/features/auth/AuthProvider';
import { AppShell } from '@/design/shells';
import { Button, Text } from '@/design/primitives';
import { ThemeToggle } from '@/design/ThemeProvider';

export default function LecturerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  return (
    <RequireAuth roles={['lecturer', 'ta', 'admin']}>
      <AppShell
        brandHref="/lecturer/courses"
        greeting={user?.displayName ?? null}
        tabs={[
          {
            href: '/lecturer/courses',
            label: 'Courses',
            mark: 'ledger',
          },
          {
            href: '/lecturer/courses/new',
            label: 'New',
            mark: 'plus',
            exact: true,
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
