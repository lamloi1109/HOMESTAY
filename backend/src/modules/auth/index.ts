import type { Express } from 'express';
import { z } from 'zod';
import { asyncRoute, requirePermission, requireUser, uuid, validate, type AppContext } from '../../core.js';
import { register, login, publicUser, createOrganization, addMember } from './service.js';

const email = z.string().trim().email().max(320);
const registration = z.object({ email, password: z.string().min(8).max(128),
  full_name: z.string().min(1).max(255), phone: z.string().max(32).nullable().default(null) });

export function registerAuth(app: Express, ctx: AppContext) {
  app.post('/api/v1/auth/register', asyncRoute(async (req, res) => {
    res.status(201).json(await register(ctx, validate(registration, req.body)));
  }));
  app.post('/api/v1/auth/login', asyncRoute(async (req, res) => {
    const body = validate(z.object({email, password:z.string()}), req.body);
    res.json(await login(ctx, body.email, body.password));
  }));
  app.get('/api/v1/auth/me', asyncRoute(async (req, res) => { res.json(publicUser(await requireUser(ctx,req))); }));
  app.post('/api/v1/orgs', asyncRoute(async (req, res) => {
    const user = await requireUser(ctx, req);
    const body = validate(z.object({name:z.string().min(1).max(255),slug:z.string().min(1).max(255).regex(/^[a-z0-9-]+$/)}), req.body);
    res.status(201).json(await createOrganization(ctx,user,body));
  }));
  app.post('/api/v1/orgs/:org_id/members', asyncRoute(async (req,res) => {
    const user = await requireUser(ctx,req);
    const orgId = validate(uuid,req.params.org_id);
    const body = validate(z.object({ email, role_code:z.string() }),req.body);
    await requirePermission(ctx,user,orgId,'org:manage');
    res.status(201).json(await addMember(ctx,orgId,body.email,body.role_code));
  }));
  app.get('/api/v1/orgs/:org_id/revenue', asyncRoute(async (req,res) => {
    const user = await requireUser(ctx,req);
    const orgId = validate(uuid,req.params.org_id);
    await requirePermission(ctx,user,orgId,'revenue:read');
    const { rows: [row] } = await ctx.pool.query(`SELECT coalesce(sum(credit),0) AS total FROM ledger_entries WHERE org_id=$1 AND account='room_revenue'`, [orgId]);
    res.json({org_id:orgId,room_revenue:Number(row.total),currency:'VND'});
  }));
}
