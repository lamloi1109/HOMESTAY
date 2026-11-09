import { randomUUID } from 'node:crypto';
import type { Express } from 'express';
import multer from 'multer';
import { z } from 'zod';
import type { Pool, PoolClient } from 'pg';
import { type AppContext, asyncRoute, HttpError, requireUser, requirePermission, transaction, validate, uuid, type User } from '../core.js';
import { detectImageExt, MAX_IMAGE_BYTES, type StorageService } from './storage.js';

export const propertyFields = 'id, org_id, name, slug, unit_code, tower, floor, view_type, price_monthly, price_nightly, sqm, bedrooms, bathrooms, max_guests, room_layout, operational_status, description, address, city, status';
const roomTypeFields = 'id, property_id, name, description, base_price, capacity_adults, capacity_children';
const roomFields = 'id, room_type_id, code, status';
export { uuid, dateOnly } from '../core.js';
export const money = z.union([z.string().regex(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/), z.number().finite()]).transform(String);
export const optionalText = z.string().nullable().optional();
const propertyCreate = z.object({ name: z.string().min(1).max(255), slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/), description: optionalText, address: z.string().max(500).nullable().optional(), city: z.string().max(120).nullable().optional() });
const roomTypeCreate = z.object({ name: z.string().min(1).max(255), description: optionalText, base_price: money.refine(s => Number(s) > 0), capacity_adults: z.number().int().min(1).max(20).default(2), capacity_children: z.number().int().min(0).max(20).default(0) });
export const unitUpdate = z.object({ price_monthly: money.nullable().optional(), price_nightly: money.nullable().optional(), operational_status: optionalText, description: optionalText, status: z.enum(['draft','active','inactive']).nullable().optional(), view_type: optionalText, sqm: z.number().int().nullable().optional(), bedrooms: z.number().int().nullable().optional(), bathrooms: z.number().int().nullable().optional(), max_guests: z.number().int().nullable().optional(), room_layout: z.union([z.record(z.string(), z.unknown()), z.array(z.record(z.string(), z.unknown()))]).nullable().optional() });

// Identifiers below are trusted module constants; values always use SQL parameters.
export async function insertRow(db: Pool | PoolClient, table: string, data: Record<string, unknown>, fields = '*') {
  const entries = Object.entries(data).filter(([, value]) => value !== undefined);
  const columns = ['id', ...entries.map(([key]) => key), 'created_at', 'updated_at'];
  const values = [randomUUID(), ...entries.map(([key, value]) => key === 'room_layout' && value != null ? JSON.stringify(value) : value)];
  return (await db.query(`INSERT INTO ${table} (${columns.join(',')}) VALUES (${values.map((_, i) => `$${i + 1}`).join(',')},now(),now()) RETURNING ${fields}`, values)).rows[0];
}
export async function updateRow(db: Pool | PoolClient, table: string, id: string, data: Record<string, unknown>, fields = '*') {
  const entries = Object.entries(data).filter(([, value]) => value !== undefined);
  const values = entries.map(([key, value]) => key === 'room_layout' && value != null ? JSON.stringify(value) : value);
  const assignments = [...entries.map(([key], i) => `${key}=$${i + 1}`), 'updated_at=now()'];
  return (await db.query(`UPDATE ${table} SET ${assignments.join(',')} WHERE id=$${values.length + 1} RETURNING ${fields}`, [...values, id])).rows[0];
}
export async function getProperty(ctx: AppContext, id: string) {
  const row = (await ctx.pool.query(`SELECT ${propertyFields} FROM properties WHERE id=$1`, [id])).rows[0];
  if (!row) throw new HttpError(404, 'Property không tồn tại');
  return row;
}
export async function propertyDetail(ctx: AppContext, id: string, storage: StorageService) {
  const prop = await getProperty(ctx, id);
  const roomTypes = (await ctx.pool.query(`SELECT ${roomTypeFields} FROM room_types WHERE property_id=$1`, [id])).rows;
  for (const roomType of roomTypes) roomType.rooms = (await ctx.pool.query(`SELECT ${roomFields} FROM rooms WHERE room_type_id=$1`, [roomType.id])).rows;
  const amenities = (await ctx.pool.query('SELECT a.code,a.name,a.icon,a.group_name FROM amenities a JOIN property_amenities pa ON pa.amenity_id=a.id WHERE pa.property_id=$1', [id])).rows;
  const images = (await ctx.pool.query('SELECT id,stored_name,alt,sort_order FROM property_images WHERE property_id=$1 ORDER BY sort_order', [id])).rows.map(({stored_name, ...image}) => ({...image, url: storage.publicUrl(stored_name)}));
  return {...prop, room_types: roomTypes, amenities, images};
}

export class CatalogService {
  constructor(private readonly ctx: AppContext, private readonly storage: StorageService) {}
  async listProperties() {
    const properties = (await this.ctx.pool.query(`SELECT ${propertyFields} FROM properties WHERE status='active' ORDER BY created_at`)).rows;
    for (const prop of properties) {
      const image = (await this.ctx.pool.query('SELECT stored_name FROM property_images WHERE property_id=$1 ORDER BY sort_order LIMIT 1', [prop.id])).rows[0];
      prop.cover_image = image ? this.storage.publicUrl(image.stored_name) : null;
    }
    return properties;
  }
  detail(id: string) { return propertyDetail(this.ctx, id, this.storage); }
  async createProperty(user: User, orgId: string, body: z.infer<typeof propertyCreate>) {
    await requirePermission(this.ctx, user, orgId, 'property:write');
    return insertRow(this.ctx.pool, 'properties', { org_id: orgId, ...body, description: body.description ?? null, address: body.address ?? null, city: body.city ?? null, status: 'active', bedrooms: 1, bathrooms: 1, max_guests: 2, operational_status: 'available' }, propertyFields);
  }
  async authorizePropertyWrite(user: User, id: string) {
    const prop = await getProperty(this.ctx, id);
    await requirePermission(this.ctx, user, prop.org_id, 'property:write');
    return prop;
  }
  async createRoomType(user: User, id: string, body: z.infer<typeof roomTypeCreate>) {
    await this.authorizePropertyWrite(user, id);
    return insertRow(this.ctx.pool, 'room_types', {property_id: id, ...body, description: body.description ?? null}, roomTypeFields);
  }
  async createRoom(user: User, id: string, code: string) {
    const rt = (await this.ctx.pool.query('SELECT property_id FROM room_types WHERE id=$1', [id])).rows[0];
    if (!rt) throw new HttpError(404, 'Room type không tồn tại');
    await this.authorizePropertyWrite(user, rt.property_id);
    return insertRow(this.ctx.pool, 'rooms', {room_type_id: id, code, status: 'active'}, roomFields);
  }
  async listAmenities() {
    return (await this.ctx.pool.query('SELECT code,name,icon,group_name FROM amenities ORDER BY group_name,name')).rows;
  }
  async setAmenities(user: User, id: string, codes: string[]) {
    await this.authorizePropertyWrite(user, id);
    const amenities = (await this.ctx.pool.query('SELECT id,code,name,icon,group_name FROM amenities WHERE code=ANY($1::text[])', [codes])).rows;
    const missing = [...new Set(codes)].filter(code => !amenities.some(a => a.code === code)).sort();
    if (missing.length) throw new HttpError(422, `Tiện ích không có trong danh mục: [${missing.map(s => `'${s}'`).join(', ')}]`);
    await transaction(this.ctx.pool, async db => {
      await db.query('SELECT id FROM properties WHERE id=$1 FOR UPDATE', [id]);
      await db.query('DELETE FROM property_amenities WHERE property_id=$1', [id]);
      for (const amenity of amenities) await insertRow(db, 'property_amenities', {property_id: id, amenity_id: amenity.id});
    });
    return amenities.map(({id: _id, ...a}) => a);
  }
  async uploadImage(user: User, id: string, data: Buffer, originalName: string, alt: string | null) {
    await this.authorizePropertyWrite(user, id);
    const ext = detectImageExt(data);
    const db = await this.ctx.pool.connect();
    let name: string | undefined;
    try {
      name = await this.storage.save(data, ext);
      await db.query('BEGIN'); await db.query('SELECT id FROM properties WHERE id=$1 FOR UPDATE', [id]);
      const order = Number((await db.query('SELECT coalesce(max(sort_order),-1)+1 AS n FROM property_images WHERE property_id=$1', [id])).rows[0].n);
      const row = await insertRow(db, 'property_images', {property_id: id, stored_name: name, original_name: originalName, alt, sort_order: order}, 'id,alt,sort_order');
      await db.query('COMMIT');
      return {...row, url: this.storage.publicUrl(name)};
    } catch (error) { await db.query('ROLLBACK'); if (name) await this.storage.delete(name); throw error; } finally { db.release(); }
  }
  async deleteImage(user: User, id: string) {
    const image = (await this.ctx.pool.query('SELECT * FROM property_images WHERE id=$1', [id])).rows[0];
    if (!image) throw new HttpError(404, 'Ảnh không tồn tại');
    await this.authorizePropertyWrite(user, image.property_id);
    await this.ctx.pool.query('DELETE FROM property_images WHERE id=$1', [id]); await this.storage.delete(image.stored_name);
  }
}

export function registerCatalog(app: Express, ctx: AppContext, storage: StorageService): void {
  const prefix = '/api/v1'; const service = new CatalogService(ctx, storage);
  app.get(`${prefix}/properties`, asyncRoute(async (_req, res) => res.json(await service.listProperties())));
  app.get(`${prefix}/properties/:property_id`, asyncRoute(async (req, res) => res.json(await service.detail(validate(uuid, req.params.property_id)))));
  app.post(`${prefix}/orgs/:org_id/properties`, asyncRoute(async (req, res) => {
    const user = await requireUser(ctx, req);
    res.status(201).json(await service.createProperty(user, validate(uuid, req.params.org_id), validate(propertyCreate, req.body)));
  }));
  app.post(`${prefix}/properties/:property_id/room-types`, asyncRoute(async (req, res) => {
    const user = await requireUser(ctx, req);
    res.status(201).json(await service.createRoomType(user, validate(uuid, req.params.property_id), validate(roomTypeCreate, req.body)));
  }));
  app.post(`${prefix}/room-types/:room_type_id/rooms`, asyncRoute(async (req, res) => {
    const user = await requireUser(ctx, req); const body = validate(z.object({code: z.string().min(1).max(64)}), req.body);
    res.status(201).json(await service.createRoom(user, validate(uuid, req.params.room_type_id), body.code));
  }));
  app.get(`${prefix}/amenities`, asyncRoute(async (_req, res) => res.json(await service.listAmenities())));
  app.put(`${prefix}/properties/:property_id/amenities`, asyncRoute(async (req, res) => {
    const user = await requireUser(ctx, req); const body = validate(z.object({amenity_codes: z.array(z.string())}), req.body);
    res.json(await service.setAmenities(user, validate(uuid, req.params.property_id), body.amenity_codes));
  }));
  const upload = multer({storage: multer.memoryStorage(), limits: {fileSize: MAX_IMAGE_BYTES, files: 1}}).single('file');
  app.post(`${prefix}/properties/:property_id/images`, asyncRoute(async (req, res) => {
    const user = await requireUser(ctx, req); const id = validate(uuid, req.params.property_id);
    await service.authorizePropertyWrite(user, id);
    await new Promise<void>((resolve, reject) => upload(req, res, error => error ? reject(new HttpError(422, error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE' ? 'Ảnh vượt quá 10MB' : 'Invalid multipart upload')) : resolve()));
    if (!req.file) throw new HttpError(422, 'Field required: file');
    res.status(201).json(await service.uploadImage(user, id, req.file.buffer, req.file.originalname, req.body.alt || null));
  }));
  app.delete(`${prefix}/property-images/:image_id`, asyncRoute(async (req, res) => {
    const user = await requireUser(ctx, req); await service.deleteImage(user, validate(uuid, req.params.image_id)); res.status(204).end();
  }));
}
