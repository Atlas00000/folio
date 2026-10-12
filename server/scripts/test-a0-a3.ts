import { spawn, execSync, type ChildProcess } from 'child_process';
import * as path from 'path';
import { BASE_URL, waitForHealth } from '../test/helpers/http';

const serverDir = path.resolve(__dirname, '..');

function run(cmd: string) {
  console.log(`\n=== ${cmd} ===`);
  execSync(cmd, { cwd: serverDir, stdio: 'inherit', shell: true });
}

async function ensureApi(): Promise<ChildProcess | null> {
  try {
    await waitForHealth(5000);
    console.log(`API already healthy at ${BASE_URL}`);
    return null;
  } catch {
    console.log('API down — building and starting server...');
  }

  run('pnpm build');
  const child = spawn('node', ['dist/src/main.js'], {
    cwd: serverDir,
    stdio: 'inherit',
    env: process.env,
    detached: false,
  });

  await waitForHealth(45000);
  console.log('API started for test run');
  return child;
}

async function main() {
  run('pnpm exec tsx scripts/test-prep.ts');
  const child = await ensureApi();

  let failed = false;
  try {
    run('pnpm test:unit');
    run('pnpm test:api');
    console.log('\nA0–A3 verification PASSED');
  } catch (err) {
    failed = true;
    console.error('\nA0–A3 verification FAILED');
    throw err;
  } finally {
    if (child && !child.killed) {
      child.kill('SIGTERM');
    }
  }

  if (failed) process.exit(1);
}

main().catch(() => process.exit(1));
