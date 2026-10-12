'use client';

import Link from 'next/link';
import { FormEvent, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { confirmPasswordReset } from '@/lib/api/auth';
import { Button, ErrorNote, Field } from '@/components/ui';

function ResetForm() {
  const params = useSearchParams();
  const token = params.get('token') || '';
  const router = useRouter();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setPending(true);
    const fd = new FormData(e.currentTarget);
    try {
      await confirmPasswordReset({
        token: String(fd.get('token') || token),
        password: String(fd.get('password') || ''),
      });
      router.replace('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed');
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <Field id="token" name="token" label="Reset token" defaultValue={token} required />
      <Field id="password" name="password" type="password" label="New password" minLength={8} required />
      <ErrorNote>{error}</ErrorNote>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? 'Saving…' : 'Update password'}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-10">
      <h1 className="font-[family-name:var(--font-display)] text-4xl">Folio</h1>
      <p className="mt-2 text-[var(--ink-muted)]">Choose a new password.</p>
      <Suspense>
        <ResetForm />
      </Suspense>
      <p className="mt-6 text-sm">
        <Link href="/login" className="text-[var(--accent)]">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
