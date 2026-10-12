'use client';

import { RequireAuth } from '@/features/auth/RequireAuth';
import { useAuth } from '@/features/auth/AuthProvider';
import { Button, NavLink, Shell } from '@/components/ui';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  return (
    <RequireAuth roles={['admin']}>
      <Shell
        brandHref="/admin/courses"
        nav={
          <>
            <NavLink href="/admin/courses">Courses</NavLink>
            <NavLink href="/lecturer/courses">Lecturer view</NavLink>
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
