"use client";

import Image from "next/image";
import React, { useState } from "react";
import {
  Button,
  ContactRail,
  FilterTabs,
  IconButton,
  InquiryModal,
  PhotoPlate,
  SectionHeader,
} from "@/components/gaoji";

interface GalleryItem {
  id: string;
  src: string;
  title: string;
  category: "living" | "bedroom" | "bath" | "amenity";
  plate: string;
  ratio?: string;
  unit: string;
}

const GALLERY_PHOTOS: GalleryItem[] = [
  {
    id: "g-1",
    src: "/assets/photos/living-open-plan.jpg",
    title: "Phòng Khách Không Gian Mở Với Ánh Sáng Tự Nhiên",
    category: "living",
    plate: "HÌNH 01 — PHÒNG KHÁCH CĂN HỘ LANDMARK 1",
    ratio: "16 / 10",
    unit: "L1.29.08",
  },
  {
    id: "g-2",
    src: "/assets/photos/landmark-81-balcony.jpg",
    title: "Tầm Nhìn Trực Diện Landmark 81 Từ Ban Công Căn Hộ",
    category: "amenity",
    plate: "HÌNH 02 — BAN CÔNG VIEW TOÀ THÁP BIỂU TƯỢNG",
    ratio: "4 / 5",
    unit: "L3.44.09",
  },
  {
    id: "g-3",
    src: "/assets/photos/bedroom-master-river.jpg",
    title: "Phòng Ngủ Master Với Cửa Sổ Tràn Kính View Sông",
    category: "bedroom",
    plate: "HÌNH 03 — PHÒNG NGỦ MASTER TẦNG CAO",
    ratio: "4 / 3",
    unit: "L1.29.08",
  },
  {
    id: "g-4",
    src: "/assets/photos/kitchen-island.jpg",
    title: "Bếp Đảo Hiện Đại Trang Bị Thiết Bị Cao Cấp Bosch",
    category: "living",
    plate: "HÌNH 04 — KHU VỰC BẾP NẤU & BÀN ĐẢO",
    ratio: "4 / 3",
    unit: "P3.42.12",
  },
  {
    id: "g-5",
    src: "/assets/photos/pool-aerial.jpg",
    title: "Cụm Hồ Bơi Vô Cực Tràn Bờ Ven Sông Sài Gòn",
    category: "amenity",
    plate: "HÌNH 05 — HỒ BƠI VÔ CỰC NỘI KHU",
    ratio: "16 / 10",
    unit: "Vinhomes Central Park",
  },
  {
    id: "g-6",
    src: "/assets/photos/bathroom-vanity.jpg",
    title: "Phòng Tắm Cao Cấp Bàn Đá Marble & Thiết Bị Kohler",
    category: "bath",
    plate: "HÌNH 06 — PHÒNG TẮM MASTER",
    ratio: "4 / 3",
    unit: "P1.27.10",
  },
  {
    id: "g-7",
    src: "/assets/photos/bedroom-platform-landmark.jpg",
    title: "Phòng Ngủ Giường Bục Nhìn Trực Diện Sảnh Landmark 81",
    category: "bedroom",
    plate: "HÌNH 07 — PHÒNG NGỦ LANDMARK 81",
    ratio: "16 / 10",
    unit: "L81.07.12",
  },
  {
    id: "g-8",
    src: "/assets/photos/living-dining.jpg",
    title: "Không Gian Sinh Hoạt Chung & Bàn Ăn Gỗ Óc Chó",
    category: "living",
    plate: "HÌNH 08 — PHÒNG KHÁCH & BÀN ĂN 6 GHẾ",
    ratio: "16 / 10",
    unit: "L3.44.09",
  },
  {
    id: "g-9",
    src: "/assets/photos/gym.webp",
    title: "Phòng Tập Gym & Yoga Tiêu Chuẩn Quốc Tế Technogym",
    category: "amenity",
    plate: "HÌNH 09 — PHÒNG GYM & YOGA CƯ DÂN",
    ratio: "16 / 10",
    unit: "Vinhomes Central Park",
  },
  {
    id: "g-10",
    src: "/assets/photos/bedroom-twin-river.jpg",
    title: "Phòng Ngủ 2 Giường Đơn Thoáng Mát Hướng Gió Sông",
    category: "bedroom",
    plate: "HÌNH 10 — PHÒNG NGỦ 2 GIƯỜNG ĐƠN",
    ratio: "4 / 3",
    unit: "L3.44.09",
  },
  {
    id: "g-11",
    src: "/assets/photos/bathroom-shower.jpg",
    title: "Phòng Tắm Đứng Vách Kính Cường Lực Sang Trọng",
    category: "bath",
    plate: "HÌNH 11 — PHÒNG TẮM ĐỨNG",
    ratio: "4 / 3",
    unit: "L1.29.08",
  },
  {
    id: "g-12",
    src: "/assets/photos/sky-terrace.jpg",
    title: "Sky Terrace & Hầm Rượu Vang Tầng Thượng Ngắm Pháo Hoa",
    category: "amenity",
    plate: "HÌNH 12 — SÂN THƯỢNG NGẮM HOÀNG HÔN",
    ratio: "16 / 10",
    unit: "Park 3",
  },
];

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<string | number>("all");
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryItem | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const filteredPhotos =
    activeTab === "all"
      ? GALLERY_PHOTOS
      : GALLERY_PHOTOS.filter((p) => p.category === activeTab);

  return (
    <main className="min-h-screen bg-[var(--canvas,#F9F7F2)] text-[var(--text-primary,#1A1A1A)] py-12 sm:py-16 px-4 sm:px-8 lg:px-12 pb-28">
      <div className="max-w-[1600px] mx-auto">
        <SectionHeader
          eyebrow="BỘ SƯU TẬP HÌNH ẢNH NGUYÊN BẢN · GAO JI HOUSE"
          title="Thư Viện Không Gian Sống"
          aside="Góc nhìn chân thực từ các căn hộ dịch vụ cao cấp. Toàn bộ ảnh chụp thực tế dưới ánh sáng tự nhiên, phản ánh chính xác chất liệu gỗ óc chó, đá marble và tầm nhìn sông Sài Gòn."
        />

        {/* Filter tabs */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--hairline)]">
          <FilterTabs
            tabs={[
              { label: "Tất Cả (12)", value: "all" },
              { label: "Phòng Khách & Bếp", value: "living" },
              { label: "Phòng Ngủ Master", value: "bedroom" },
              { label: "Phòng Tắm & Ban Công", value: "bath" },
              { label: "Tiện Ích & Landmark 81", value: "amenity" },
            ]}
            value={activeTab}
            onChange={(val) => setActiveTab(val)}
          />

          <span className="font-sans text-xs uppercase tracking-wider text-[var(--gold-900)] font-semibold">
            {filteredPhotos.length} Bức Ảnh
          </span>
        </div>

        {/* Masonry / Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setLightboxPhoto(photo)}
              className="cursor-pointer group flex flex-col bg-[var(--surface-raised)] border border-[var(--hairline)] p-4 hover:border-[var(--gold-700)] transition-colors"
            >
              <PhotoPlate
                src={photo.src}
                alt={photo.title}
                ratio={photo.ratio || "4 / 3"}
                caption={photo.plate}
                offset="right"
              />

              <div className="mt-4 pt-3 border-t border-[var(--hairline)] flex items-center justify-between">
                <span className="font-display text-lg text-[var(--ink-900)] group-hover:text-[var(--gold-900)] transition-colors">
                  {photo.title}
                </span>
                <span className="px-2 py-0.5 bg-[var(--surface-sunken)] text-[var(--jade-700)] font-sans text-[0.6875rem] font-semibold uppercase tracking-wider shrink-0 ml-2">
                  {photo.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── LIGHTBOX MODAL ──────────────────────────────────── */}
      {lightboxPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[var(--canvas-warm)] border border-[var(--gold-700)] shadow-2xl p-6 sm:p-8 grid gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[var(--gold-900)]">
                  {lightboxPhoto.plate} · {lightboxPhoto.unit}
                </span>
                <h3 className="font-display text-2xl text-[var(--ink-900)] mt-1">
                  {lightboxPhoto.title}
                </h3>
              </div>
              <IconButton
                icon="x"
                label="Đóng xem ảnh"
                onClick={() => setLightboxPhoto(null)}
                size={40}
              />
            </div>

            <div className="relative aspect-[16/10] w-full overflow-hidden bg-black border border-[var(--hairline)]">
              <Image
                src={lightboxPhoto.src}
                alt={lightboxPhoto.title}
                fill
                className="object-contain"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[var(--hairline)]">
              <span className="font-sans text-xs text-[var(--text-muted)] uppercase tracking-wider">
                Gao Ji House · Ảnh Chụp Thực Tế Vinhomes Central Park
              </span>
              <Button
                variant="gold"
                size="sm"
                onClick={() => {
                  setLightboxPhoto(null);
                  setInquiryOpen(true);
                }}
              >
                Hỏi Thuê Căn Hộ Này
              </Button>
            </div>
          </div>
        </div>
      )}

      <ContactRail onInquire={() => setInquiryOpen(true)} />

      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
      />
    </main>
  );
}
