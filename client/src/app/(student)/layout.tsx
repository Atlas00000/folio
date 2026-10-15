'use client';

import { RequireAuth } from '@/features/auth/RequireAuth';
import { useAuth } from '@/features/auth/AuthProvider';
import { AppShell } from '@/design/shells';
import { Button, Text } from '@/design/primitives';
import { ThemeToggle } from '@/design/ThemeProvider';
import { firstName } from '@/features/courses/hub/greeting';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const hello = user?.displayName
    ? `Hi, ${firstName(user.displayName)}`
    : null;

  return (
    <RequireAuth roles={['student', 'admin']}>
      <AppShell
        brandHref="/student/courses"
        greeting={hello}
        tabs={[
          {
            href: '/student/courses',
            label: 'Courses',
            mark: 'ledger',
          },
          {
            href: '/student/join',
            label: 'Join',
            mark: 'join',
            exact: true,
          },
        ]}
        meta={
          <>
            <ThemeToggle />
            {hello ? (
              <Text as="span" size="sm" tone="ink" face="display">
                {hello}
              </Text>
            ) : null}
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
