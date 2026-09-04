// API client cho FastAPI backend (D-005, D-008).
// URL cấu hình qua NEXT_PUBLIC_API_URL.

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

/** URL tuyệt đối cho file tĩnh backend serve (vd /uploads/x.jpg). */
export const assetUrl = (path: string) => {
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return `${API_BASE}${path}`;
};

export interface Property {
  id: string;
  org_id: string;
  name: string;
  slug: string;
  unit_code?: string | null;
  tower?: string | null;
  floor?: string | null;
  view_type?: string | null;
  price_monthly?: number | string | null;
  price_nightly?: number | string | null;
  sqm?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  max_guests?: number | null;
  room_layout?: { room: string; bed: string; specs: string }[] | Record<string, unknown> | null;
  operational_status?: string | null;
  description: string | null;
  address: string | null;
  city: string | null;
  status: "draft" | "active" | "inactive";
  cover_image?: string | null;
}

export interface PropertyImage {
  id: string;
  url: string;
  alt: string | null;
  sort_order: number;
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
  images: PropertyImage[];
}

export interface TourService {
  id: string;
  org_id: string;
  name: string;
  category: string;
  price: number | string;
  price_unit: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface InquiryCreateInput {
  guest_name: string;
  phone: string;
  zalo?: string;
  email?: string;
  property_id?: string;
  unit_code?: string;
  checkin_date?: string;
  rental_term?: string;
  guest_count?: number;
  note?: string;
  channel?: string;
}

export interface InquiryResponse {
  success: boolean;
  message: string;
  inquiry_id: string;
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
      // body không phải JSON
    }
    throw new ApiError(res.status, detail);
  }
  return res.json() as Promise<T>;
}

// 5 căn hộ Gao Ji House mẫu khi server chưa chạy (Fallback / Offline support)
export const FALLBACK_GAOJI_UNITS: PropertyDetail[] = [
  {
    id: "e1000000-0000-0000-0000-000000000001",
    org_id: "a0000000-0000-0000-0000-000000000001",
    name: "Gaoji Landmark 1 — Căn 29.08",
    slug: "l1-29-08",
    unit_code: "L1.29.08",
    tower: "Landmark 1",
    floor: "29",
    view_type: "Trực diện Sông Sài Gòn & Bến Thuyền",
    price_monthly: 38000000,
    price_nightly: 2200000,
    sqm: 82,
    bedrooms: 2,
    bathrooms: 2,
    max_guests: 4,
    room_layout: [
      { room: "Phòng Khách & Bếp", bed: "Sofa Lớn", specs: "Smart TV 65-inch, Bếp từ âm Bosch, Bàn ăn 4 ghế" },
      { room: "Phòng Ngủ Master", bed: "1 Giường King (1.8m x 2m)", specs: "View Sông Sài Gòn, Bàn làm việc, WC khép kín có bồn tắm" },
      { room: "Phòng Ngủ 2", bed: "1 Giường Queen (1.6m x 2m)", specs: "Cửa sổ lớn ngập tràn ánh sáng tự nhiên" },
      { room: "Ban Công", bed: "Bàn trà ngắm cảnh", specs: "Tầm nhìn bao trọn khúc sông uốn lượn và bến du thuyền" },
    ],
    operational_status: "available",
    description: "Căn hộ 2 phòng ngủ cao cấp tại tòa Landmark 1, tầng 29 ngắm trọn khúc sông Sài Gòn uốn lượn. Nội thất gỗ óc chó ấm cúng, bếp mở hiện đại và không gian yên tĩnh tuyệt đối.",
    address: "Tòa Landmark 1, Vinhomes Central Park, 208 Nguyễn Hữu Cảnh",
    city: "Bình Thạnh, TP. Hồ Chí Minh",
    status: "active",
    cover_image: "/assets/photos/living-open-plan.jpg",
    room_types: [],
    amenities: [
      { code: "wifi", name: "Wifi Tốc Độ Cao 200Mbps", icon: "wifi", group_name: "Công nghệ" },
      { code: "kitchen", name: "Bếp Từ & Đầy Đủ Dụng Cụ Nấu", icon: "cooking-pot", group_name: "Tiện nghi" },
      { code: "washer", name: "Máy Giặt & Máy Sấy", icon: "sparkles", group_name: "Tiện nghi" },
      { code: "pool", name: "Hồ Bơi Vô Cực & Gym Vinhomes", icon: "sparkles", group_name: "Tiện ích" },
    ],
    images: [
      { id: "img-1", url: "/assets/photos/living-open-plan.jpg", alt: "Phòng khách", sort_order: 1 },
      { id: "img-2", url: "/assets/photos/master-bedroom.jpg", alt: "Phòng ngủ Master", sort_order: 2 },
      { id: "img-3", url: "/assets/photos/bedroom-master-river.jpg", alt: "Phòng ngủ view sông", sort_order: 3 },
      { id: "img-4", url: "/assets/photos/kitchen-island.jpg", alt: "Khu vực bếp", sort_order: 4 },
      { id: "img-5", url: "/assets/photos/bathroom-vanity.jpg", alt: "Phòng tắm", sort_order: 5 },
    ],
  },
  {
    id: "e1000000-0000-0000-0000-000000000002",
    org_id: "a0000000-0000-0000-0000-000000000001",
    name: "Gaoji Landmark 3 — Căn 44.09",
    slug: "l3-44-09",
    unit_code: "L3.44.09",
    tower: "Landmark 3",
    floor: "44",
    view_type: "Landmark 81 & Sông Sài Gòn",
    price_monthly: 48000000,
    price_nightly: 2800000,
    sqm: 108,
    bedrooms: 3,
    bathrooms: 2,
    max_guests: 6,
    room_layout: [
      { room: "Phòng Khách & Bếp", bed: "Sofa chữ L", specs: "Smart TV 75-inch, Bếp đảo Bar, Bàn ăn 6 ghế" },
      { room: "Phòng Ngủ Master", bed: "1 Giường King (2m x 2m)", specs: "View góc nhìn Landmark 81 & Sông, WC riêng có bồn tắm nằm" },
      { room: "Phòng Ngủ 2", bed: "1 Giường Queen (1.6m x 2m)", specs: "Bàn làm việc, tủ âm tường" },
      { room: "Phòng Ngủ 3", bed: "2 Giường Đơn (1.2m x 2m)", specs: "Phù hợp cho trẻ em hoặc khách đi công tác nhóm" },
    ],
    operational_status: "available",
    description: "Căn hộ 3 phòng ngủ diện tích lớn 108 m² tại tầng 44 tòa Landmark 3. Tầm nhìn kép nhìn trực diện tòa Landmark 81 sừng sững và công viên bờ sông 14ha xanh mát.",
    address: "Tòa Landmark 3, Vinhomes Central Park, 208 Nguyễn Hữu Cảnh",
    city: "Bình Thạnh, TP. Hồ Chí Minh",
    status: "active",
    cover_image: "/assets/photos/living-dining.jpg",
    room_types: [],
    amenities: [
      { code: "wifi", name: "Wifi Tốc Độ Cao 300Mbps", icon: "wifi", group_name: "Công nghệ" },
      { code: "kitchen", name: "Bếp Đảo Hiện Đại & Lò Nướng", icon: "cooking-pot", group_name: "Tiện nghi" },
      { code: "pool", name: "Hồ Bơi Vô Cực & Gym Vinhomes", icon: "sparkles", group_name: "Tiện ích" },
    ],
    images: [
      { id: "img-201", url: "/assets/photos/living-dining.jpg", alt: "Phòng khách & bàn ăn", sort_order: 1 },
      { id: "img-202", url: "/assets/photos/landmark-81-balcony.jpg", alt: "Ban công view Landmark 81", sort_order: 2 },
      { id: "img-203", url: "/assets/photos/bedroom-twin-river.jpg", alt: "Phòng ngủ 2 giường view sông", sort_order: 3 },
      { id: "img-204", url: "/assets/photos/dining-room.jpg", alt: "Không gian ăn uống", sort_order: 4 },
    ],
  },
  {
    id: "e1000000-0000-0000-0000-000000000003",
    org_id: "a0000000-0000-0000-0000-000000000001",
    name: "Gaoji Landmark 81 — Căn 07.12",
    slug: "l81-07-12",
    unit_code: "L81.07.12",
    tower: "Landmark 81",
    floor: "07",
    view_type: "Trực diện Sảnh & Quảng Trường Landmark 81",
    price_monthly: 28000000,
    price_nightly: 1800000,
    sqm: 54,
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 2,
    room_layout: [
      { room: "Phòng Khách Liền Bếp", bed: "Sofa Bed êm ái", specs: "Smart TV 55-inch, Bếp từ, Tủ lạnh side-by-side" },
      { room: "Phòng Ngủ Master", bed: "1 Giường King (1.8m x 2m)", specs: "View kính tràn sàn trực diện trung tâm thương mại & Vincom" },
    ],
    operational_status: "available",
    description: "Căn hộ 1 phòng ngủ cao cấp ngay trong tòa tháp biểu tượng Landmark 81. Bước chân xuống sảnh là trung tâm thương mại Vincom Center, rạp chiếu phim, sân băng và chuỗi nhà hàng 5 sao.",
    address: "Tòa tháp Landmark 81, Vinhomes Central Park, 208 Nguyễn Hữu Cảnh",
    city: "Bình Thạnh, TP. Hồ Chí Minh",
    status: "active",
    cover_image: "/assets/photos/bedroom-platform-landmark.jpg",
    room_types: [],
    amenities: [
      { code: "wifi", name: "Wifi Cáp Quang Riêng Biệt", icon: "wifi", group_name: "Công nghệ" },
      { code: "landmark", name: "Kết Nối Trực Tiếp Vincom Landmark 81", icon: "sparkles", group_name: "Vị trí" },
    ],
    images: [
      { id: "img-301", url: "/assets/photos/bedroom-platform-landmark.jpg", alt: "Phòng ngủ giường bục", sort_order: 1 },
      { id: "img-302", url: "/assets/photos/towers-skyline.jpg", alt: "Skyline Landmark 81", sort_order: 2 },
      { id: "img-303", url: "/assets/photos/bathroom-shower.jpg", alt: "Phòng tắm", sort_order: 3 },
    ],
  },
  {
    id: "e1000000-0000-0000-0000-000000000004",
    org_id: "a0000000-0000-0000-0000-000000000001",
    name: "Gaoji Park 1 — Căn 27.10",
    slug: "p1-27-10",
    unit_code: "P1.27.10",
    tower: "Park 1",
    floor: "27",
    view_type: "Trực diện Công viên 14ha & Cầu Sài Gòn",
    price_monthly: 36000000,
    price_nightly: 2100000,
    sqm: 85,
    bedrooms: 2,
    bathrooms: 2,
    max_guests: 4,
    room_layout: [
      { room: "Phòng Khách", bed: "Sofa cao cấp", specs: "Ban công rộng nhìn trọn mảng xanh công viên 14ha" },
      { room: "Phòng Ngủ Master", bed: "1 Giường King (1.8m x 2m)", specs: "View công viên và sông, WC riêng" },
      { room: "Phòng Ngủ 2", bed: "1 Giường Queen (1.6m x 2m)", specs: "Cửa sổ thoáng đãng đón gió sông tự nhiên" },
    ],
    operational_status: "available",
    description: "Căn hộ 2 phòng ngủ tại tòa Park 1 liền kề công viên trung tâm 14 hecta. Không khí trong lành, gió sông thổi quanh năm và yên tĩnh lý tưởng cho gia đình và chuyên gia.",
    address: "Tòa Park 1, Vinhomes Central Park, 208 Nguyễn Hữu Cảnh",
    city: "Bình Thạnh, TP. Hồ Chí Minh",
    status: "active",
    cover_image: "/assets/photos/bedroom-single-sunlit.jpg",
    room_types: [],
    amenities: [
      { code: "park", name: "Sát Vách Công Viên Bờ Sông 14ha", icon: "sparkles", group_name: "Vị trí" },
      { code: "wifi", name: "Wifi 200Mbps", icon: "wifi", group_name: "Công nghệ" },
    ],
    images: [
      { id: "img-401", url: "/assets/photos/bedroom-single-sunlit.jpg", alt: "Phòng ngủ ngập nắng", sort_order: 1 },
      { id: "img-402", url: "/assets/photos/pool-aerial.jpg", alt: "Hồ bơi nhìn từ trên cao", sort_order: 2 },
      { id: "img-403", url: "/assets/photos/bedroom-tv-ensuite.jpg", alt: "Phòng ngủ có TV", sort_order: 3 },
    ],
  },
  {
    id: "e1000000-0000-0000-0000-000000000005",
    org_id: "a0000000-0000-0000-0000-000000000001",
    name: "Gaoji Park 3 — Penthouse Duplex 42.12",
    slug: "p3-42-12",
    unit_code: "P3.42.12",
    tower: "Park 3",
    floor: "42",
    view_type: "Panorama 360° Toàn Cảnh Sông & Thành Phố",
    price_monthly: 65000000,
    price_nightly: 3500000,
    sqm: 140,
    bedrooms: 3,
    bathrooms: 3,
    max_guests: 6,
    room_layout: [
      { room: "Tầng Trệt - Living & Dining", bed: "Sofa cao cấp & Lounge", specs: "Trần cao thông tầng 6m, Bếp đảo sang trọng, Sky terrace" },
      { room: "Tầng Lửng - Master Suite", bed: "1 Giường Super King (2m x 2.2m)", specs: "Phòng tắm kính ngắm toàn cảnh thành phố về đêm" },
      { room: "Phòng Ngủ 2 & 3", bed: "2 Giường Queen (1.6m x 2m)", specs: "WC riêng biệt, tủ âm tường cao cấp" },
    ],
    operational_status: "available",
    description: "Căn hộ Penthouse Duplex thông tầng thượng đỉnh tại Park 3. Diện tích 140 m² với trần kính cao 6m và sân thượng sky terrace riêng biệt chiêm ngưỡng toàn cảnh pháo hoa và bình minh trên sông Sài Gòn.",
    address: "Tòa Park 3, Vinhomes Central Park, 208 Nguyễn Hữu Cảnh",
    city: "Bình Thạnh, TP. Hồ Chí Minh",
    status: "active",
    cover_image: "/assets/photos/sky-terrace.jpg",
    room_types: [],
    amenities: [
      { code: "penthouse", name: "Duplex Trần Cao 6m & Sky Terrace", icon: "sparkles", group_name: "Đặc quyền" },
      { code: "wifi", name: "Wifi 500Mbps Chuyên Nghiệp", icon: "wifi", group_name: "Công nghệ" },
    ],
    images: [
      { id: "img-501", url: "/assets/photos/sky-terrace.jpg", alt: "Sky terrace", sort_order: 1 },
      { id: "img-502", url: "/assets/photos/living-open-plan.jpg", alt: "Phòng khách duplex", sort_order: 2 },
      { id: "img-503", url: "/assets/photos/master-bedroom.jpg", alt: "Master Suite", sort_order: 3 },
    ],
  },
];

export async function fetchProperties(): Promise<Property[]> {
  try {
    const data = await request<Property[]>("/api/v1/properties");
    if (data && data.length > 0) return data;
    return FALLBACK_GAOJI_UNITS;
  } catch {
    return FALLBACK_GAOJI_UNITS;
  }
}

export async function fetchPropertyDetail(id: string): Promise<PropertyDetail> {
  try {
    const data = await request<PropertyDetail>(`/api/v1/properties/${id}`);
    if (data) return data;
    const found = FALLBACK_GAOJI_UNITS.find((u) => u.id === id || u.unit_code === id || u.slug === id);
    if (found) return found;
    throw new ApiError(404, "Không tìm thấy căn hộ");
  } catch {
    const found = FALLBACK_GAOJI_UNITS.find((u) => u.id === id || u.unit_code === id || u.slug === id);
    if (found) return found;
    return FALLBACK_GAOJI_UNITS[0];
  }
}

export async function fetchServices(): Promise<TourService[]> {
  try {
    return await request<TourService[]>("/api/v1/services");
  } catch {
    return [
      { id: "s1", org_id: "org1", name: "Đón / Tiễn Sân Bay Tân Sơn Nhất (Xe 7 Chỗ)", category: "Di chuyển", price: 450000, price_unit: "chuyến", description: "Xe riêng đón tại sảnh ga đến, tài xế hỗ trợ hành lý.", icon: "phone", is_active: true, sort_order: 1 },
      { id: "s2", org_id: "org1", name: "Dịch Vụ Dọn Phòng & Giặt Ga Định Kỳ", category: "Dịch vụ phòng", price: 350000, price_unit: "lần", description: "Thay ga trải giường, dọn dẹp vệ sinh tổng thể.", icon: "sparkles", is_active: true, sort_order: 2 },
      { id: "s3", org_id: "org1", name: "Hỗ Trợ Khai Báo Tạm Trú Người Nước Ngoài", category: "Tiện ích cư trú", price: 0, price_unit: "miễn phí", description: "Thủ tục khai báo công an phường và đăng ký thẻ cư dân.", icon: "shield-check", is_active: true, sort_order: 3 },
      { id: "s4", org_id: "org1", name: "Tour Du Thuyền Hoàng Hôn Sông Sài Gòn", category: "Trải nghiệm", price: 1200000, price_unit: "khách", description: "Khởi hành từ bến thuyền Vinhomes Central Park ngắm hoàng hôn.", icon: "sparkles", is_active: true, sort_order: 4 },
    ];
  }
}

export async function createInquiry(input: InquiryCreateInput): Promise<InquiryResponse> {
  return request<InquiryResponse>("/api/v1/inquiries", {
    method: "POST",
    body: JSON.stringify(input),
  });
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
