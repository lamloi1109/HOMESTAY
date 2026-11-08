// Shared Complex-Level Amenities Manifest for Vinhomes Central Park
// Sourced from Cloudflare R2 complexes directory: complexes/vhcp/amenities/

import { getAssetBaseUrl } from "./propertyGalleries.ts";

export interface ComplexAmenity {
  id: string;
  name: string;
  category: "pool" | "park" | "marina" | "landscape" | "amenities";
  title: string;
  description: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  thumbnailPath: string;
  fullPath: string;
  thumbnailSrc: string;
  fullSrc: string;
  src: string;
}

export const COMPLEX_AMENITY_DATA: Record<string, {
  complexName: string;
  complexSlug: string;
  amenities: Omit<ComplexAmenity, "thumbnailSrc" | "fullSrc" | "src">[];
}> = {
  vhcp: {
    complexName: "Vinhomes Central Park",
    complexSlug: "vhcp",
    amenities: [
      {
        id: "vhcp-infinity-pool",
        name: "Hồ bơi vô cực tràn bờ",
        category: "pool",
        title: "Cụm hồ bơi vô cực tràn bờ ven sông",
        description: "Hệ thống hồ bơi vô cực ngoài trời với tầm nhìn panorama hướng trực diện công viên và sông Sài Gòn.",
        alt: "Cụm hồ bơi vô cực ngoài trời tại Vinhomes Central Park",
        caption: "Hồ bơi tràn bờ dành riêng cho cư dân và khách lưu trú",
        width: 1600,
        height: 1067,
        thumbnailPath: "complexes/vhcp/amenities/f95bf2a112fa-640.webp",
        fullPath: "complexes/vhcp/amenities/d129c77f8655-1600.webp",
      },
      {
        id: "vhcp-riverside-park",
        name: "Đại công viên ven sông 14ha",
        category: "park",
        title: "Công viên ven sông 14 hecta quy mô bậc nhất",
        description: "Lá phổi xanh bên bờ sông Sài Gòn với thảm cỏ trải dài, đường dạo bộ ven sông, vườn Nhật Bản và hồ cá Koi.",
        alt: "Đại công viên ven sông 14 hecta Vinhomes Central Park",
        caption: "Không gian cảnh quan xanh mát và đường dạo bộ thư giãn",
        width: 1600,
        height: 1067,
        thumbnailPath: "complexes/vhcp/amenities/06b0c73eb2e9-640.webp",
        fullPath: "complexes/vhcp/amenities/de056a62a00b-1600.webp",
      },
      {
        id: "vhcp-marina",
        name: "Bến du thuyền The Marina",
        category: "marina",
        title: "Bến du thuyền tiêu chuẩn quốc tế",
        description: "Bến du thuyền sang trọng bên bờ sông Sài Gòn, nơi đón hoàng hôn và khởi hành các tour du ngoạn đường thủy.",
        alt: "Bến du thuyền The Marina tại Vinhomes Central Park",
        caption: "Bến du thuyền quốc tế đẳng cấp bên bờ sông Sài Gòn",
        width: 1600,
        height: 1067,
        thumbnailPath: "complexes/vhcp/amenities/a00337ea2247-640.webp",
        fullPath: "complexes/vhcp/amenities/577750eee8af-1600.webp",
      },
      {
        id: "vhcp-landmark-landscape",
        name: "Quần thể cảnh quan & Landmark 81",
        category: "landscape",
        title: "Quảng trường ánh sáng & tháp biểu tượng Landmark 81",
        description: "Quần thể đô thị hiện đại tích hợp trung tâm thương mại Vincom Center, rạp chiếu phim và chuỗi ẩm thực đa quốc gia.",
        alt: "Toàn cảnh cảnh quan và toà tháp Landmark 81",
        caption: "Biểu tượng năng động của TP. Hồ Chí Minh ngay dưới chân toà nhà",
        width: 1600,
        height: 1067,
        thumbnailPath: "complexes/vhcp/amenities/673eb9e27ff6-640.webp",
        fullPath: "complexes/vhcp/amenities/3e435ba9f268-1600.webp",
      },
    ],
  },
};

const COMPLEX_ALIASES: Record<string, string> = {
  vhcp: "vhcp",
  "vinhomes-central-park": "vhcp",
  vinhomes: "vhcp",
  centralpark: "vhcp",
};

/**
 * Returns complex-level shared amenities with dual-variant URLs
 */
export function getComplexAmenities(complexSlugOrCode: string = "vhcp"): ComplexAmenity[] {
  if (!complexSlugOrCode) return [];

  const key = complexSlugOrCode.trim().toLowerCase().replace(/_/g, "-");
  const complexKey = COMPLEX_ALIASES[key] || (COMPLEX_AMENITY_DATA[key] ? key : null);

  if (!complexKey || !COMPLEX_AMENITY_DATA[complexKey]) {
    return [];
  }

  const baseUrl = getAssetBaseUrl();
  const rawList = COMPLEX_AMENITY_DATA[complexKey].amenities;

  return rawList.map((item) => ({
    ...item,
    thumbnailSrc: `${baseUrl}/${item.thumbnailPath}`,
    fullSrc: `${baseUrl}/${item.fullPath}`,
    src: `${baseUrl}/${item.fullPath}`,
  }));
}
