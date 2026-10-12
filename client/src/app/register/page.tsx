'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/api/auth';
import { homeForRole, useAuth } from '@/features/auth/AuthProvider';
import { Button, ErrorNote, Field } from '@/components/ui';

export default function RegisterPage() {
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
      const res = await register({
        email: String(fd.get('email') || ''),
        displayName: String(fd.get('displayName') || ''),
        password: String(fd.get('password') || ''),
      });
      setUser(res.user);
      router.replace(homeForRole(res.user.globalRole));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-10">
      <h1 className="font-[family-name:var(--font-display)] text-4xl">Folio</h1>
      <p className="mt-2 text-[var(--ink-muted)]">
        Register with a university email domain.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <Field id="displayName" name="displayName" label="Display name" required />
        <Field id="email" name="email" type="email" label="University email" required />
        <Field id="password" name="password" type="password" label="Password (min 8)" required minLength={8} />
        <ErrorNote>{error}</ErrorNote>
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? 'Creating…' : 'Create account'}
        </Button>
      </form>
      <p className="mt-6 text-sm">
        <Link href="/login" className="text-[var(--accent)]">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
