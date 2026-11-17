import type { Request, RequestHandler } from 'express';
import type { Pool, PoolClient } from 'pg';
import { types } from 'pg';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import type { Config } from './config.js';

// A stay/lease date has no timezone; pg's default Date conversion shifts it.
types.setTypeParser(1082, value => value);

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  is_active: boolean;
  hashed_password: string | null;
}

export interface AppContext {
  pool: Pool;
  config: Config;
}

export class HttpError extends Error {
  constructor(public status: number, public detail: string) { super(detail); }
}

export const asyncRoute = (handler: (req: Request, res: Parameters<RequestHandler>[1]) => Promise<unknown>): RequestHandler =>
  (req, res, next) => { Promise.resolve(handler(req, res)).catch(next); };

export function validate<T extends z.ZodType>(schema: T, input: unknown): z.infer<T> {
  return schema.parse(input);
}

// Pydantic UUID accepts all versions, including existing fixed demo identifiers.
export const uuid = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i).transform(value => value.toLowerCase());

export const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}, 'Invalid date');

export async function optionalUser(ctx: AppContext, req: Request): Promise<User | null> {
  const header = req.header('authorization');
  if (!header?.match(/^Bearer /i)) return null;
  try {
    const payload = jwt.verify(header.slice(7), ctx.config.jwtSecret, { algorithms: ['HS256'] });
    if (typeof payload === 'string' || !uuid.safeParse(payload.sub).success) return null;
    // PyJWT checks iat by default; jsonwebtoken only checks exp and nbf.
    if (payload.iat !== undefined) {
      const claim: unknown = payload.iat;
      const issuedAt = typeof claim === 'number' ? Math.trunc(claim)
        : typeof claim === 'string' && /^-?\d+$/.test(claim) ? Number(claim) : NaN;
      if (!Number.isFinite(issuedAt) || issuedAt > Math.floor(Date.now() / 1000)) return null;
    }
    const result = await ctx.pool.query<User>('SELECT * FROM users WHERE id=$1 AND is_active=true', [payload.sub]);
    return result.rows[0] ?? null;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) return null;
    throw error;
  }
}

export async function requireUser(ctx: AppContext, req: Request): Promise<User> {
  const user = await optionalUser(ctx, req);
  if (!user) throw new HttpError(401, 'Chưa đăng nhập hoặc token không hợp lệ');
  return user;
}

export async function requirePermission(ctx: AppContext, user: User, orgId: string, permission: string): Promise<void> {
  const { rows } = await ctx.pool.query<{ permissions: string[] }>(
    `SELECT r.permissions FROM user_org_roles m JOIN roles r ON r.id=m.role_id
     WHERE m.user_id=$1 AND m.org_id=$2`, [user.id, orgId],
  );
  const permissions = rows[0]?.permissions ?? [];
  if (!permissions.includes(permission) && !permissions.includes('system:admin')) {
    throw new HttpError(403, `Thiếu quyền ${permission} trong org này`);
  }
}

export async function transaction<T>(pool: Pool, work: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally { client.release(); }
}
