// API client tối giản cho FastAPI backend (D-005).
// URL cấu hình qua NEXT_PUBLIC_API_URL — xem .env.example.

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

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

export interface RoomType {
  id: string;
  property_id: string;
  name: string;
  description: string | null;
  base_price: string;
  capacity_adults: number;
  capacity_children: number;
}

export interface PropertyDetail extends Property {
  room_types: RoomType[];
  amenities: Amenity[];
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`API ${path} → ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function fetchProperties(): Promise<Property[]> {
  return apiGet<Property[]>("/api/v1/properties");
}

export function fetchPropertyDetail(id: string): Promise<PropertyDetail> {
  return apiGet<PropertyDetail>(`/api/v1/properties/${id}`);
}
