import { execSync } from 'child_process';
import * as path from 'path';

const root = path.resolve(__dirname, '..', '..');
const server = path.resolve(__dirname, '..');

function run(cmd: string, cwd: string) {
  console.log(`> ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit', shell: true });
}

function main() {
  console.log('A0–A3 test prep: Docker Postgres/Redis + migrate + seed');
  try {
    run('docker-compose up -d postgres redis', root);
  } catch {
    run('docker compose up -d postgres redis', root);
  }
  run('pnpm db:migrate', server);
  run('pnpm db:seed', server);
  console.log('Prep complete.');
}

main();
