import assert from 'node:assert/strict';
import { test } from 'node:test';
import request from 'supertest';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { setupTest, seedFixture } from './helpers.js';
import { R2Storage } from '../src/modules/storage.js';

test('catalog writes enforce organization permissions and public details retain nested projections', async () => {
  const ctx = await setupTest();
  try {
    const f = await seedFixture(ctx.pool);
    const path = `/api/v1/orgs/${f.orgId}/properties`;
    const data = {name: 'Second home', slug: 'second-home', city: 'Ho Chi Minh'};
    assert.equal((await request(ctx.app).post(path).send(data)).status, 401);
    assert.equal((await request(ctx.app).post(path).auth(f.staffToken, {type:'bearer'}).send(data)).status, 403);
    const created = await request(ctx.app).post(path).auth(f.ownerToken, {type:'bearer'}).send(data);
    assert.equal(created.status, 201, created.text);
    assert.equal(created.body.status, 'active');
    assert.equal(created.body.price_monthly, null);
    const rt = await request(ctx.app).post(`/api/v1/properties/${created.body.id}/room-types`).auth(f.ownerToken, {type:'bearer'}).send({name:'Suite', base_price:'700000'});
    assert.equal(rt.status, 201, rt.text);
    assert.equal(rt.body.base_price, '700000');
    const room = await request(ctx.app).post(`/api/v1/room-types/${rt.body.id}/rooms`).auth(f.ownerToken, {type:'bearer'}).send({code:'S101'});
    assert.equal(room.status, 201, room.text);
    const amenities = await request(ctx.app).get('/api/v1/amenities');
    assert.equal(amenities.status, 200);
    const codes = amenities.body.slice(0,2).map((a: {code:string}) => a.code);
    const set = await request(ctx.app).put(`/api/v1/properties/${created.body.id}/amenities`).auth(f.ownerToken, {type:'bearer'}).send({amenity_codes: codes});
    assert.equal(set.status, 200, set.text);
    const detail = await request(ctx.app).get(`/api/v1/properties/${created.body.id}`);
    assert.equal(detail.status, 200);
    assert.equal(detail.body.room_types[0].rooms[0].code, 'S101');
    assert.deepEqual(detail.body.amenities.map((a:{code:string})=>a.code).sort(), codes.sort());
    assert.deepEqual(detail.body.images, []);
    const missing = await request(ctx.app).put(`/api/v1/properties/${created.body.id}/amenities`).auth(f.ownerToken, {type:'bearer'}).send({amenity_codes:['does-not-exist']});
    assert.equal(missing.status, 422);
    assert.equal((await request(ctx.app).get('/api/v1/properties/not-a-uuid')).status, 422);
    assert.equal((await request(ctx.app).get('/api/v1/properties/00000000-0000-0000-0000-000000000001')).status, 404);
  } finally { await ctx.close(); }
});

test('image uploads validate bytes, serialize concurrent ordering, publish URLs and delete files', async () => {
  const ctx = await setupTest();
  try {
    const f = await seedFixture(ctx.pool);
    const path = `/api/v1/properties/${f.propertyId}/images`;
    const png = Buffer.from([137,80,78,71,13,10,26,10,0]);
    assert.equal((await request(ctx.app).post(path).attach('file',png,'a.png')).status, 401);
    assert.equal((await request(ctx.app).post(path).auth(f.staffToken,{type:'bearer'}).attach('file',png,'a.png')).status, 403);
    assert.equal((await request(ctx.app).post(path).auth(f.ownerToken,{type:'bearer'}).attach('file',Buffer.from('fake image'),'a.png')).status, 422);
    assert.equal((await request(ctx.app).post(path).auth(f.ownerToken,{type:'bearer'}).attach('file',Buffer.alloc(10*1024*1024+1),'huge.png')).status, 422);
    const uploaded = await Promise.all(Array.from({length:6}, (_,i) => request(ctx.app).post(path).auth(f.ownerToken,{type:'bearer'}).field('alt',`Front ${i}`).attach('file',png,`a${i}.exe`)));
    for (const response of uploaded) assert.equal(response.status,201,response.text);
    assert.deepEqual(uploaded.map(r => r.body.sort_order).sort(),[0,1,2,3,4,5]);
    const detail = await request(ctx.app).get(`/api/v1/properties/${f.propertyId}`);
    assert.equal(detail.body.images.length,6);
    assert.match(detail.body.images[0].url,/^\/uploads\/[a-f0-9]+\.png$/);
    assert.equal((await request(ctx.app).get(detail.body.images[0].url)).status,200);
    const listed = await request(ctx.app).get('/api/v1/properties');
    assert.equal(listed.body.find((p:{id:string})=>p.id===f.propertyId).cover_image,detail.body.images[0].url);
    const image = detail.body.images[0];
    assert.equal((await request(ctx.app).delete(`/api/v1/property-images/${image.id}`).auth(f.staffToken,{type:'bearer'})).status,403);
    assert.equal((await request(ctx.app).delete(`/api/v1/property-images/${image.id}`).auth(f.ownerToken,{type:'bearer'})).status,204);
    assert.equal((await request(ctx.app).get(image.url)).status,404);
    assert.equal((await request(ctx.app).get(`/api/v1/properties/${f.propertyId}`)).body.images.length,5);
  } finally { await ctx.close(); }
});

test('public inquiries and administrative CRM preserve matching, filtering, pagination and null semantics', async () => {
  const ctx = await setupTest();
  try {
    const f = await seedFixture(ctx.pool);
    await ctx.pool.query("UPDATE properties SET unit_code='TEST.01' WHERE id=$1",[f.propertyId]);
    const create = await request(ctx.app).post('/api/v1/inquiries').send({guest_name:'  Visitor  ',phone:' 0987654321 ',unit_code:'TEST.01',email:' guest@example.com ',guest_count:3,checkin_date:'2027-01-02',note:'Original note'});
    assert.equal(create.status,201,create.text);
    assert.equal(create.body.success,true);
    const id = create.body.inquiry_id;
    assert.equal((await request(ctx.app).get('/api/v1/admin/inquiries')).status,401);
    // Legacy admin APIs permit any authenticated active account, including staff.
    const detail = await request(ctx.app).get(`/api/v1/admin/inquiries/${id}`).auth(f.staffToken,{type:'bearer'});
    assert.equal(detail.status,200,detail.text);
    assert.equal(detail.body.guest_name,'Visitor');
    assert.equal(detail.body.zalo,'0987654321');
    assert.equal(detail.body.unit_code,'TEST.01');
    assert.equal(detail.body.checkin_date,'2027-01-02');
    assert.equal(detail.body.created_at.endsWith('Z'),true);
    const updated = await request(ctx.app).patch(`/api/v1/admin/inquiries/${id}`).auth(f.staffToken,{type:'bearer'}).send({stage:'hold',note:null});
    assert.equal(updated.status,200,updated.text);
    assert.equal(updated.body.stage,'hold');
    assert.equal(updated.body.note,'Original note');
    const filtered = await request(ctx.app).get('/api/v1/admin/inquiries').auth(f.ownerToken,{type:'bearer'}).query({stage:'hold',channel:'web_form',search:'guest@example.com',limit:1,offset:0});
    assert.equal(filtered.status,200,filtered.text);
    assert.equal(filtered.body[0].id,id);
    assert.deepEqual((await request(ctx.app).get('/api/v1/admin/inquiries').auth(f.ownerToken,{type:'bearer'}).query({stage:'new'})).body,[]);
    assert.equal((await request(ctx.app).get('/api/v1/admin/inquiries').auth(f.ownerToken,{type:'bearer'}).query({limit:101})).status,422);
    assert.equal((await request(ctx.app).post('/api/v1/inquiries').send({guest_name:'x',phone:'short'})).status,422);
    assert.equal((await request(ctx.app).post('/api/v1/inquiries').send({guest_name:'x',phone:'0123456789',checkin_date:'2027-02-30'})).status,422);
    const fallback = await request(ctx.app).post('/api/v1/inquiries').send({guest_name:'Fallback',phone:'0123456789',unit_code:'unknown'});
    assert.equal(fallback.status,201);
    assert.equal((await request(ctx.app).get(`/api/v1/admin/inquiries/${fallback.body.inquiry_id}`).auth(f.ownerToken,{type:'bearer'})).body.property_id,null);
  } finally { await ctx.close(); }
});

test('administrative units, tour services and lease workflows preserve money and calculated fields', async () => {
  const ctx = await setupTest();
  try {
    const f = await seedFixture(ctx.pool);
    const unitPath = `/api/v1/admin/units/${f.propertyId}`;
    assert.equal((await request(ctx.app).get(unitPath)).status,401);
    const unit = await request(ctx.app).patch(unitPath).auth(f.staffToken,{type:'bearer'}).send({price_monthly:'38000000',description:'Lease home',operational_status:'held'});
    assert.equal(unit.status,200,unit.text);
    assert.equal(unit.body.price_monthly,'38000000');
    const clear = await request(ctx.app).patch(unitPath).auth(f.staffToken,{type:'bearer'}).send({description:null});
    assert.equal(clear.body.description,null);
    assert.equal(clear.body.price_monthly,'38000000');
    const detail = await request(ctx.app).get(unitPath).auth(f.staffToken,{type:'bearer'});
    assert.equal(detail.status,200,detail.text);
    assert.equal(detail.body.room_types[0].rooms[0].id,f.roomId);
    const service = await request(ctx.app).post('/api/v1/admin/services').auth(f.staffToken,{type:'bearer'}).send({name:'Airport transfer',category:'Transport',price:'450000',sort_order:10});
    assert.equal(service.status,201,service.text);
    assert.equal(service.body.price,'450000');
    assert.equal((await request(ctx.app).get('/api/v1/services').query({category:'Transport'})).body[0].id,service.body.id);
    const servicePath = `/api/v1/admin/services/${service.body.id}`;
    assert.equal((await request(ctx.app).patch(servicePath).auth(f.staffToken,{type:'bearer'}).send({is_active:false,price:'500000'})).status,200);
    assert.deepEqual((await request(ctx.app).get('/api/v1/services')).body,[]);
    assert.equal((await request(ctx.app).get('/api/v1/admin/services').auth(f.staffToken,{type:'bearer'})).body[0].price,'500000');
    assert.equal((await request(ctx.app).delete(servicePath).auth(f.staffToken,{type:'bearer'})).status,204);
    assert.equal((await request(ctx.app).delete(servicePath).auth(f.staffToken,{type:'bearer'})).status,404);
    const today = new Date().toISOString().slice(0,10);
    const lease = await request(ctx.app).post('/api/v1/admin/leases').auth(f.staffToken,{type:'bearer'}).send({property_id:f.propertyId,guest_name:'Tenant',start_date:today,end_date:today,monthly_rent:'38000000'});
    assert.equal(lease.status,201,lease.text);
    assert.equal(lease.body.days_remaining,0);
    assert.equal(lease.body.monthly_rent,'38000000');
    assert.equal(lease.body.start_date,today);
    assert.equal(lease.body.end_date,today);
    assert.equal(lease.body.residence_status,'pending');
    const leaseUpdated = await request(ctx.app).patch(`/api/v1/admin/leases/${lease.body.id}`).auth(f.staffToken,{type:'bearer'}).send({residence_status:'registered',document_status:'missing',phone:null});
    assert.equal(leaseUpdated.status,200,leaseUpdated.text);
    assert.equal(leaseUpdated.body.residence_status,'registered');
    const expiring = await request(ctx.app).get('/api/v1/admin/leases').auth(f.staffToken,{type:'bearer'}).query({expiring_days:1});
    assert.equal(expiring.status,200,expiring.text);
    assert.equal(expiring.body[0].id,lease.body.id);
  } finally { await ctx.close(); }
});

test('administrative errors and authenticated-account policy stay compatible without organization membership', async () => {
  const ctx = await setupTest();
  try {
    await seedFixture(ctx.pool);
    const registered = await request(ctx.app).post('/api/v1/auth/register').send({email:'outsider@example.com',password:'testpass123',full_name:'Outsider'});
    assert.equal(registered.status,201,registered.text);
    const login = await request(ctx.app).post('/api/v1/auth/login').send({email:'outsider@example.com',password:'testpass123'});
    const token = login.body.access_token;
    assert.equal((await request(ctx.app).get('/api/v1/admin/units').auth(token,{type:'bearer'})).status,200);
    const absent = '00000000-0000-0000-0000-000000000001';
    for (const path of [`/api/v1/admin/inquiries/${absent}`,`/api/v1/admin/units/${absent}`]) {
      assert.equal((await request(ctx.app).get(path).auth(token,{type:'bearer'})).status,404);
      assert.equal((await request(ctx.app).patch(path).auth(token,{type:'bearer'}).send({note:'new'})).status,404);
    }
    assert.equal((await request(ctx.app).patch(`/api/v1/admin/services/${absent}`).auth(token,{type:'bearer'}).send({price:1})).status,404);
    assert.equal((await request(ctx.app).patch(`/api/v1/admin/leases/${absent}`).auth(token,{type:'bearer'}).send({note:'new'})).status,404);
    assert.equal((await request(ctx.app).get('/api/v1/admin/leases').auth(token,{type:'bearer'}).query({expiring_days:'invalid'})).status,422);
    assert.equal((await request(ctx.app).post('/api/v1/admin/leases').auth(token,{type:'bearer'}).send({property_id:absent,guest_name:'Guest',start_date:'2027-01-01',end_date:'2027-02-01',monthly_rent:1000})).status,404);
    assert.equal((await request(ctx.app).post('/api/v1/admin/services').auth(token,{type:'bearer'}).send({name:'Negative',category:'Test',price:-1})).status,422);
    await ctx.pool.query('DELETE FROM organizations');
    assert.equal((await request(ctx.app).post('/api/v1/admin/services').auth(token,{type:'bearer'}).send({name:'Missing org',category:'Test',price:1000})).status,400);
    assert.equal((await request(ctx.app).post('/api/v1/inquiries').send({guest_name:'Missing org',phone:'0123456789'})).status,500);
  } finally { await ctx.close(); }
});

test('R2 uploads and deletion use isolated S3 transport while retaining public URL and metadata', async () => {
  const commands: (PutObjectCommand | DeleteObjectCommand)[] = [];
  const storage = new R2Storage({endpointUrl:'https://r2.invalid',accessKeyId:'test',secretAccessKey:'test',bucketName:'isolated-test',publicUrl:'https://images.example.com/',keyPrefix:'/properties/'},{async send(command) {commands.push(command); return {};}});
  const ctx = await setupTest({storage});
  try {
    const f = await seedFixture(ctx.pool);
    const png = Buffer.from([137,80,78,71,13,10,26,10,0]);
    const response = await request(ctx.app).post(`/api/v1/properties/${f.propertyId}/images`).auth(f.ownerToken,{type:'bearer'}).field('alt','R2 photo').attach('file',png,'source.png');
    assert.equal(response.status,201,response.text);
    assert.match(response.body.url,/^https:\/\/images\.example\.com\/properties\/[a-f0-9]+\.png$/);
    const published = (await request(ctx.app).get(`/api/v1/properties/${f.propertyId}`)).body.images[0];
    assert.equal(published.url,response.body.url);
    assert.equal(published.alt,'R2 photo');
    assert.equal(commands[0].input.Bucket,'isolated-test');
    assert.equal((commands[0] as PutObjectCommand).input.ContentType,'image/png');
    assert.equal((commands[0] as PutObjectCommand).input.CacheControl,'public, max-age=31536000, immutable');
    assert.equal((await request(ctx.app).delete(`/api/v1/property-images/${response.body.id}`).auth(f.ownerToken,{type:'bearer'})).status,204);
    assert.equal(commands[1].input.Key,commands[0].input.Key);
    assert.ok(commands[1] instanceof DeleteObjectCommand);
    assert.deepEqual((await request(ctx.app).get(`/api/v1/properties/${f.propertyId}`)).body.images,[]);
  } finally { await ctx.close(); }
});
