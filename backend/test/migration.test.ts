import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import request from 'supertest';
import type { Pool } from 'pg';
import { migrate } from '../src/db/migrate.js';
import { seed } from '../src/db/seed.js';
import { setupTest } from './helpers.js';

const legacySql = () => readFile(new URL('../src/db/baseline.sql', import.meta.url), 'utf8');

async function records(pool: Pool) {
  const tables = (await pool.query<{ tablename: string }>(`SELECT tablename FROM pg_tables
    WHERE schemaname=current_schema() AND tablename<>'node_migrations' ORDER BY tablename`)).rows;
  const snapshot: Record<string, unknown> = {};
  for (const { tablename } of tables) {
    snapshot[tablename] = (await pool.query(`SELECT row_to_json(t) AS row FROM "${tablename}"
      t ORDER BY row_to_json(t)::text`)).rows;
  }
  return snapshot;
}

test('fresh setup and explicit demo seed repeat without overwriting operational data or permissions', async () => {
  const ctx = await setupTest();
  try {
    assert.equal((await ctx.pool.query('SELECT count(*) FROM organizations')).rows[0].count, '0');
    await seed(ctx.pool, true);
    await ctx.pool.query("UPDATE properties SET price_nightly=1234567,operational_status='maintenance' WHERE unit_code='L1.29.08'");
    await ctx.pool.query("UPDATE roles SET permissions='[]'::jsonb,name='Custom owner' WHERE code='owner'");
    await ctx.pool.query("UPDATE users SET full_name='Existing changed account' WHERE email='owner@example.com'");
    const before = await records(ctx.pool);
    await migrate(ctx.pool);
    await seed(ctx.pool, true);
    await migrate(ctx.pool);
    assert.deepEqual(await records(ctx.pool), before);
    assert.equal((await ctx.pool.query('SELECT count(*) FROM node_migrations')).rows[0].count, '1');
  } finally { await ctx.close(); }
});

test('adopting a populated legacy head preserves accounts, booking codes, operational records and image keys', async () => {
  const ctx = await setupTest({ initialize: false });
  try {
    // This SQL is the frozen output of the three retained Alembic upgrade
    // revisions, not a schema created by the Node migrator.
    await ctx.pool.query(await legacySql());
    await seed(ctx.pool, true);
    const property = (await ctx.pool.query("SELECT id,org_id FROM properties WHERE unit_code='L1.29.08'")).rows[0];
    const room = (await ctx.pool.query(`SELECT r.id FROM rooms r JOIN room_types rt ON rt.id=r.room_type_id
      WHERE rt.property_id=$1`, [property.id])).rows[0];
    const user = (await ctx.pool.query("SELECT id FROM users WHERE email='owner@example.com'")).rows[0];
    const booking = (await ctx.pool.query(`INSERT INTO bookings(code,org_id,property_id,room_id,user_id,
      guest_name,guest_email,num_guests,check_in,check_out,status,version,total_amount,currency)
      VALUES('LEGACY35',$1,$2,$3,$4,'Legacy Guest','legacy@example.com',2,'2030-05-01','2030-05-02',
      'confirmed',4,2200000,'VND') RETURNING id`, [property.org_id, property.id, room.id, user.id])).rows[0];
    await ctx.pool.query(`INSERT INTO booking_nights(id,booking_id,room_id,night,price)
      VALUES(gen_random_uuid(),$1,$2,'2030-05-01',2200000)`, [booking.id, room.id]);
    await ctx.pool.query(`INSERT INTO property_images(property_id,stored_name,original_name,alt,sort_order)
      VALUES($1,'legacy-existing.jpg','original.jpg','Existing gallery',0)`, [property.id]);
    await ctx.pool.query(`INSERT INTO payments(booking_id,provider,status,amount,currency)
      VALUES($1,'manual','success',2200000,'VND')`, [booking.id]);
    await ctx.pool.query(`INSERT INTO ledger_entries(txn_group_id,org_id,account,booking_id,debit,credit)
      VALUES(gen_random_uuid(),$1,'cash',$2,2200000,0)`, [property.org_id, booking.id]);
    await ctx.pool.query(`INSERT INTO audit_logs(org_id,actor_user_id,action,entity_type,entity_id)
      VALUES($1,$2,'confirm','booking',$3)`, [property.org_id, user.id, booking.id]);
    const before = await records(ctx.pool);
    await migrate(ctx.pool);
    await migrate(ctx.pool);
    assert.deepEqual(await records(ctx.pool), before);
    await request(ctx.app).post('/api/v1/auth/login')
      .send({ email: 'owner@example.com', password: 'demo12345' }).expect(200);
    const lookup = await request(ctx.app).get('/api/v1/bookings/LEGACY35').expect(200);
    assert.equal(lookup.body.id, booking.id);
    assert.equal(lookup.body.version, 4);
    assert.equal(lookup.body.total_amount, '2200000');
    const detail = await request(ctx.app).get(`/api/v1/properties/${property.id}`).expect(200);
    assert.equal(detail.body.images[0].url, '/uploads/legacy-existing.jpg');
  } finally { await ctx.close(); }
});

test('unrecognized schemas, old heads and missing room-night uniqueness fail without stamping or changing data', async () => {
  const ctx = await setupTest({ initialize: false });
  try {
    await ctx.pool.query('CREATE TABLE unrelated(id integer PRIMARY KEY)');
    await assert.rejects(migrate(ctx.pool), /non-empty database/);
    await ctx.pool.query('DROP TABLE unrelated');
    await ctx.pool.query(await legacySql());
    await ctx.pool.query("UPDATE alembic_version SET version_num='351b802d83ed'");
    await assert.rejects(migrate(ctx.pool), /must be at Alembic head/);
    await ctx.pool.query("UPDATE alembic_version SET version_num='1fbacdbbe084'");
    await seed(ctx.pool, true);
    await ctx.pool.query('ALTER TABLE booking_nights DROP CONSTRAINT uq_room_night');
    const before = await records(ctx.pool);
    await assert.rejects(migrate(ctx.pool), /Schema differs/);
    assert.deepEqual(await records(ctx.pool), before);
    assert.equal((await ctx.pool.query("SELECT to_regclass('node_migrations') AS name")).rows[0].name, null);
  } finally { await ctx.close(); }
});
