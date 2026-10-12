import { beforeAll, describe, expect, it } from 'vitest';
import { uniEmail } from '../helpers/fixtures';
import { CookieClient, waitForHealth } from '../helpers/http';

describe('C password reset', () => {
  const client = new CookieClient();
  const email = uniEmail('reset');
  const password = 'password123';

  beforeAll(async () => {
    await waitForHealth();
    await client.post('/auth/register', {
      email,
      displayName: 'Reset User',
      password,
    });
    await client.post('/auth/logout');
  });

  it('request always returns ok', async () => {
    const res = await client.post('/auth/password-reset/request', { email });
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);
    expect(res.data.ok).toBe(true);
  });

  it('rejects invalid confirm token', async () => {
    const res = await client.post('/auth/password-reset/confirm', {
      token: 'definitely-not-a-real-token-value',
      password: 'newpassword99',
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
