import { beforeAll, describe, expect, it } from 'vitest';
import { CookieClient, waitForHealth } from '../helpers/http';

describe('A0/A3 health', () => {
  const client = new CookieClient();

  beforeAll(async () => {
    await waitForHealth();
  });

  it('reports ok with current contract version', async () => {
    const { status, data } = await client.get('/health');
    expect(status).toBe(200);
    expect(data.status).toBe('ok');
    expect(data.service).toBe('folio-server');
    expect(data.contract).toMatch(/^\d+\.\d+\.\d+$/);
    expect(data.phase).toBeTruthy();
  });
});
