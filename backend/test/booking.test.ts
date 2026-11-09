import assert from 'node:assert/strict';
import { test } from 'node:test';
import request from 'supertest';
import { setupTest, seedFixture } from './helpers.js';

const day = (offset: number) => new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10);

test('concurrent HTTP reservations allow one hold, preserve half-open stays, and roll back conflicts', async () => {
  const ctx = await setupTest();
  try {
    const f = await seedFixture(ctx.pool);
    const body = { room_id: f.roomId, check_in: day(1), check_out: day(3), guest_name: 'Guest', guest_email: 'guest@example.com' };
    const results = await Promise.all(Array.from({ length: 10 }, () => request(ctx.app).post('/api/v1/bookings').send(body)));
    assert.equal(results.filter(r => r.status === 201).length, 1);
    assert.equal(results.filter(r => r.status === 409).length, 9);
    const booking = results.find(r => r.status === 201)!.body;
    assert.equal(booking.total_amount, '1000000');
    assert.match(booking.code, /^BK[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{8}$/);
    assert.equal(booking.version, 0);
    assert.equal(booking.status, 'pending');
    assert.equal((await request(ctx.app).get(`/api/v1/bookings/${booking.code.toLowerCase()}`)).body.id, booking.id);
    const calendar = await request(ctx.app).get(`/api/v1/rooms/${f.roomId}/availability`).query({ from: day(1), to: day(4) });
    assert.deepEqual(calendar.body.unavailable_nights, [day(1), day(2)]);
    const available = await request(ctx.app).get(`/api/v1/room-types/${f.roomTypeId}/available-rooms`).query({ check_in: day(1), check_out: day(3) });
    assert.deepEqual(available.body, []);
    assert.equal((await request(ctx.app).post('/api/v1/bookings').send({ ...body, check_in: day(2), check_out: day(4) })).status, 409);
    assert.equal((await request(ctx.app).post('/api/v1/bookings').send({ ...body, check_in: day(3), check_out: day(4) })).status, 201);
    assert.equal((await request(ctx.app).get(`/api/v1/orgs/${f.orgId}/bookings`).auth(f.ownerToken, { type: 'bearer' })).body.length, 2);
  } finally { await ctx.close(); }
});

test('confirmation and cancellation use optimistic versions, permissions, and release nights', async () => {
  const ctx = await setupTest();
  try {
    const f = await seedFixture(ctx.pool);
    const made = await request(ctx.app).post('/api/v1/bookings').send({ room_id: f.roomId, check_in: day(1), check_out: day(2), guest_name: 'Guest', guest_email: 'g@example.com' });
    assert.equal(made.status, 201);
    const id = made.body.id;
    assert.equal((await request(ctx.app).post(`/api/v1/bookings/${id}/confirm`).send({ version: 0 })).status, 401);
    const confirmed = await request(ctx.app).post(`/api/v1/bookings/${id}/confirm`).auth(f.staffToken, { type: 'bearer' }).send({ version: 0 });
    assert.equal(confirmed.status, 200);
    assert.equal(confirmed.body.status, 'confirmed');
    assert.equal(confirmed.body.expires_at, null);
    assert.equal(confirmed.body.version, 1);
    assert.equal((await request(ctx.app).post(`/api/v1/bookings/${id}/confirm`).auth(f.ownerToken, { type: 'bearer' }).send({ version: 0 })).status, 409);
    assert.equal((await request(ctx.app).post(`/api/v1/bookings/${id}/cancel`).auth(f.ownerToken, { type: 'bearer' }).send({ version: 0 })).status, 409);
    const cancelled = await request(ctx.app).post(`/api/v1/bookings/${id}/cancel`).auth(f.ownerToken, { type: 'bearer' }).send({ version: 1 });
    assert.equal(cancelled.status, 200);
    assert.equal(cancelled.body.status, 'cancelled');
    const available = await request(ctx.app).get(`/api/v1/room-types/${f.roomTypeId}/available-rooms`).query({ check_in: day(1), check_out: day(2) });
    assert.equal(available.body[0].id, f.roomId);
    assert.equal((await request(ctx.app).post(`/api/v1/bookings/${id}/cancel`).auth(f.ownerToken, { type: 'bearer' }).send({ version: 2 })).status, 409);
  } finally { await ctx.close(); }
});

test('expired holds disappear from availability, cannot confirm, are reclaimed immediately, and expire repeatably', async () => {
  const ctx = await setupTest();
  try {
    const f = await seedFixture(ctx.pool);
    const body = { room_id: f.roomId, check_in: day(1), check_out: day(2), guest_name: 'Guest', guest_email: 'g@example.com' };
    const old = (await request(ctx.app).post('/api/v1/bookings').send(body)).body;
    await ctx.pool.query("UPDATE bookings SET expires_at=now()-interval '1 minute' WHERE id=$1", [old.id]);
    const calendar = await request(ctx.app).get(`/api/v1/rooms/${f.roomId}/availability`).query({ from: day(1), to: day(2) });
    assert.deepEqual(calendar.body.unavailable_nights, []);
    assert.equal((await request(ctx.app).post(`/api/v1/bookings/${old.id}/confirm`).auth(f.ownerToken, { type: 'bearer' }).send({ version: 0 })).status, 409);
    const replacement = await request(ctx.app).post('/api/v1/bookings').send(body);
    assert.equal(replacement.status, 201);
    assert.equal((await request(ctx.app).get(`/api/v1/bookings/${old.code}`)).body.status, 'expired');
    await ctx.pool.query("UPDATE bookings SET expires_at=now()-interval '1 minute' WHERE id=$1", [replacement.body.id]);
    assert.deepEqual((await request(ctx.app).post('/api/v1/internal/expire-bookings')).body, { expired: 1 });
    assert.deepEqual((await request(ctx.app).post('/api/v1/internal/expire-bookings')).body, { expired: 0 });
    assert.equal((await request(ctx.app).post('/api/v1/bookings').send(body)).status, 201);
  } finally { await ctx.close(); }
});

test('pricing respects priority, weekday/date overrides, and exact integer money', async () => {
  const ctx = await setupTest();
  try {
    const f = await seedFixture(ctx.pool);
    await ctx.pool.query(`INSERT INTO price_rules (room_type_id,name,date_start,date_end,price,priority) VALUES ($1,'special',$2,$2,765432,10)`, [f.roomTypeId, day(2)]);
    const weekday = (new Date(`${day(2)}T00:00:00Z`).getUTCDay() + 6) % 7;
    // Higher priority only wins on a matching weekday; the end date is inclusive.
    await ctx.pool.query(`INSERT INTO price_rules (room_type_id,name,date_start,date_end,weekday_mask,price,priority)
      VALUES ($1,'wrong weekday',$2,$2,$3,999999,50), ($1,'lower priority',$2,$2,NULL,123456,1)`, [f.roomTypeId, day(2), 1 << ((weekday + 1) % 7)]);
    const result = await request(ctx.app).post('/api/v1/bookings').send({ room_id: f.roomId, check_in: day(1), check_out: day(4), guest_name: 'Guest', guest_email: 'g@example.com' });
    assert.equal(result.status, 201);
    assert.equal(result.body.total_amount, '1765432');
  } finally { await ctx.close(); }
});

test('booking date, identifier, guest, length and maintenance errors retain validation contracts', async () => {
  const ctx = await setupTest();
  try {
    const f = await seedFixture(ctx.pool);
    const body = { room_id: f.roomId, check_in: day(1), check_out: day(2), guest_name: 'Guest', guest_email: 'g@example.com' };
    for (const change of [{ room_id: 'bad' }, { check_in: '2030-02-30' }, { check_in: day(-1) }, { check_out: day(1) }, { check_out: day(33) }, { guest_email: 'bad' }, { num_guests: 0 }]) {
      assert.equal((await request(ctx.app).post('/api/v1/bookings').send({ ...body, ...change })).status, 422);
    }
    await ctx.pool.query("UPDATE rooms SET status='maintenance' WHERE id=$1", [f.roomId]);
    assert.equal((await request(ctx.app).post('/api/v1/bookings').send(body)).status, 422);
    assert.equal((await request(ctx.app).get('/api/v1/bookings/MISSING')).status, 404);
    assert.equal((await request(ctx.app).get(`/api/v1/orgs/${f.orgId}/bookings`).auth(f.ownerToken, { type: 'bearer' }).query({ status: 'bad' })).status, 422);
  } finally { await ctx.close(); }
});

test('a failed night insert rolls back the entire HTTP reservation without orphaned booking rows', async () => {
  const ctx = await setupTest();
  try {
    const f = await seedFixture(ctx.pool);
    await ctx.pool.query(`CREATE FUNCTION reject_test_night() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'fixture insertion failure'; END $$;
      CREATE TRIGGER reject_test_night BEFORE INSERT ON booking_nights FOR EACH ROW EXECUTE FUNCTION reject_test_night()`);
    const body = { room_id: f.roomId, check_in: day(1), check_out: day(2), guest_name: 'Guest', guest_email: 'g@example.com' };
    assert.equal((await request(ctx.app).post('/api/v1/bookings').send(body)).status, 500);
    const bookings = await request(ctx.app).get(`/api/v1/orgs/${f.orgId}/bookings`).auth(f.ownerToken, { type: 'bearer' });
    assert.equal(bookings.status, 200);
    assert.deepEqual(bookings.body, []);
    await ctx.pool.query('DROP TRIGGER reject_test_night ON booking_nights; DROP FUNCTION reject_test_night()');
    assert.equal((await request(ctx.app).post('/api/v1/bookings').send(body)).status, 201);
  } finally { await ctx.close(); }
});


test('an authenticated booking owner can cancel without an organization membership; another user cannot', async () => {
  const ctx = await setupTest();
  try {
    const f = await seedFixture(ctx.pool);
    await ctx.pool.query('DELETE FROM user_org_roles WHERE user_id=$1', [f.ownerId]);
    const body = { room_id: f.roomId, check_in: day(1), check_out: day(2), guest_name: 'Guest', guest_email: 'g@example.com' };
    const owned = await request(ctx.app).post('/api/v1/bookings').auth(f.ownerToken, { type: 'bearer' }).send(body);
    assert.equal(owned.status, 201);
    assert.equal((await request(ctx.app).post(`/api/v1/bookings/${owned.body.id}/confirm`).auth(f.ownerToken, { type: 'bearer' }).send({ version: 0 })).status, 403);
    assert.equal((await request(ctx.app).post(`/api/v1/bookings/${owned.body.id}/cancel`).auth(f.ownerToken, { type: 'bearer' }).send({ version: 0 })).status, 200);
    const guest = await request(ctx.app).post('/api/v1/bookings').send(body);
    assert.equal(guest.status, 201);
    assert.equal((await request(ctx.app).post(`/api/v1/bookings/${guest.body.id}/cancel`).auth(f.ownerToken, { type: 'bearer' }).send({ version: 0 })).status, 403);
  } finally { await ctx.close(); }
});
