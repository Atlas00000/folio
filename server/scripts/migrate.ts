import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as path from 'path';

async function main() {
  const connectionString =
    process.env.DATABASE_URL ?? 'postgresql://folio:folio@localhost:5432/folio';

  const pool = new Pool({ connectionString });
  const db = drizzle(pool);

  const migrationsFolder = path.join(__dirname, '..', 'drizzle');
  console.log(`Running migrations from ${migrationsFolder}`);
  await migrate(db, { migrationsFolder });
  console.log('Migrations complete.');
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
