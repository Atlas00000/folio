import { apiLogger } from '../logging';
import type { ApiErrorBody } from '../types';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || 'http://localhost:3001';

export class ApiError extends Error {
  status: number;
  body: ApiErrorBody | null;

  constructor(status: number, body: ApiErrorBody | null, fallback: string) {
    const msg = Array.isArray(body?.message)
      ? body.message.join(', ')
      : body?.message || fallback;
    super(msg);
    this.status = status;
    this.body = body;
  }
}

export async function api<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const method = (init.method ?? 'GET').toUpperCase();
  const started = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  apiLogger.debug('request', { method, path });

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
      credentials: 'include',
    });
  } catch (err) {
    const durationMs = Math.round(
      (typeof performance !== 'undefined' ? performance.now() : Date.now()) - started,
    );
    apiLogger.error('network_error', {
      method,
      path,
      durationMs,
      err: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  const durationMs = Math.round(
    (typeof performance !== 'undefined' ? performance.now() : Date.now()) - started,
  );

  if (!res.ok) {
    apiLogger.warn('response_error', {
      method,
      path,
      status: res.status,
      durationMs,
    });
    throw new ApiError(
      res.status,
      (data as ApiErrorBody) ?? null,
      res.statusText || 'Request failed',
    );
  }

  apiLogger.debug('response', {
    method,
    path,
    status: res.status,
    durationMs,
  });

  return data as T;
}

export function apiGet<T>(path: string) {
  return api<T>(path);
}

export function apiPost<T>(path: string, body?: unknown) {
  return api<T>(path, {
    method: 'POST',
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export function apiPatch<T>(path: string, body: unknown) {
  return api<T>(path, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}
