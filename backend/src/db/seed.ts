import { hash } from 'bcryptjs';
import { pathToFileURL } from 'node:url';
import { Pool, type PoolClient } from 'pg';
import { loadConfig } from '../config.js';
import { ROLE_SEED, AMENITY_SEED, GAOJI_UNITS_SEED, SERVICE_SEED } from './seed-data.js';

async function seedDemo(client: PoolClient) {
  const orgResult = await client.query<{ id: string }>(`INSERT INTO organizations(name,slug)
    VALUES('Gaoji House Serviced Apartments','gaoji-house') ON CONFLICT(slug) DO NOTHING RETURNING id`);
  const orgId = orgResult.rows[0]?.id ?? (await client.query<{ id: string }>(
    "SELECT id FROM organizations WHERE slug='gaoji-house'")).rows[0]!.id;
  for (const [email, password, fullName] of [
    ['owner@gaojihouse.vn', 'gaoji2026', 'Chủ Nhà Gaoji House'],
    ['owner@example.com', 'demo12345', 'Quản Lý Vận Hành Demo'],
  ]) {
    const user = await client.query<{ id: string }>(`INSERT INTO users(email,hashed_password,full_name,phone,is_active)
      VALUES($1,$2,$3,'0889237833',true) ON CONFLICT(email) DO NOTHING RETURNING id`,
    [email, await hash(password!, 12), fullName]);
    // Existing accounts and memberships are operational data; never change
    // their credentials or grant them a new owner membership on a rerun.
    if (user.rows[0]) await client.query(`INSERT INTO user_org_roles(user_id,org_id,role_id)
      SELECT $1,$2,id FROM roles WHERE code='owner' ON CONFLICT(user_id,org_id) DO NOTHING`,
    [user.rows[0].id, orgId]);
  }
  for (const service of SERVICE_SEED) {
    await client.query(`INSERT INTO tour_services(org_id,name,category,price,price_unit,description,icon,is_active,sort_order)
      SELECT $1::uuid,$2::varchar,$3::varchar,$4::numeric,$5::varchar,$6::text,$7::varchar,true,$8::integer WHERE NOT EXISTS
      (SELECT 1 FROM tour_services WHERE org_id=$1 AND name=$2)`,
    [orgId, service.name, service.category, service.price, service.price_unit,
      service.description, service.icon, service.sort_order]);
  }
  for (const unit of GAOJI_UNITS_SEED) {
    const property = await client.query<{ id: string }>(`INSERT INTO properties
      (org_id,status,unit_code,name,slug,tower,floor,view_type,price_monthly,price_nightly,sqm,
      bedrooms,bathrooms,max_guests,operational_status,description,address,city,room_layout)
      VALUES($1,'active',$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
      ON CONFLICT DO NOTHING RETURNING id`,
    [orgId, unit.unit_code, unit.name, unit.slug, unit.tower, unit.floor, unit.view_type,
      unit.price_monthly, unit.price_nightly, unit.sqm, unit.bedrooms, unit.bathrooms,
      unit.max_guests, unit.operational_status, unit.description, unit.address,
      unit.city, JSON.stringify(unit.room_layout)]);
    if (!property.rows[0]) continue;
    const propertyId = property.rows[0].id;
    const roomType = await client.query<{ id: string }>(`INSERT INTO room_types
      (property_id,name,base_price,capacity_adults,capacity_children) VALUES($1,$2,$3,$4,0) RETURNING id`,
    [propertyId, `Căn Hộ ${unit.bedrooms} Phòng Ngủ (${unit.sqm} m²)`, unit.price_nightly, unit.max_guests]);
    await client.query("INSERT INTO rooms(room_type_id,code,status) VALUES($1,$2,'active')", [roomType.rows[0]!.id, unit.unit_code]);
    await client.query('INSERT INTO property_amenities(property_id,amenity_id) SELECT $1,id FROM amenities', [propertyId]);
  }
  await client.query(`INSERT INTO inquiries(org_id,property_id,guest_name,phone,zalo,email,rental_term,guest_count,channel,stage,note)
    SELECT $1,id,'Nguyễn Hoàng Nam','0912345678','0912345678','nam.nguyen@example.com','3 tháng',2,'zalo','talking',
      'Khách cần thuê cho chuyên gia Nhật Bản, yêu cầu xuất hóa đơn VAT.'
    FROM properties WHERE org_id=$1 AND unit_code='L1.29.08' AND NOT EXISTS
      (SELECT 1 FROM inquiries WHERE org_id=$1 AND phone='0912345678')`, [orgId]);
  await client.query(`INSERT INTO leases(org_id,property_id,guest_name,nationality,phone,start_date,end_date,
    monthly_rent,residence_status,document_status,note)
    SELECT $1,id,'Mr. David Tanaka','Nhật Bản','+819012345678','2026-01-15','2026-09-15',48000000,
      'registered','complete','Khách chuyên gia cấp cao, gia hạn lần 2.'
    FROM properties WHERE org_id=$1 AND unit_code='L3.44.09' AND NOT EXISTS
      (SELECT 1 FROM leases WHERE property_id=properties.id)`, [orgId]);
}

export async function seed(pool: Pool, demo = false): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query("SELECT pg_advisory_xact_lock(hashtext('homestay-node-seed'))");
    for (const [code, role] of Object.entries(ROLE_SEED)) {
      await client.query(`INSERT INTO roles(code,name,description,permissions) VALUES($1,$2,$3,$4)
        ON CONFLICT(code) DO NOTHING`, [code, role.name, role.description, JSON.stringify(role.permissions)]);
    }
    for (const [code, name, icon, group] of AMENITY_SEED) {
      await client.query(`INSERT INTO amenities(code,name,icon,group_name) VALUES($1,$2,$3,$4)
        ON CONFLICT(code) DO NOTHING`, [code, name, icon, group]);
    }
    if (demo) await seedDemo(client);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally { client.release(); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const pool = new Pool({ connectionString: loadConfig().databaseUrl });
  try {
    await seed(pool, process.argv.includes('--demo'));
    console.log(process.argv.includes('--demo') ? 'Reference and demo data inserted; existing records preserved' : 'Reference data inserted; existing records preserved');
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Seed failed');
    process.exitCode = 1;
  } finally { await pool.end(); }
}
