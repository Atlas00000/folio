import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-4xl">Folio</h1>
      <p className="mt-3 text-[var(--ink-muted)]">That page was not found.</p>
      <Link href="/" className="mt-6 text-[var(--accent)]">
        Go home
      </Link>
    </div>
  );
}
