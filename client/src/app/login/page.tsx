'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api/auth';
import { homeForRole, useAuth } from '@/features/auth/AuthProvider';
import { Button, Field, Text, Surface } from '@/design/primitives';
import { PageEnter } from '@/design/motion';
import { ThemeToggle } from '@/design/ThemeProvider';
import { ErrorNote } from '@/components/ui';

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
    <div className="relative min-h-dvh overflow-hidden bg-[var(--folio-canvas)]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(105deg,var(--folio-void)_0%,transparent_48%)]" />
        <div
          className="absolute inset-0 opacity-[0.28]"
          style={{
            backgroundImage:
              'linear-gradient(var(--folio-hairline) 1px, transparent 1px), linear-gradient(90deg, var(--folio-hairline) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage:
              'linear-gradient(90deg, black 0%, transparent 58%)',
          }}
        />
      </div>

      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      <div className="relative z-10 mx-auto grid min-h-dvh max-w-[var(--folio-content-max)] lg:grid-cols-[1.15fr_0.85fr]">
        <PageEnter className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-14">
          <Text as="p" face="label" tone="signal" className="mb-4">
            Accounting practice
          </Text>
          <Text
            as="h1"
            face="display"
            size="hero"
            className="mb-4 leading-[var(--folio-leading-tight)]"
          >
            Folio
          </Text>
          <Text as="p" size="lg" tone="muted" className="max-w-md">
            Sign in with your university email to continue.
          </Text>
        </PageEnter>

        <PageEnter
          stage={1}
          className="flex items-center border-t border-[var(--folio-hairline-strong)] px-6 py-12 sm:px-10 lg:border-l lg:border-t-0 lg:px-12"
        >
          <Surface variant="raised" className="w-full max-w-md p-6 sm:p-8">
            <Text as="h2" face="display" size="xl" className="mb-6">
              Sign in
            </Text>
            <form onSubmit={onSubmit} className="space-y-4">
              <Field
                id="email"
                name="email"
                type="email"
                label="University email"
                required
                autoComplete="username"
              />
              <Field
                id="password"
                name="password"
                type="password"
                label="Password"
                required
                autoComplete="current-password"
              />
              <ErrorNote>{error}</ErrorNote>
              <Button type="submit" disabled={pending} className="w-full">
                {pending ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
            <div className="mt-6 flex justify-between text-[length:var(--folio-text-sm)] text-[var(--folio-ink-muted)]">
              <Link href="/register" className="hover:text-[var(--folio-signal)]">
                Create account
              </Link>
              <Link
                href="/forgot-password"
                className="hover:text-[var(--folio-signal)]"
              >
                Forgot password
              </Link>
            </div>
          </Surface>
        </PageEnter>
      </div>
    </div>
  );
}
