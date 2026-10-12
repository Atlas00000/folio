'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { homeForRole, useAuth } from '@/features/auth/AuthProvider';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    router.replace(homeForRole(user.globalRole));
  }, [user, loading, router]);

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <p className="text-[var(--ink-muted)]">Opening Folio…</p>
    </div>
  );
}
