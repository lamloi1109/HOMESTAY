import type { Express, RequestHandler } from 'express';
import { z } from 'zod';
import { type AppContext, asyncRoute, HttpError, requireUser, validate } from '../core.js';
import { dateOnly, getProperty, insertRow, money, optionalText, propertyDetail, propertyFields, unitUpdate, updateRow, uuid } from './catalog.js';
import type { StorageService } from './storage.js';

const channel = z.enum(['zalo', 'phone', 'web_form', 'wechat', 'email']);
const stage = z.enum(['new', 'talking', 'hold', 'won', 'lost']);
const residence = z.enum(['registered', 'pending', 'expired']);
const document = z.enum(['complete', 'missing']);
const queryInt = z.union([z.string().regex(/^[+-]?\d+$/).transform(Number), z.number().int()]).pipe(z.number().int());
const inquiryCreate = z.object({guest_name: z.string().min(1).max(255), phone: z.string().min(8).max(32), zalo: optionalText, email: optionalText, property_id: uuid.nullable().optional(), unit_code: optionalText, checkin_date: dateOnly.nullable().optional(), rental_term: optionalText, guest_count: z.number().int().min(1).max(20).default(2), note: optionalText, channel: channel.default('web_form')});
const inquiryUpdate = z.object({stage: stage.nullable().optional(), note: optionalText, assigned_to_user_id: uuid.nullable().optional(), rental_term: optionalText, checkin_date: dateOnly.nullable().optional()});
const inquiryQuery = z.object({stage: stage.optional(), channel: channel.optional(), search: z.string().optional(), limit: queryInt.pipe(z.number().min(1).max(100)).default(50), offset: queryInt.pipe(z.number().min(0)).default(0)});
const serviceCreate = z.object({name: z.string().min(1).max(255), category: z.string().min(1).max(120), price: money.refine(s => Number(s) >= 0), price_unit: z.string().max(64).default('lần'), description: optionalText, icon: optionalText, is_active: z.boolean().default(true), sort_order: z.number().int().default(0)});
const serviceUpdate = z.object({name: optionalText, category: optionalText, price: money.nullable().optional(), price_unit: optionalText, description: optionalText, icon: optionalText, is_active: z.boolean().nullable().optional(), sort_order: z.number().int().nullable().optional()});
const leaseCreate = z.object({property_id: uuid, guest_name: z.string().min(1).max(255), nationality: z.string().max(120).default('Việt Nam'), phone: z.string().max(32).nullable().optional(), start_date: dateOnly, end_date: dateOnly, monthly_rent: money.refine(s => Math.round(Number(s)) > 0), residence_status: residence.default('pending'), document_status: document.default('complete'), note: optionalText});
const leaseUpdate = z.object({guest_name: optionalText, nationality: optionalText, phone: optionalText, start_date: dateOnly.nullable().optional(), end_date: dateOnly.nullable().optional(), monthly_rent: money.nullable().optional(), residence_status: residence.nullable().optional(), document_status: document.nullable().optional(), note: optionalText});
const inquirySelect = 'SELECT i.*,p.unit_code,p.name AS property_name FROM inquiries i LEFT JOIN properties p ON p.id=i.property_id';
const unitMissing = 'Căn hộ không tồn tại';
const utcToday = "(now() AT TIME ZONE 'UTC')::date";
const leaseSelect = `SELECT l.*,p.unit_code,p.name AS property_name,(l.end_date-${utcToday})::integer AS days_remaining FROM leases l LEFT JOIN properties p ON p.id=l.property_id`;
const serviceFields = 'id,org_id,name,category,price,price_unit,description,icon,is_active,sort_order,created_at,updated_at';

async function defaultOrg(ctx: AppContext, status: number, message: string): Promise<string> {
  const org = (await ctx.pool.query("SELECT id FROM organizations ORDER BY (slug='gaoji-house') DESC LIMIT 1")).rows[0];
  if (!org) throw new HttpError(status, message);
  return org.id;
}
async function inquiryById(ctx: AppContext, id: string) {
  const row = (await ctx.pool.query(`${inquirySelect} WHERE i.id=$1`, [id])).rows[0];
  if (!row) throw new HttpError(404, 'Không tìm thấy yêu cầu tư vấn');
  return row;
}
async function leaseById(ctx: AppContext, id: string) {
  const row = (await ctx.pool.query(`${leaseSelect} WHERE l.id=$1`, [id])).rows[0];
  if (!row) throw new HttpError(404, 'Hợp đồng không tồn tại');
  return row;
}

export class CrmService {
  constructor(private readonly ctx: AppContext, private readonly storage: StorageService) {}
  async createInquiry(data: z.infer<typeof inquiryCreate>) {
    let prop;
    if (data.property_id) prop = (await this.ctx.pool.query('SELECT id,org_id FROM properties WHERE id=$1', [data.property_id])).rows[0];
    else if (data.unit_code) prop = (await this.ctx.pool.query('SELECT id,org_id FROM properties WHERE unit_code=$1', [data.unit_code])).rows[0];
    const orgId = prop?.org_id ?? await defaultOrg(this.ctx, 500, 'Chưa cấu hình tổ chức Gaoji House trong hệ thống.');
    const row = await insertRow(this.ctx.pool, 'inquiries', {org_id: orgId, property_id: prop?.id ?? null, guest_name: data.guest_name.trim(), phone: data.phone.trim(), zalo: data.zalo ? data.zalo.trim() : data.phone.trim(), email: data.email ? data.email.trim() : null, checkin_date: data.checkin_date ?? null, rental_term: data.rental_term ?? null, guest_count: data.guest_count, note: data.note ?? null, channel: data.channel, stage: 'new'});
    return {success: true, message: 'Yêu cầu của bạn đã được tiếp nhận thành công. Gao Ji House sẽ liên hệ phản hồi qua Zalo / Số điện thoại trong vòng 2 giờ.', inquiry_id: row.id};
  }
  async listInquiries(q: z.infer<typeof inquiryQuery>) {
    const params: unknown[] = []; const conditions: string[] = [];
    if (q.stage) {params.push(q.stage); conditions.push(`i.stage=$${params.length}`);}
    if (q.channel) {params.push(q.channel); conditions.push(`i.channel=$${params.length}`);}
    if (q.search?.trim()) {params.push(`%${q.search.trim()}%`); conditions.push(`(i.guest_name ILIKE $${params.length} OR i.phone ILIKE $${params.length} OR i.zalo ILIKE $${params.length} OR i.email ILIKE $${params.length})`);}
    params.push(q.limit, q.offset);
    const query = `${inquirySelect}${conditions.length ? ` WHERE ${conditions.join(' AND ')}` : ''} ORDER BY i.created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;
    return (await this.ctx.pool.query(query, params)).rows;
  }
  async getInquiry(id: string) {
    return inquiryById(this.ctx, id);
  }
  async updateInquiry(id: string, body: z.infer<typeof inquiryUpdate>) {
    await inquiryById(this.ctx, id);
    // Unlike other PATCH schemas, legacy inquiry updates intentionally ignore explicit nulls.
    const updates = Object.fromEntries(Object.entries(body).filter(([, value]) => value !== null));
    await updateRow(this.ctx.pool, 'inquiries', id, updates); return inquiryById(this.ctx, id);
  }
  async listUnits() {
    return (await this.ctx.pool.query(`SELECT ${propertyFields} FROM properties ORDER BY unit_code ASC NULLS LAST,created_at ASC`)).rows;
  }
  async getUnit(id: string) {
    return propertyDetail(this.ctx, id, this.storage, unitMissing);
  }
  async updateUnit(id: string, body: z.infer<typeof unitUpdate>) {
    await getProperty(this.ctx, id, unitMissing);
    return updateRow(this.ctx.pool, 'properties', id, body, propertyFields);
  }
  async listPublicServices(category?: string) {
    return (await this.ctx.pool.query(`SELECT ${serviceFields} FROM tour_services WHERE is_active=true${category ? ' AND category=$1' : ''} ORDER BY sort_order ASC,created_at ASC`, category ? [category] : [])).rows;
  }
  async listServices() {
    return (await this.ctx.pool.query(`SELECT ${serviceFields} FROM tour_services ORDER BY sort_order ASC,created_at ASC`)).rows;
  }
  async createService(body: z.infer<typeof serviceCreate>) {
    const orgId = await defaultOrg(this.ctx, 400, 'Tổ chức chưa tồn tại');
    return await insertRow(this.ctx.pool, 'tour_services', {org_id: orgId, ...body, description: body.description ?? null, icon: body.icon ?? null}, serviceFields);
  }
  async updateService(id: string, body: z.infer<typeof serviceUpdate>) {
    if (!(await this.ctx.pool.query('SELECT id FROM tour_services WHERE id=$1', [id])).rowCount) throw new HttpError(404, 'Dịch vụ không tồn tại');
    return await updateRow(this.ctx.pool, 'tour_services', id, body, serviceFields);
  }
  async deleteService(id: string) {
    const result = await this.ctx.pool.query('DELETE FROM tour_services WHERE id=$1', [id]); if (!result.rowCount) throw new HttpError(404, 'Dịch vụ không tồn tại');
  }
  async listLeases(expiringDays?: number) {
    return (await this.ctx.pool.query(`${leaseSelect}${expiringDays !== undefined ? ` WHERE (l.end_date-${utcToday}) BETWEEN 0 AND $1` : ''} ORDER BY l.end_date ASC`, expiringDays !== undefined ? [expiringDays] : [])).rows;
  }
  async createLease(body: z.infer<typeof leaseCreate>) {
    const prop = await getProperty(this.ctx, body.property_id, unitMissing);
    const row = await insertRow(this.ctx.pool, 'leases', {org_id: prop.org_id, ...body, phone: body.phone ?? null, note: body.note ?? null}); return leaseById(this.ctx, row.id);
  }
  async updateLease(id: string, body: z.infer<typeof leaseUpdate>) {
    await leaseById(this.ctx, id);
    await updateRow(this.ctx.pool, 'leases', id, body); return leaseById(this.ctx, id);
  }
}

export function registerCrm(app: Express, ctx: AppContext, storage: StorageService): void {
  const prefix = '/api/v1'; const service = new CrmService(ctx, storage);
  app.post(`${prefix}/inquiries`, asyncRoute(async (req, res) => {
    res.status(201).json(await service.createInquiry(validate(inquiryCreate, req.body)));
  }));
  app.get(`${prefix}/services`, asyncRoute(async (req, res) => {
    const q = validate(z.object({category: z.string().optional()}), req.query);
    res.json(await service.listPublicServices(q.category));
  }));
  // Legacy admin policy is active-account access without organization permission filters.
  // A stricter authorization policy must be introduced in a separate change.
  // Applied per matched route so unknown admin paths still return 404, as in FastAPI.
  const admin: RequestHandler = (req, _res, next) => { requireUser(ctx, req).then(() => next(), next); };
  app.get(`${prefix}/admin/inquiries`, admin, asyncRoute(async (req, res) => {
    res.json(await service.listInquiries(validate(inquiryQuery, req.query)));
  }));
  app.get(`${prefix}/admin/inquiries/:inquiry_id`, admin, asyncRoute(async (req, res) => {
    res.json(await service.getInquiry(validate(uuid, req.params.inquiry_id)));
  }));
  app.patch(`${prefix}/admin/inquiries/:inquiry_id`, admin, asyncRoute(async (req, res) => {
    res.json(await service.updateInquiry(validate(uuid, req.params.inquiry_id), validate(inquiryUpdate, req.body)));
  }));
  app.get(`${prefix}/admin/units`, admin, asyncRoute(async (req, res) => {
    res.json(await service.listUnits());
  }));
  app.get(`${prefix}/admin/units/:property_id`, admin, asyncRoute(async (req, res) => {
    res.json(await service.getUnit(validate(uuid, req.params.property_id)));
  }));
  app.patch(`${prefix}/admin/units/:property_id`, admin, asyncRoute(async (req, res) => {
    res.json(await service.updateUnit(validate(uuid, req.params.property_id), validate(unitUpdate, req.body)));
  }));
  app.get(`${prefix}/admin/services`, admin, asyncRoute(async (req, res) => {
    res.json(await service.listServices());
  }));
  app.post(`${prefix}/admin/services`, admin, asyncRoute(async (req, res) => {
    res.status(201).json(await service.createService(validate(serviceCreate, req.body)));
  }));
  app.patch(`${prefix}/admin/services/:service_id`, admin, asyncRoute(async (req, res) => {
    res.json(await service.updateService(validate(uuid, req.params.service_id), validate(serviceUpdate, req.body)));
  }));
  app.delete(`${prefix}/admin/services/:service_id`, admin, asyncRoute(async (req, res) => {
    await service.deleteService(validate(uuid, req.params.service_id)); res.status(204).end();
  }));
  app.get(`${prefix}/admin/leases`, admin, asyncRoute(async (req, res) => {
    const q = validate(z.object({expiring_days: queryInt.optional()}), req.query);
    res.json(await service.listLeases(q.expiring_days));
  }));
  app.post(`${prefix}/admin/leases`, admin, asyncRoute(async (req, res) => {
    res.status(201).json(await service.createLease(validate(leaseCreate, req.body)));
  }));
  app.patch(`${prefix}/admin/leases/:lease_id`, admin, asyncRoute(async (req, res) => {
    res.json(await service.updateLease(validate(uuid, req.params.lease_id), validate(leaseUpdate, req.body)));
  }));
}
