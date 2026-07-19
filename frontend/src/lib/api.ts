// API client cho FastAPI backend (D-005).
// URL cấu hình qua NEXT_PUBLIC_API_URL — xem .env.example.

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export interface Property {
  id: string;
  org_id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  city: string | null;
  status: "draft" | "active" | "inactive";
}

export interface Amenity {
  code: string;
  name: string;
  icon: string | null;
  group_name: string;
}

export interface Room {
  id: string;
  room_type_id: string;
  code: string;
  status: "active" | "maintenance";
}

export interface RoomType {
  id: string;
  property_id: string;
  name: string;
  description: string | null;
  base_price: string;
  capacity_adults: number;
  capacity_children: number;
  rooms: Room[];
}

export interface PropertyDetail extends Property {
  room_types: RoomType[];
  amenities: Amenity[];
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled"
  | "expired";

export interface Booking {
  id: string;
  code: string;
  org_id: string;
  property_id: string;
  room_id: string;
  guest_name: string;
  guest_email: string;
  check_in: string;
  check_out: string;
  num_guests: number;
  status: BookingStatus;
  expires_at: string | null;
  version: number;
  total_amount: string;
  currency: string;
}

export interface BookingCreateInput {
  room_id: string;
  check_in: string;
  check_out: string;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  num_guests: number;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    let detail = `Lỗi ${res.status}`;
    try {
      const body = await res.json();
      if (typeof body.detail === "string") detail = body.detail;
    } catch {
      // body không phải JSON — giữ thông báo mặc định
    }
    throw new ApiError(res.status, detail);
  }
  return res.json() as Promise<T>;
}

export const fetchProperties = () => request<Property[]>("/api/v1/properties");

export const fetchPropertyDetail = (id: string) =>
  request<PropertyDetail>(`/api/v1/properties/${id}`);

export const fetchAvailableRooms = (
  roomTypeId: string,
  checkIn: string,
  checkOut: string,
) =>
  request<Room[]>(
    `/api/v1/room-types/${roomTypeId}/available-rooms?check_in=${checkIn}&check_out=${checkOut}`,
  );

export const createBooking = (input: BookingCreateInput) =>
  request<Booking>("/api/v1/bookings", {
    method: "POST",
    body: JSON.stringify(input),
  });

export const fetchBookingByCode = (code: string) =>
  request<Booking>(`/api/v1/bookings/${encodeURIComponent(code)}`);
