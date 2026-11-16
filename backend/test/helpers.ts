import { randomUUID } from 'node:crypto';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import { loadConfig } from '../src/config.js';
import { createApp } from '../src/app.js';
import { migrate } from '../src/db/migrate.js';
import { seed } from '../src/db/seed.js';
import type { StorageService } from '../src/modules/storage.js';

export const testSecret = 'test-only-jwt-secret-never-used-in-production';

export async function setupTest(options: { storage?: StorageService; initialize?: boolean } = {}) {
  const connectionString = (process.env.HOMESTAY_TEST_DATABASE_URL ??
    'postgresql://homestay:homestay@127.0.0.1:5432/homestay_test')
    .replace(/^postgresql\+(asyncpg|psycopg):/, 'postgresql:');
  const url = new URL(connectionString);
  if (!url.pathname.endsWith('_test')) throw new Error('Test database name must end in _test');
  const admin = new pg.Pool({ connectionString, connectionTimeoutMillis: 5000 });
  const schema = `test_${randomUUID().replaceAll('-', '')}`;
  await admin.query(`CREATE SCHEMA "${schema}"`);
  const pool = new pg.Pool({ connectionString, options: `-c search_path=${schema}`, max: 15 });
  const uploadDir = await mkdtemp(join(tmpdir(), 'homestay-http-'));
  const config = loadConfig({ HOMESTAY_DATABASE_URL: connectionString, HOMESTAY_JWT_SECRET: testSecret,
    HOMESTAY_UPLOAD_DIR: uploadDir });
  const close = async () => {
    await pool.end();
    await admin.query(`DROP SCHEMA "${schema}" CASCADE`);
    await admin.end();
    await rm(uploadDir, { recursive: true, force: true });
  };
  try {
    if (options.initialize !== false) {
      await migrate(pool);
      await seed(pool, false);
    }
    return { app: createApp({ pool, config, storage: options.storage }), pool, config, close };
  } catch (error) { await close(); throw error; }
}

export const testContext = setupTest;

export async function seedFixture(pool: pg.Pool) {
  const orgId = randomUUID();
  const propertyId = randomUUID();
  const roomTypeId = randomUUID();
  const roomId = randomUUID();
  const ownerId = randomUUID();
  const staffId = randomUUID();
  await pool.query('INSERT INTO organizations(id,name,slug) VALUES($1,$2,$3)', [orgId, 'Test Org', `org-${orgId}`]);
  await pool.query(`INSERT INTO properties(id,org_id,name,slug,status,unit_code,operational_status,bedrooms,bathrooms,max_guests)
    VALUES($1,$2,'Test Property',$3,'active','T101','available',1,1,2)`, [propertyId, orgId, `prop-${propertyId}`]);
  await pool.query(`INSERT INTO room_types(id,property_id,name,base_price,capacity_adults,capacity_children)
    VALUES($1,$2,'Standard',500000,2,0)`, [roomTypeId, propertyId]);
  await pool.query("INSERT INTO rooms(id,room_type_id,code,status) VALUES($1,$2,'T101','active')", [roomId, roomTypeId]);
  for (const [id, code] of [[ownerId, 'owner'], [staffId, 'staff']]) {
    await pool.query(`INSERT INTO users(id,email,full_name,is_active) VALUES($1,$2,$3,true)`, [id, `${code}@example.com`, code]);
    await pool.query(`INSERT INTO user_org_roles(user_id,org_id,role_id) SELECT $1,$2,id FROM roles WHERE code=$3`, [id, orgId, code]);
  }
  const token = (id: string) => jwt.sign({ sub: id }, testSecret, { algorithm: 'HS256', expiresIn: '1h' });
  return { roomId, roomTypeId, propertyId, orgId, ownerId, ownerToken: token(ownerId), staffId, staffToken: token(staffId) };
}
