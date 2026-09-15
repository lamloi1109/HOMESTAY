const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
const TOKEN_KEY = "gaoji-admin-token";

export type InquiryStage = "new" | "talking" | "hold" | "won" | "lost";
export type InquiryChannel = "zalo" | "phone" | "web_form" | "wechat" | "email";
export type OperationalStatus = "available" | "held" | "occupied" | "maintenance";
export type ResidenceStatus = "registered" | "pending" | "expired";
export type DocumentStatus = "complete" | "missing";

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
}

export interface AdminInquiry {
  id: string;
  org_id: string;
  property_id: string | null;
  unit_code: string | null;
  property_name: string | null;
  guest_name: string;
  phone: string;
  zalo: string | null;
  email: string | null;
  checkin_date: string | null;
  rental_term: string | null;
  guest_count: number;
  note: string | null;
  channel: InquiryChannel;
  stage: InquiryStage;
  assigned_to_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminUnit {
  id: string;
  org_id: string;
  name: string;
  slug: string;
  unit_code: string | null;
  tower: string | null;
  floor: string | null;
  view_type: string | null;
  price_monthly: string | number | null;
  price_nightly: string | number | null;
  sqm: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  max_guests: number | null;
  room_layout: unknown;
  operational_status: OperationalStatus | null;
  description: string | null;
  address: string | null;
  city: string | null;
  status: "draft" | "active" | "inactive";
}

export interface AdminLease {
  id: string;
  org_id: string;
  property_id: string;
  unit_code: string | null;
  property_name: string | null;
  guest_name: string;
  nationality: string;
  phone: string | null;
  start_date: string;
  end_date: string;
  days_remaining: number | null;
  monthly_rent: string | number;
  residence_status: ResidenceStatus;
  document_status: DocumentStatus;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeasePayload {
  property_id: string;
  guest_name: string;
  nationality: string;
  phone?: string | null;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  residence_status: ResidenceStatus;
  document_status: DocumentStatus;
  note?: string | null;
}

export class AdminApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

function getToken() {
  return typeof window === "undefined" ? null : sessionStorage.getItem(TOKEN_KEY);
}

export function clearAdminSession() {
  if (typeof window !== "undefined") sessionStorage.removeItem(TOKEN_KEY);
}

async function parseError(response: Response) {
  try {
    const body = (await response.json()) as { detail?: string | Array<{ msg?: string }> };
    if (typeof body.detail === "string") return body.detail;
    if (Array.isArray(body.detail)) return body.detail.map((item) => item.msg).filter(Boolean).join(" · ");
  } catch {
    // The status-specific fallback below remains actionable when the body is not JSON.
  }
  if (response.status === 401) return "Phiên đăng nhập đã hết hạn.";
  if (response.status === 403) return "Tài khoản không có quyền thực hiện thao tác này.";
  return `Máy chủ trả về lỗi ${response.status}.`;
}

async function request<T>(path: string, init: RequestInit = {}, authenticated = true): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body) headers.set("Content-Type", "application/json");
  if (authenticated) {
    const token = getToken();
    if (!token) throw new AdminApiError(401, "Bạn cần đăng nhập để tiếp tục.");
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...init, headers, cache: "no-store" });
  } catch {
    throw new AdminApiError(0, "Không thể kết nối máy chủ. Kiểm tra backend rồi thử lại.");
  }
  if (!response.ok) {
    const message = await parseError(response);
    if (response.status === 401) clearAdminSession();
    throw new AdminApiError(response.status, message);
  }
  return response.json() as Promise<T>;
}

export async function loginAdmin(email: string, password: string) {
  const token = await request<{ access_token: string }>(
    "/api/v1/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) },
    false,
  );
  sessionStorage.setItem(TOKEN_KEY, token.access_token);
  return getAdminUser();
}

export const getAdminUser = () => request<AdminUser>("/api/v1/auth/me");
export const listAdminInquiries = () => request<AdminInquiry[]>("/api/v1/admin/inquiries?limit=100");
export const listAdminUnits = () => request<AdminUnit[]>("/api/v1/admin/units");
export const listAdminLeases = () => request<AdminLease[]>("/api/v1/admin/leases");

export const updateAdminInquiry = (
  id: string,
  data: Partial<Pick<AdminInquiry, "stage" | "note" | "rental_term" | "checkin_date">>,
) => request<AdminInquiry>(`/api/v1/admin/inquiries/${id}`, { method: "PATCH", body: JSON.stringify(data) });

export const updateAdminUnit = (
  id: string,
  data: Partial<Pick<AdminUnit, "price_monthly" | "price_nightly" | "operational_status" | "description">>,
) => request<AdminUnit>(`/api/v1/admin/units/${id}`, { method: "PATCH", body: JSON.stringify(data) });

export const createAdminLease = (data: LeasePayload) =>
  request<AdminLease>("/api/v1/admin/leases", { method: "POST", body: JSON.stringify(data) });

export const updateAdminLease = (id: string, data: Partial<Omit<LeasePayload, "property_id">>) =>
  request<AdminLease>(`/api/v1/admin/leases/${id}`, { method: "PATCH", body: JSON.stringify(data) });
