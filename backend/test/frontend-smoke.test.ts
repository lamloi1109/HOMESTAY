import assert from 'node:assert/strict';
import { test } from 'node:test';
import { once } from 'node:events';
import { setupTest, seedFixture } from './helpers.js';

test('the actual frontend client browses and reserves through Express without accepting offline fallback data', async () => {
  const ctx = await setupTest();
  const server = ctx.app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  process.env.NEXT_PUBLIC_API_URL = `http://127.0.0.1:${address.port}`;
  try {
    const f = await seedFixture(ctx.pool);
    const client = await import(new URL('../../frontend/src/lib/api.ts', import.meta.url).href);
    const properties = await client.fetchProperties();
    assert.equal(properties.length, 1);
    assert.equal(properties[0].id, f.propertyId);
    const detail = await client.fetchPropertyDetail(f.propertyId);
    assert.equal(detail.room_types[0].rooms[0].id, f.roomId);
    const check_in = new Date(Date.now()+86400000).toISOString().slice(0,10);
    const check_out = new Date(Date.now()+2*86400000).toISOString().slice(0,10);
    const rooms = await client.fetchAvailableRooms(f.roomTypeId, check_in, check_out);
    assert.equal(rooms[0].id, f.roomId);
    const booking = await client.createBooking({room_id:f.roomId,check_in,check_out,guest_name:'Frontend Guest',guest_email:'frontend@example.com',num_guests:2});
    assert.equal(booking.total_amount, '500000');
    assert.equal((await client.fetchBookingByCode(booking.code)).id, booking.id);
    assert.deepEqual(await client.fetchAvailableRooms(f.roomTypeId,check_in,check_out), []);
    const inquiry = await client.createInquiry({guest_name:'Visitor',phone:'0123456789',property_id:f.propertyId});
    assert.equal(inquiry.success, true);
    await assert.rejects(client.createBooking({room_id:f.roomId,check_in,check_out,guest_name:'Conflict',guest_email:'conflict@example.com',num_guests:2}), {status:409});
  } finally {
    delete process.env.NEXT_PUBLIC_API_URL;
    await new Promise<void>((resolve,reject) => { server.close(error => error ? reject(error) : resolve()); });
    await ctx.close();
  }
});
