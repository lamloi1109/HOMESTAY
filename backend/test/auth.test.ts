import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { setupTest, seedFixture, testSecret } from './helpers.js';

test('registration normalizes email, rejects duplicates, and login projects current user', async () => {
  const ctx = await setupTest();
  try {
    const body = { email: 'Guest@Example.com', password: 'password123', full_name: 'Guest' };
    const registered = await request(ctx.app).post('/api/v1/auth/register').send(body).expect(201);
    assert.equal(registered.body.email, 'guest@example.com');
    assert.equal(registered.body.phone, null);
    assert.equal('hashed_password' in registered.body, false);
    await request(ctx.app).post('/api/v1/auth/register').send(body).expect(409);
    const login = await request(ctx.app).post('/api/v1/auth/login').send(body).expect(200);
    assert.equal(login.body.token_type, 'bearer');
    const me = await request(ctx.app).get('/api/v1/auth/me').auth(login.body.access_token, { type: 'bearer' }).expect(200);
    assert.deepEqual(me.body, registered.body);
    await request(ctx.app).post('/api/v1/auth/login').send({ ...body, password: 'wrong' }).expect(401);
    await request(ctx.app).post('/api/v1/auth/register').send({ ...body, email: 'invalid', password: 'short' }).expect(422);
    // bcrypt ignores bytes after 72; reject rather than accept a truncated secret.
    const longPassword = 'mật'.repeat(20);
    await request(ctx.app).post('/api/v1/auth/register').send({ ...body, email: 'long@example.com', password: longPassword }).expect(422);
    await request(ctx.app).post('/api/v1/auth/login').send({ email: body.email, password: body.password + 'x'.repeat(80) }).expect(401);
  } finally { await ctx.close(); }
});

test('legacy bcrypt hash and HS256 token remain valid, inactive and invalid credentials are rejected', async () => {
  const ctx = await setupTest();
  try {
    // Fixture created with Python bcrypt.hashpw(b"legacy123", bcrypt.gensalt()).
    const hash = '$2b$12$gqyLWv6.npLQF1dUTYMs..THkXLYFozAMMrnC09PvC0P.js/oEGa2';
    const { rows: [user] } = await ctx.pool.query(`INSERT INTO users(id,email,full_name,hashed_password,is_active)
      VALUES('11111111-1111-1111-1111-111111111111','legacy@example.com','Legacy',$1,true) RETURNING id`, [hash]);
    // Python PyJWT HS256 fixture, dedicated test secret, expiry 2100-01-01.
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTExMTExMS0xMTExLTExMTEtMTExMS0xMTExMTExMTExMTEiLCJpYXQiOjE3MDQwNjcyMDAsImV4cCI6NDEwMjQ0NDgwMH0.1fVQqECkMwWhl88FQiesdZEb2qZxrlff2bqxQhfOF2k';
    await request(ctx.app).get('/api/v1/auth/me').auth(token, { type: 'bearer' }).expect(200);
    await request(ctx.app).post('/api/v1/auth/login').send({ email: 'legacy@example.com', password: 'legacy123' }).expect(200);
    const expired = jwt.sign({ sub: user.id, exp: 1 }, testSecret);
    for (const bad of [expired, 'bad', jwt.sign({ sub: 'bad-uuid' }, testSecret)]) {
      await request(ctx.app).get('/api/v1/auth/me').auth(bad, { type: 'bearer' }).expect(401);
    }
    await ctx.pool.query('UPDATE users SET is_active=false WHERE id=$1', [user.id]);
    await request(ctx.app).get('/api/v1/auth/me').auth(token, { type: 'bearer' }).expect(401);
    await request(ctx.app).post('/api/v1/auth/login').send({ email: 'legacy@example.com', password: 'legacy123' }).expect(401);
  } finally { await ctx.close(); }
});

test('organization ownership and permission data enforce staff and cross-organization boundaries', async () => {
  const ctx = await setupTest();
  try {
    const fixture = await seedFixture(ctx.pool);
    const owner = (r: request.Test) => r.auth(fixture.ownerToken, { type: 'bearer' });
    const staff = (r: request.Test) => r.auth(fixture.staffToken, { type: 'bearer' });
    const created = await owner(request(ctx.app).post('/api/v1/orgs')).send({ name: 'New', slug: 'new' }).expect(201);
    await owner(request(ctx.app).get(`/api/v1/orgs/${created.body.id}/revenue`)).expect(200);
    await staff(request(ctx.app).get(`/api/v1/orgs/${created.body.id}/revenue`)).expect(403);
    await staff(request(ctx.app).get(`/api/v1/orgs/${fixture.orgId}/revenue`)).expect(403);
    await staff(request(ctx.app).post(`/api/v1/orgs/${fixture.orgId}/properties`)).send({name:'No',slug:'no'}).expect(403);
    await owner(request(ctx.app).post(`/api/v1/orgs/${created.body.id}/members`)).send({email:'staff@example.com',role_code:'owner'}).expect(201);
    await staff(request(ctx.app).get(`/api/v1/orgs/${created.body.id}/revenue`)).expect(200);
    await owner(request(ctx.app).post(`/api/v1/orgs/${created.body.id}/members`)).send({email:'missing@example.com',role_code:'staff'}).expect(404);
    await request(ctx.app).post('/api/v1/orgs').send({name:'No',slug:'no'}).expect(401);
  } finally { await ctx.close(); }
});

test('legacy Unicode email accounts and normalized IDN domains remain usable across auth and members', async () => {
  const ctx = await setupTest();
  try {
    const f = await seedFixture(ctx.pool);
    const hash = '$2b$12$gqyLWv6.npLQF1dUTYMs..THkXLYFozAMMrnC09PvC0P.js/oEGa2';
    await ctx.pool.query(`INSERT INTO users(email,hashed_password,full_name,is_active)
      VALUES('tôi@example.com',$1,'Unicode',true),('user@bücher.de',$1,'IDN',true)`, [hash]);
    for (const email of ['tôi@example.com','user@xn--bcher-kva.de']) {
      await request(ctx.app).post('/api/v1/auth/login').send({email,password:'legacy123'}).expect(200);
      await request(ctx.app).post(`/api/v1/orgs/${f.orgId}/members`).auth(f.ownerToken,{type:'bearer'})
        .send({email,role_code:'staff'}).expect(201);
    }
    const registered = await request(ctx.app).post('/api/v1/auth/register')
      .send({email:'MỚI@xn--bcher-kva.de',password:'legacy123',full_name:'New account'}).expect(201);
    assert.equal(registered.body.email,'mới@bücher.de');
    const check_in = new Date(Date.now()+86400000).toISOString().slice(0,10);
    const check_out = new Date(Date.now()+2*86400000).toISOString().slice(0,10);
    const booking = await request(ctx.app).post('/api/v1/bookings').send({room_id:f.roomId,
      check_in,check_out,guest_name:'Unicode',guest_email:'tôi@xn--bcher-kva.de'}).expect(201);
    assert.equal(booking.body.guest_email,'tôi@bücher.de');
  } finally { await ctx.close(); }
});

test('signed tokens issued in the future are rejected like the legacy PyJWT decoder', async () => {
  const ctx = await setupTest();
  try {
    const f = await seedFixture(ctx.pool);
    const token = jwt.sign({sub:f.ownerId,iat:Math.floor(Date.now()/1000)+3600},testSecret,{expiresIn:'2h'});
    await request(ctx.app).get('/api/v1/auth/me').auth(token,{type:'bearer'}).expect(401);
  } finally { await ctx.close(); }
});
