"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  ContactRail,
  Icon,
  InquiryModal,
  MosaicGallery,
  PropertyLocationMap,
  RoomSpecs,
  Tag,
} from "@/components/gaoji";
import {
  FALLBACK_GAOJI_UNITS,
  assetUrl,
  fetchPropertyDetail,
  type PropertyDetail,
} from "@/lib/api";
import { formatVnd } from "@/lib/format";

export default function PropertyDetailPage() {
  const params = useParams();
  const idOrSlug = typeof params.id === "string" ? params.id : "";

  const [unit, setUnit] = useState<PropertyDetail | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  useEffect(() => {
    if (idOrSlug) {
      fetchPropertyDetail(idOrSlug)
        .then((data) => {
          setUnit(data);
        })
        .catch(() => {
          // Find fallback unit
          const fallback =
            FALLBACK_GAOJI_UNITS.find(
              (u) => u.id === idOrSlug || u.slug === idOrSlug || u.unit_code === idOrSlug
            ) || FALLBACK_GAOJI_UNITS[0];
          setUnit(fallback);
        });
    }
  }, [idOrSlug]);

  if (!unit) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center bg-[var(--canvas)]">
        <div className="flex items-center gap-3 font-sans text-lg text-[var(--text-muted)]">
          <Icon name="loader-circle" size={24} className="animate-spin" />
          <span>Đang tải thông tin chi tiết căn hộ...</span>
        </div>
      </main>
    );
  }

  const monthlyPrice = unit.price_monthly ? Number(unit.price_monthly) : null;
  const nightlyPrice = unit.price_nightly ? Number(unit.price_nightly) : null;
  const availablePrices = [nightlyPrice, monthlyPrice].filter(
    (price): price is number => price !== null,
  );
  const priceRange = availablePrices.length > 0
    ? `${formatVnd(Math.min(...availablePrices))} – ${formatVnd(Math.max(...availablePrices))}`
    : "Liên hệ để nhận báo giá";
  const layoutItems = Array.isArray(unit.room_layout) ? unit.room_layout : [];

  const galleryFallbacks = [
    {
      id: `${unit.id}-living-room`,
      src: unit.cover_image || "/assets/photos/living-open-plan.jpg",
      alt: `Phòng khách ngập ánh sáng của ${unit.name}`,
      width: 1600,
      height: 1067,
      category: "living-room" as const,
      caption: "Không gian sinh hoạt chung của căn hộ",
    },
    { id: `${unit.id}-kitchen`, src: "/assets/photos/kitchen-island.jpg", alt: "Khu bếp đảo hiện đại", width: 1600, height: 1067, category: "kitchen" as const },
    { id: `${unit.id}-bedroom`, src: "/assets/photos/master-bedroom.jpg", alt: "Phòng ngủ chính với giường lớn", width: 1600, height: 1067, category: "bedroom" as const },
    { id: `${unit.id}-bathroom`, src: "/assets/photos/bathroom-vanity.jpg", alt: "Phòng tắm của căn hộ", width: 1067, height: 1600, category: "bathroom" as const },
    { id: `${unit.id}-balcony`, src: "/assets/photos/landmark-81-balcony.jpg", alt: "Không gian ban công", width: 1600, height: 900, category: "balcony" as const },
  ];
  // API hiện chưa trả kích thước/category; giữ ảnh ở nhóm "Khác" thay vì suy đoán từ tên file.
  const galleryImages = unit.images.length > 0
    ? unit.images.map((image) => ({
        id: image.id,
        src: assetUrl(image.url),
        alt: image.alt || unit.name,
        width: 1600,
        height: 1200,
      }))
    : galleryFallbacks;

  return (
    <div className="bg-[var(--canvas,#F9F7F2)] min-h-screen text-[var(--text-primary,#1A1A1A)] pb-24">
      {/* ── 1. HEADER DETAILS & SPECS ───────────────────────── */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-px bg-[var(--gold-700)]" />
          <span className="font-sans text-[var(--fs-label,0.75rem)] font-semibold uppercase tracking-[var(--tracking-caps,0.15em)] text-[var(--gold-900)]">
            Căn Hộ Dịch Vụ Cao Cấp · Vinhomes Central Park
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6">
          <div>
            <h1 className="font-display text-3xl sm:text-5xl font-normal leading-[1.05] tracking-[-0.02em] text-[var(--ink-900)] uppercase">
              {unit.name}
            </h1>
            <p className="font-sans text-base sm:text-lg italic text-[var(--text-muted)] mt-2">
              {unit.tower ? `Toà ${unit.tower}` : "Vinhomes Central Park"}
              {unit.floor ? ` · Tầng ${unit.floor}` : ""}
              {unit.view_type ? ` · ${unit.view_type}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="available" icon="badge-check">
              Sẵn Sàng Cho Thuê
            </Badge>
            <Badge tone="gold" icon="map-pin">
              0.2 km · Landmark 81
            </Badge>
          </div>
        </div>

        <hr className="h-px border-0 bg-[var(--hairline)] my-2" />

        <div className="py-4">
          <RoomSpecs
            beds={unit.bedrooms || 2}
            baths={unit.bathrooms || 2}
            sqm={unit.sqm || 82}
            guests={unit.max_guests || 4}
          />
        </div>
      </section>

      {/* ── 2. GALLERY SHOWCASE GRID ────────────────────────── */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 mt-6">
        <MosaicGallery images={galleryImages} propertyName={unit.name} />
      </section>

      {/* ── 3. TWO-COLUMN SPLIT: DETAILS & STICKY BOOKING CARD ─ */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Details, Layout, Amenities, Rules */}
        <div className="lg:col-span-7 flex flex-col gap-12">
          {/* Overview */}
          <div className="bg-[var(--surface-raised)] p-6 sm:p-8 border border-[var(--hairline)]">
            <h2 className="font-display text-2xl font-normal text-[var(--ink-900)] uppercase mb-4">
              Tổng Quan Không Gian & Thiết Kế
            </h2>
            <p className="font-sans text-base leading-relaxed text-[var(--text-body)]">
              {unit.description ||
                "Không gian căn hộ dịch vụ cao cấp được hoàn thiện với tiêu chuẩn khắt khe. Toàn bộ sàn gỗ tự nhiên kết hợp đá marble, hệ thống kính Low-E 3 lớp chống ồn tuyệt đối mang lại giấc ngủ trọn vẹn và không gian làm việc tĩnh lặng cho quý khách."}
            </p>
          </div>

          {/* Room Layout Breakdown */}
          <div className="bg-[var(--surface-raised)] p-6 sm:p-8 border border-[var(--hairline)]">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-6 h-px bg-[var(--gold-700)]" />
              <h2 className="font-display text-2xl font-normal text-[var(--ink-900)] uppercase">
                Bố Trí Từng Phòng Trong Căn Hộ
              </h2>
            </div>

            <div className="divide-y divide-[var(--hairline)]">
              {layoutItems.length > 0 ? (
                layoutItems.map((item, i) => (
                  <div key={i} className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="sm:w-1/3">
                      <span className="font-sans text-sm font-semibold uppercase tracking-wider text-[var(--jade-900)]">
                        {item.room}
                      </span>
                      <span className="block font-sans text-xs text-[var(--gold-900)] mt-0.5">
                        {item.bed}
                      </span>
                    </div>
                    <div className="sm:w-2/3 font-sans text-sm text-[var(--text-body)]">
                      {item.specs}
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="sm:w-1/3">
                      <span className="font-sans text-sm font-semibold uppercase tracking-wider text-[var(--jade-900)]">
                        Phòng Khách & Bếp
                      </span>
                      <span className="block font-sans text-xs text-[var(--gold-900)] mt-0.5">
                        Sofa Lớn & Bàn Ăn
                      </span>
                    </div>
                    <div className="sm:w-2/3 font-sans text-sm text-[var(--text-body)]">
                      Smart TV 65-inch 4K, bếp từ âm Bosch, tủ lạnh lớn, bàn ăn 4 ghế gỗ óc chó.
                    </div>
                  </div>
                  <div className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="sm:w-1/3">
                      <span className="font-sans text-sm font-semibold uppercase tracking-wider text-[var(--jade-900)]">
                        Phòng Ngủ Master
                      </span>
                      <span className="block font-sans text-xs text-[var(--gold-900)] mt-0.5">
                        1 Giường King (1.8m x 2m)
                      </span>
                    </div>
                    <div className="sm:w-2/3 font-sans text-sm text-[var(--text-body)]">
                      Cửa sổ kính panorama view Landmark 81, nệm lò xo túi êm ái, bàn làm việc và WC riêng.
                    </div>
                  </div>
                  <div className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="sm:w-1/3">
                      <span className="font-sans text-sm font-semibold uppercase tracking-wider text-[var(--jade-900)]">
                        Ban Công Thoáng Mát
                      </span>
                      <span className="block font-sans text-xs text-[var(--gold-900)] mt-0.5">
                        Bàn Trà Ngắm Cảnh
                      </span>
                    </div>
                    <div className="sm:w-2/3 font-sans text-sm text-[var(--text-body)]">
                      Tầm nhìn bao trọn công viên ven sông 14ha và ánh đèn lung linh của thành phố.
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Grouped Amenities */}
          <div className="bg-[var(--surface-raised)] p-6 sm:p-8 border border-[var(--hairline)]">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-6 h-px bg-[var(--gold-700)]" />
              <h2 className="font-display text-2xl font-normal text-[var(--ink-900)] uppercase">
                Tiện Nghi & Trang Thiết Bị Đi Kèm
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[var(--gold-900)]">
                  Tiện Nghi Căn Hộ
                </span>
                <div className="flex flex-wrap gap-2">
                  <Tag icon="wifi">Wifi Cáp Quang 300Mbps</Tag>
                  <Tag icon="tv">Smart TV Truyền Hình K+</Tag>
                  <Tag icon="air-vent">Điều Hoà Trung Tâm</Tag>
                  <Tag icon="sparkles">Máy Giặt & Máy Sấy Riêng</Tag>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[var(--gold-900)]">
                  Bếp & Phòng Tắm
                </span>
                <div className="flex flex-wrap gap-2">
                  <Tag icon="cooking-pot">Bếp Từ & Lò Vi Sóng</Tag>
                  <Tag icon="coffee">Ấm Siêu Tốc & Bộ Tách Trà</Tag>
                  <Tag icon="bath">Bồn Tắm Nằm & Máy Sấy Tóc</Tag>
                  <Tag icon="sparkles">Bộ Dầu Gội & Sữa Tắm Hữu Cơ</Tag>
                </div>
              </div>
            </div>
          </div>

          {/* House Rules & Policies */}
          <div className="bg-[var(--surface-raised)] p-6 sm:p-8 border border-[var(--hairline)]">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-px bg-[var(--gold-700)]" />
              <h2 className="font-display text-2xl font-normal text-[var(--ink-900)] uppercase">
                Nội Quy Cư Trú & Chính Sách
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-sm text-[var(--text-body)]">
              <div className="flex items-start gap-3">
                <Icon name="clock" size={16} color="var(--gold-900)" className="mt-1 shrink-0" />
                <div>
                  <strong>Nhận & Trả Phòng:</strong>
                  <br />
                  Nhận phòng từ 14:00 · Trả phòng trước 12:00 trưa (Hỗ trợ linh hoạt nếu phòng trống).
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Icon name="shield-check" size={16} color="var(--gold-900)" className="mt-1 shrink-0" />
                <div>
                  <strong>Đăng Ký Khách Cư Trú:</strong>
                  <br />
                  Cung cấp CCCD / Hộ chiếu trước khi check-in để làm thủ tục khai báo tạm trú C06.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Icon name="alert-triangle" size={16} color="var(--gold-900)" className="mt-1 shrink-0" />
                <div>
                  <strong>Không Hút Thuốc:</strong>
                  <br />
                  Nghiêm cấm hút thuốc trong căn hộ (Có thể sử dụng ban công mở).
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Icon name="sparkles" size={16} color="var(--gold-900)" className="mt-1 shrink-0" />
                <div>
                  <strong>Vệ Sinh Định Kỳ:</strong>
                  <br />
                  Dọn phòng và thay ga gối định kỳ 2 lần/tuần cho khách thuê dài hạn.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Price & Contact Card */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-[var(--canvas-warm)] border border-[var(--gold-700)] p-6 sm:p-8">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-900)]">
              Bảng Giá Thuê Trực Tiếp Từ Chủ Nhà
            </span>

            {/* Compact price range */}
            <div className="mt-4 pb-6 border-b border-[var(--hairline)]">
              <span className="font-sans text-xs uppercase tracking-wider text-[var(--text-muted)] block">
                Khoảng Giá Tham Khảo
              </span>
              <strong className="mt-1 block font-display text-3xl font-medium text-[var(--jade-700)] sm:text-4xl">
                {priceRange}
              </strong>
              <p className="mt-2 font-sans text-xs leading-5 text-[var(--text-muted)]">
                Giá chính xác phụ thuộc thời hạn thuê và tình trạng căn hộ tại thời điểm tư vấn.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-5">
              <div className="flex flex-col gap-2.5">
                <Button
                  variant="gold"
                  size="md"
                  full
                  icon="message-circle"
                  as="a"
                  href={`https://zalo.me/0889237833?text=Toi%20quan%20tam%20can%20ho%20${encodeURIComponent(
                    unit.unit_code || unit.name
                  )}`}
                  target="_blank"
                >
                  Chat Zalo Giữ Phòng Ngay
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  full
                  onClick={() => setInquiryOpen(true)}
                >
                  Gửi Yêu Cầu Báo Giá Trực Tiếp
                </Button>
              </div>

              {/* Direct host info */}
              <div className="mt-4 pt-4 border-t border-[var(--hairline)] flex items-center justify-between font-sans text-xs text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5">
                  <Icon name="phone" size={13} color="var(--gold-900)" />
                  <span>Hotline: 088 923 7833</span>
                </span>
                <span>Phản hồi trong 15 phút</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PropertyLocationMap
        propertyName={unit.name}
        tower={unit.tower}
        address={unit.address}
        city={unit.city}
      />

      <ContactRail onInquire={() => setInquiryOpen(true)} />

      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        initialUnitCode={unit.unit_code || unit.name}
      />
    </div>
  );
}
