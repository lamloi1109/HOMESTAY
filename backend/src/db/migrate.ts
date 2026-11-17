import { randomUUID, createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { Pool, type PoolClient } from 'pg';
import { loadConfig } from '../config.js';

export const LEGACY_HEAD = '1fbacdbbe084';
const VERSION = '001_legacy_baseline';
const identifier = (value: string) => `"${value.replaceAll('"', '""')}"`;

async function signature(client: PoolClient, schema: string, tables: string[]) {
  // Compare PostgreSQL's own canonical definitions, including every FK, check,
  // uniqueness/index and enum. Existing records are never read or rewritten.
  const result = await client.query<{ kind: string; name: string; definition: string }>(`
    SELECT 'column' kind, c.relname || '.' || a.attname name,
      t.typname || ':' || a.atttypmod || ':' || a.attnotnull || ':' ||
      coalesce(pg_get_expr(d.adbin, d.adrelid), '') definition
    FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    JOIN pg_attribute a ON a.attrelid=c.oid AND a.attnum>0 AND NOT a.attisdropped
    JOIN pg_type t ON t.oid=a.atttypid
    LEFT JOIN pg_attrdef d ON d.adrelid=c.oid AND d.adnum=a.attnum
    WHERE n.nspname=$1 AND c.relname=ANY($2) AND c.relkind='r'
    UNION ALL
    SELECT 'constraint', c.relname || '.' || co.conname, pg_get_constraintdef(co.oid)
    FROM pg_constraint co JOIN pg_class c ON c.oid=co.conrelid
    JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname=$1 AND c.relname=ANY($2)
    UNION ALL
    SELECT 'index', c.relname || '.' || i.relname, pg_get_indexdef(i.oid)
    FROM pg_index ix JOIN pg_class c ON c.oid=ix.indrelid
    JOIN pg_class i ON i.oid=ix.indexrelid JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname=$1 AND c.relname=ANY($2)
    UNION ALL
    SELECT 'enum', t.typname, string_agg(e.enumlabel, ',' ORDER BY e.enumsortorder)
    FROM pg_type t JOIN pg_namespace n ON n.oid=t.typnamespace
    JOIN pg_enum e ON e.enumtypid=t.oid WHERE n.nspname=$1 GROUP BY t.typname
    ORDER BY kind, name`, [schema, tables]);
  return result.rows.map(row => ({ ...row,
    definition: row.definition.replaceAll(`${identifier(schema)}.`, '').replaceAll(`${schema}.`, ''),
  }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const pool = new Pool({ connectionString: loadConfig().databaseUrl });
  try {
    await migrate(pool);
    console.log(`Database ready at ${VERSION}`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Migration failed');
    process.exitCode = 1;
  } finally { await pool.end(); }
}

export async function migrate(pool: Pool): Promise<void> {
  const sql = (await readFile(new URL('./baseline.sql', import.meta.url), 'utf8')).replaceAll('\r\n', '\n');
  const checksum = createHash('sha256').update(sql).digest('hex');
  const tables = [...sql.matchAll(/CREATE TABLE (\w+)/g)].map(match => match[1]!);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // A single transaction and connection protect parallel invocations and DDL.
    await client.query("SELECT pg_advisory_xact_lock(hashtext('homestay-node-migrations'))");
    const schemaResult = await client.query<{ schema: string }>('SELECT current_schema() AS schema');
    const schema = schemaResult.rows[0]?.schema;
    if (!schema) throw new Error('A writable PostgreSQL search_path schema is required');
    const existing = await client.query<{ tablename: string }>(
      'SELECT tablename FROM pg_tables WHERE schemaname=$1', [schema]);
    if (existing.rowCount === 0) {
      await client.query(sql);
    } else {
      if (!existing.rows.some(row => row.tablename === 'alembic_version')) {
        throw new Error('Refusing to initialize a non-empty database without a recognized Alembic baseline');
      }
      const head = await client.query<{ version_num: string }>('SELECT version_num FROM alembic_version');
      if (head.rows.length !== 1 || head.rows[0]?.version_num !== LEGACY_HEAD) {
        throw new Error(`Database must be at Alembic head ${LEGACY_HEAD}; migrate it with the legacy release first`);
      }
    }

    // Build the frozen baseline in an isolated scratch schema to detect drift
    // before stamping an existing database. PostgreSQL renders both definitions.
    const actual = await signature(client, schema, tables);
    const reference = `homestay_baseline_${randomUUID().replaceAll('-', '')}`;
    await client.query(`CREATE SCHEMA ${identifier(reference)}`);
    await client.query(`SET LOCAL search_path TO ${identifier(reference)}, public`);
    await client.query(sql);
    const expected = await signature(client, reference, tables);
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      const difference = expected.find(row => !actual.some(item => JSON.stringify(item) === JSON.stringify(row)));
      throw new Error(`Schema differs from the reviewed legacy baseline${difference ? `: ${difference.kind} ${difference.name}` : ''}; no migration was applied`);
    }
    await client.query(`SET LOCAL search_path TO ${identifier(schema)}, public`);
    await client.query(`DROP SCHEMA ${identifier(reference)} CASCADE`);
    await client.query(`CREATE TABLE IF NOT EXISTS node_migrations (
      version text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now()
    )`);
    const applied = await client.query<{ checksum: string }>('SELECT checksum FROM node_migrations WHERE version=$1', [VERSION]);
    if (applied.rows[0] && applied.rows[0].checksum !== checksum) {
      throw new Error('Applied migration checksum changed; restore the released migration');
    }
    await client.query('INSERT INTO node_migrations(version,checksum) VALUES($1,$2) ON CONFLICT(version) DO NOTHING', [VERSION, checksum]);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally { client.release(); }
}
