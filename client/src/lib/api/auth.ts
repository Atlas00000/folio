import { apiGet, apiPost } from './client';
import type { User } from '../types';

export function register(input: {
  email: string;
  displayName: string;
  password: string;
}) {
  return apiPost<{ user: User }>('/auth/register', input);
}

export function login(input: { email: string; password: string }) {
  return apiPost<{ user: User }>('/auth/login', input);
}

export function logout() {
  return apiPost<{ ok: boolean }>('/auth/logout');
}

export function me() {
  return apiGet<{ user: User }>('/auth/me');
}

export function requestPasswordReset(email: string) {
  return apiPost<{ ok: boolean }>('/auth/password-reset/request', { email });
}

export function confirmPasswordReset(input: {
  token: string;
  password: string;
}) {
  return apiPost<{ ok: boolean }>('/auth/password-reset/confirm', input);
}
