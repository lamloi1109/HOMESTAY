export const GALLERY_CATEGORY_ORDER = [
  "living-room",
  "bedroom",
  "kitchen",
  "bathroom",
  "balcony",
  "amenities",
  "other",
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORY_ORDER)[number];

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  category?: GalleryCategory;
  caption?: string;
  thumbnailSrc?: string;
  fullSrc?: string;
}

export const GALLERY_CATEGORY_LABELS: Record<GalleryCategory, string> = {
  "living-room": "Phòng khách",
  bedroom: "Phòng ngủ",
  kitchen: "Bếp & bàn ăn",
  bathroom: "Phòng tắm",
  balcony: "Ban công",
  amenities: "Tiện nghi",
  other: "Khác",
};

export function imageCategory(image: GalleryImage): GalleryCategory {
  return image.category ?? "other";
}
