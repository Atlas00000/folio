'use client';

import { RequireAuth } from '@/features/auth/RequireAuth';
import { useAuth } from '@/features/auth/AuthProvider';
import { Button, NavLink, Shell } from '@/components/ui';

export default function LecturerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  return (
    <RequireAuth roles={['lecturer', 'ta', 'admin']}>
      <Shell
        brandHref="/lecturer/courses"
        nav={
          <>
            <NavLink href="/lecturer/courses">Courses</NavLink>
            <NavLink href="/lecturer/courses/new">New course</NavLink>
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
