/**
 * CORS allowlist for local client + future Vercel previews/production.
 * CLIENT_ORIGINS=comma-separated exact origins
 * ALLOW_VERCEL_PREVIEWS=true also permits https://*.vercel.app
 */
export function resolveCorsOrigin(): (string | RegExp)[] {
  const raw =
    process.env.CLIENT_ORIGINS ??
    process.env.CLIENT_ORIGIN ??
    'http://localhost:3000,http://127.0.0.1:3000';
  const allowed = raw
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  const allowVercel =
    (process.env.ALLOW_VERCEL_PREVIEWS ?? 'true').toLowerCase() === 'true';

  const origins: (string | RegExp)[] = [...allowed];
  if (allowVercel) {
    origins.push(/^https:\/\/[a-z0-9-]+\.vercel\.app$/i);
  }
  return origins;
}
