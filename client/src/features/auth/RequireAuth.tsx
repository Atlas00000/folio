'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { homeForRole, useAuth } from './AuthProvider';
import type { GlobalRole } from '@/lib/types';

export function RequireAuth({
  roles,
  children,
}: {
  roles?: GlobalRole[];
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (roles && !roles.includes(user.globalRole)) {
      router.replace(homeForRole(user.globalRole));
    }
  }, [user, loading, roles, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-[var(--ink-muted)]">
        Loading…
      </div>
    );
  }
  if (roles && !roles.includes(user.globalRole)) return null;
  return <>{children}</>;
}
