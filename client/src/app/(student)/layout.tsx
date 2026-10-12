'use client';

import { RequireAuth } from '@/features/auth/RequireAuth';
import { useAuth } from '@/features/auth/AuthProvider';
import { Button, NavLink, Shell } from '@/components/ui';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  return (
    <RequireAuth roles={['student', 'admin']}>
      <Shell
        brandHref="/student/courses"
        nav={
          <>
            <NavLink href="/student/courses">Courses</NavLink>
            <NavLink href="/student/join">Join</NavLink>
            <span className="text-[var(--ink-muted)]">{user?.displayName}</span>
            <Button variant="ghost" type="button" onClick={() => void logout()}>
              Sign out
            </Button>
          </>
        }
      >
        {children}
      </Shell>
    </RequireAuth>
  );
}
