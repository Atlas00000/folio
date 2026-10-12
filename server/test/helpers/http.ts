/**
 * Prefer IPv4 — on Windows, `localhost` can resolve to ::1 while the API listens on 127.0.0.1.
 * Do not use env name `BASE_URL`: Vite/Vitest sets that to `/` (asset base), which breaks fetch URLs.
 */
export const BASE_URL =
  process.env.FOLIO_API_URL?.trim() ||
  process.env.API_BASE_URL?.trim() ||
  'http://127.0.0.1:3001';

type Json = Record<string, unknown> | unknown[] | string | number | boolean | null;

export class CookieClient {
  private cookies = new Map<string, string>();

  clearCookies() {
    this.cookies.clear();
  }

  private storeFromResponse(res: Response) {
    const raw = res.headers.getSetCookie?.() ?? [];
    const fallback = res.headers.get('set-cookie');
    const list = raw.length ? raw : fallback ? [fallback] : [];
    for (const line of list) {
      const pair = line.split(';')[0];
      const eq = pair.indexOf('=');
      if (eq < 1) continue;
      const name = pair.slice(0, eq).trim();
      const value = pair.slice(eq + 1).trim();
      if (value === '') {
        this.cookies.delete(name);
      } else {
        this.cookies.set(name, value);
      }
    }
  }

  private cookieHeader(): string | undefined {
    if (!this.cookies.size) return undefined;
    return [...this.cookies.entries()]
      .map(([k, v]) => `${k}=${v}`)
      .join('; ');
  }

  async request(
    method: string,
    path: string,
    body?: Json,
  ): Promise<{ status: number; data: any; res: Response }> {
    const headers: Record<string, string> = {};
    const cookie = this.cookieHeader();
    if (cookie) headers.Cookie = cookie;
    let payload: string | undefined;
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
      payload = JSON.stringify(body);
    }
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: payload,
      signal: AbortSignal.timeout(15000),
    });
    this.storeFromResponse(res);
    const text = await res.text();
    let data: any = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }
    return { status: res.status, data, res };
  }

  get(path: string) {
    return this.request('GET', path);
  }

  post(path: string, body?: Json) {
    return this.request('POST', path, body);
  }

  patch(path: string, body?: Json) {
    return this.request('PATCH', path, body);
  }
}

export async function waitForHealth(timeoutMs = 30000): Promise<void> {
  const start = Date.now();
  let lastErr: unknown;
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${BASE_URL}/health`, {
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) return;
      lastErr = `status ${res.status}`;
    } catch (err) {
      lastErr = err;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`API not healthy at ${BASE_URL}/health: ${String(lastErr)}`);
}
