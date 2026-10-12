import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const connectionString =
  process.env.DATABASE_URL ?? 'postgresql://folio:folio@localhost:5432/folio';

const pool = new Pool({ connectionString });

export const db = drizzle(pool, { schema });
export type Database = typeof db;
