'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { requestPasswordReset } from '@/lib/api/auth';
import { Button, ErrorNote, Field } from '@/components/ui';

export default function ForgotPasswordPage() {
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setPending(true);
    const fd = new FormData(e.currentTarget);
    try {
      await requestPasswordReset(String(fd.get('email') || ''));
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-10">
      <h1 className="font-[family-name:var(--font-display)] text-4xl">Folio</h1>
      <p className="mt-2 text-[var(--ink-muted)]">
        Request a password reset link for your university email.
      </p>
      {done ? (
        <p className="mt-6 text-sm text-[var(--accent)]">
          If that email exists, a reset token was issued. Check server logs in
          local dev for the token URL.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Field id="email" name="email" type="email" label="University email" required />
          <ErrorNote>{error}</ErrorNote>
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? 'Sending…' : 'Send reset'}
          </Button>
        </form>
      )}
      <p className="mt-6 text-sm">
        <Link href="/login" className="text-[var(--accent)]">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
