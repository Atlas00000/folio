import { readFileSync, existsSync } from 'fs';
import * as path from 'path';
import { beforeAll, describe, expect, it } from 'vitest';
import { CookieClient, waitForHealth } from '../helpers/http';

describe('A3/A1.1 contract', () => {
  const client = new CookieClient();

  beforeAll(async () => {
    await waitForHealth();
  });

  it('openapi.json exists with additive 1.1 surface', () => {
    const file = path.join(process.cwd(), 'openapi', 'openapi.json');
    expect(existsSync(file)).toBe(true);
    const doc = JSON.parse(readFileSync(file, 'utf8'));
    expect(doc.openapi).toMatch(/^3\./);
    expect(doc.info?.version).toMatch(/^1\./);
    expect(doc.paths?.['/health']).toBeTruthy();
    expect(doc.paths?.['/auth/login']).toBeTruthy();
  });

  it('serves swagger docs', async () => {
    const { status } = await client.get('/docs');
    expect(status).toBe(200);
  });
});
