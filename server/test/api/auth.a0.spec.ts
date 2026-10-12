import { beforeAll, describe, expect, it } from 'vitest';
import { uniEmail } from '../helpers/fixtures';
import { CookieClient, waitForHealth } from '../helpers/http';

describe('A0 auth', () => {
  const client = new CookieClient();
  const email = uniEmail('auth');

  beforeAll(async () => {
    await waitForHealth();
  });

  it('rejects non-university email on register', async () => {
    const { status, data } = await client.post('/auth/register', {
      email: 'person@gmail.com',
      displayName: 'No Uni',
      password: 'password123',
    });
    expect(status).toBe(400);
    expect(String(data.message)).toMatch(/university email/i);
  });

  it('registers, me, logout, and login with session cookie', async () => {
    const reg = await client.post('/auth/register', {
      email,
      displayName: 'Auth Tester',
      password: 'password123',
    });
    expect(reg.status).toBeGreaterThanOrEqual(200);
    expect(reg.status).toBeLessThan(300);
    expect(reg.data.user.email).toBe(email);

    const me = await client.get('/auth/me');
    expect(me.status).toBe(200);
    expect(me.data.user.email).toBe(email);

    const logout = await client.post('/auth/logout');
    expect(logout.status).toBeGreaterThanOrEqual(200);
    expect(logout.status).toBeLessThan(300);

    const meAfter = await client.get('/auth/me');
    expect(meAfter.status).toBe(401);

    const login = await client.post('/auth/login', {
      email,
      password: 'password123',
    });
    expect(login.status).toBeGreaterThanOrEqual(200);
    expect(login.status).toBeLessThan(300);

    const me2 = await client.get('/auth/me');
    expect(me2.status).toBe(200);
    expect(me2.data.user.email).toBe(email);
  });
});
