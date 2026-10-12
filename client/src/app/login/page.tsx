'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api/auth';
import { homeForRole, useAuth } from '@/features/auth/AuthProvider';
import { Button, ErrorNote, Field } from '@/components/ui';

export default function LoginPage() {
  const { setUser } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setPending(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await login({
        email: String(fd.get('email') || ''),
        password: String(fd.get('password') || ''),
      });
      setUser(res.user);
      router.replace(homeForRole(res.user.globalRole));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-10">
      <div className="mb-8 space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">
          Accounting practice
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-5xl leading-none">
          Folio
        </h1>
        <p className="text-[var(--ink-muted)]">
          Sign in with your university email to continue.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field id="email" name="email" type="email" label="University email" required autoComplete="username" />
        <Field id="password" name="password" type="password" label="Password" required autoComplete="current-password" />
        <ErrorNote>{error}</ErrorNote>
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      <div className="mt-6 flex justify-between text-sm text-[var(--ink-muted)]">
        <Link href="/register" className="hover:text-[var(--accent)]">
          Create account
        </Link>
        <Link href="/forgot-password" className="hover:text-[var(--accent)]">
          Forgot password
        </Link>
      </div>
    </div>
  );
}
