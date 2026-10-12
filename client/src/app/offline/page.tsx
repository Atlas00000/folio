import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-4xl">Folio</h1>
      <p className="mt-3 text-[var(--ink-muted)]">
        You appear to be offline. Reconnect to continue practice and sync with
        the API.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex justify-center rounded-md bg-[var(--accent)] px-4 py-2 text-white"
      >
        Try again
      </Link>
    </div>
  );
}
