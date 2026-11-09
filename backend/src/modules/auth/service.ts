import { compare, hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { AppContext, User } from '../../core.js';
import { HttpError, transaction } from '../../core.js';

export function publicUser(user: User) {
  return { id: user.id, email: user.email, full_name: user.full_name, phone: user.phone };
}

export async function register(ctx: AppContext, body: { email: string; password: string; full_name: string; phone: string | null }) {
  const email = body.email.toLowerCase();
  const existing = await ctx.pool.query('SELECT id FROM users WHERE email=$1', [email]);
  if (existing.rowCount) throw new HttpError(409, 'Email đã được đăng ký');
  const hashed = await hash(body.password, 12);
  try {
    const { rows } = await ctx.pool.query<User>(`INSERT INTO users(email,hashed_password,full_name,phone,is_active)
      VALUES($1,$2,$3,$4,true) RETURNING *`, [email, hashed, body.full_name, body.phone]);
    return publicUser(rows[0]);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') throw new HttpError(409, 'Email đã được đăng ký');
    throw error;
  }
}

export async function login(ctx: AppContext, email: string, password: string) {
  const { rows: [user] } = await ctx.pool.query<User>('SELECT * FROM users WHERE email=$1', [email.toLowerCase()]);
  let matches = false;
  if (user?.is_active && user.hashed_password) {
    try { matches = await compare(password, user.hashed_password); } catch { matches = false; }
  }
  if (!matches) throw new HttpError(401, 'Email hoặc mật khẩu không đúng');
  return { access_token: jwt.sign({ sub: user.id }, ctx.config.jwtSecret, {
    algorithm: 'HS256', expiresIn: ctx.config.accessTokenExpireMinutes * 60,
  }), token_type: 'bearer' };
}

export async function createOrganization(ctx: AppContext, user: User, input: {name: string; slug: string}) {
  return transaction(ctx.pool, async client => {
    if ((await client.query('SELECT id FROM organizations WHERE slug=$1', [input.slug])).rowCount) throw new HttpError(409, 'Slug đã tồn tại');
    const { rows: [role] } = await client.query("SELECT id FROM roles WHERE code='owner'");
    if (!role) throw new HttpError(500, 'Chưa seed roles — chạy npm run db:seed');
    const { rows: [org] } = await client.query('INSERT INTO organizations(name,slug) VALUES($1,$2) RETURNING id,name,slug', [input.name,input.slug]);
    await client.query('INSERT INTO user_org_roles(user_id,org_id,role_id) VALUES($1,$2,$3)', [user.id,org.id,role.id]);
    return org;
  });
}

export async function addMember(ctx: AppContext, orgId: string, email: string, roleCode: string) {
  const { rows: [target] } = await ctx.pool.query('SELECT id FROM users WHERE email=$1', [email.toLowerCase()]);
  if (!target) throw new HttpError(404, 'User chưa đăng ký tài khoản');
  const { rows: [role] } = await ctx.pool.query('SELECT id,code FROM roles WHERE code=$1', [roleCode]);
  if (!role) throw new HttpError(422, 'Role không tồn tại');
  await ctx.pool.query(`INSERT INTO user_org_roles(user_id,org_id,role_id) VALUES($1,$2,$3)
    ON CONFLICT(user_id,org_id) DO UPDATE SET role_id=EXCLUDED.role_id,updated_at=now()`, [target.id, orgId, role.id]);
  return { user_id: target.id, org_id: orgId, role: role.code };
}
