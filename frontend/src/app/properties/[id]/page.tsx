"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  ContactRail,
  Icon,
  InquiryModal,
  RoomSpecs,
  Tag,
} from "@/components/gaoji";
import {
  FALLBACK_GAOJI_UNITS,
  fetchProperties,
  fetchPropertyDetail,
  type PropertyDetail,
} from "@/lib/api";
import { formatVnd } from "@/lib/format";

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idOrSlug = typeof params.id === "string" ? params.id : "";

  const [unit, setUnit] = useState<PropertyDetail | null>(null);
  const [allUnits, setAllUnits] = useState<PropertyDetail[]>([]);
  const [activePhoto, setActivePhoto] = useState<string>("");
  const [inquiryOpen, setInquiryOpen] = useState(false);

  // Booking widget form state
  const [checkinDate, setCheckinDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [rentalTerm, setRentalTerm] = useState<"monthly" | "nightly">("monthly");
  const [guestCount, setGuestCount] = useState("2 Khách");

  useEffect(() => {
    fetchProperties().then((data) => {
      // Cast or fallback
      setAllUnits(data as PropertyDetail[]);
    });

    if (idOrSlug) {
      fetchPropertyDetail(idOrSlug)
        .then((data) => {
          setUnit(data);
          if (data.images && data.images.length > 0) {
            setActivePhoto(data.images[0].url);
          } else if (data.cover_image) {
            setActivePhoto(data.cover_image);
          }
        })
        .catch(() => {
          // Find fallback unit
          const fallback =
            FALLBACK_GAOJI_UNITS.find(
              (u) => u.id === idOrSlug || u.slug === idOrSlug || u.unit_code === idOrSlug
            ) || FALLBACK_GAOJI_UNITS[0];
          setUnit(fallback);
          if (fallback.images && fallback.images.length > 0) {
            setActivePhoto(fallback.images[0].url);
          } else if (fallback.cover_image) {
            setActivePhoto(fallback.cover_image);
          }
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
  const layoutItems = Array.isArray(unit.room_layout) ? unit.room_layout : [];

  const displayUnits = allUnits.length > 0 ? allUnits : FALLBACK_GAOJI_UNITS;

  const imagesList =
    unit.images && unit.images.length > 0
      ? unit.images.map((img) => img.url)
      : [
          unit.cover_image || "/assets/photos/living-open-plan.jpg",
          "/assets/photos/master-bedroom.jpg",
          "/assets/photos/kitchen-island.jpg",
          "/assets/photos/bathroom-vanity.jpg",
          "/assets/photos/landmark-81-balcony.jpg",
        ];

  return (
    <div className="bg-[var(--canvas,#F9F7F2)] min-h-screen text-[var(--text-primary,#1A1A1A)] pb-24">
      {/* ── 1. APARTMENT QUICK SWITCHER BAR ─────────────────── */}
      <nav
        aria-label="Chọn căn hộ"
        className="bg-[var(--canvas-warm)] border-b border-[var(--hairline)] sticky top-[68px] z-30"
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link
              href="/#units"
              className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold-900)] transition-colors mr-3"
            >
              <Icon name="arrow-left" size={14} />
              <span>Tất Cả Căn</span>
            </Link>
            <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-[var(--gold-900)] hidden sm:inline">
              Đang Xem:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-1">
            {displayUnits.map((u) => {
              const active = u.id === unit.id || u.slug === unit.slug || u.unit_code === unit.unit_code;
              return (
                <button
                  key={u.id || u.slug}
                  type="button"
                  onClick={() => router.push(`/properties/${u.id || u.slug}`)}
                  className={`px-3 py-1.5 font-sans text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer rounded-none border ${
                    active
                      ? "bg-[var(--jade-700)] text-[var(--accent-on)] border-[var(--jade-700)]"
                      : "bg-[var(--surface-raised)] text-[var(--text-body)] border-[var(--hairline-strong)] hover:border-[var(--gold-700)]"
                  }`}
                >
                  {u.unit_code || u.name}
                  {u.bedrooms ? ` (${u.bedrooms}PN)` : ""}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ── 2. HEADER DETAILS & SPECS ───────────────────────── */}
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

      {/* ── 3. GALLERY SHOWCASE GRID ────────────────────────── */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Large Photo */}
          <div className="lg:col-span-8 relative aspect-[16/10] overflow-hidden bg-[var(--surface-sunken)] border border-[var(--hairline)]">
            <Image
              src={activePhoto || imagesList[0]}
              alt={unit.name}
              fill
              priority
              className="object-cover transition-transform duration-500"
            />
            <span className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur-xs text-[var(--paper-150)] font-sans text-xs font-semibold uppercase tracking-wider">
              HÌNH ẢNH THỰC TẾ CĂN HỘ
            </span>
          </div>

          {/* Thumbnail Grid */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            {imagesList.slice(0, 4).map((img, idx) => (
              <button
                key={img + idx}
                type="button"
                onClick={() => setActivePhoto(img)}
                className={`relative aspect-[4/3] overflow-hidden bg-[var(--surface-sunken)] border cursor-pointer transition-all ${
                  activePhoto === img
                    ? "border-[var(--gold-700)] ring-2 ring-[var(--gold-500)]"
                    : "border-[var(--hairline)] hover:opacity-90"
                }`}
              >
                <Image
                  src={img}
                  alt={`Góc chụp ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. TWO-COLUMN SPLIT: DETAILS & STICKY BOOKING CARD ─ */}
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

        {/* Right Column: Sticky Booking & Stay Request Card */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-[var(--canvas-warm)] border border-[var(--gold-700)] p-6 sm:p-8 shadow-xl">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-900)]">
              Bảng Giá Thuê Trực Tiếp Từ Chủ Nhà
            </span>

            {/* Price display */}
            <div className="mt-4 pb-6 border-b border-[var(--hairline)]">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="font-sans text-xs uppercase tracking-wider text-[var(--text-muted)] block">
                    Giá Thuê Tháng (Bao Phí)
                  </span>
                  <span className="font-display text-3xl sm:text-4xl text-[var(--jade-700)] font-medium">
                    {monthlyPrice ? formatVnd(monthlyPrice) : "Liên hệ"}
                  </span>
                  <span className="font-sans text-xs text-[var(--text-muted)]"> / tháng</span>
                </div>

                {nightlyPrice && (
                  <div className="text-right">
                    <span className="font-sans text-xs uppercase tracking-wider text-[var(--text-muted)] block">
                      Thuê Ngắn Hạn
                    </span>
                    <span className="font-display text-xl text-[var(--gold-900)] font-medium">
                      {formatVnd(nightlyPrice)}
                    </span>
                    <span className="font-sans text-xs text-[var(--text-muted)]"> / đêm</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stay Query Widget */}
            <div className="mt-6 flex flex-col gap-4">
              {/* Term switcher */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRentalTerm("monthly")}
                  className={`py-2 text-xs font-sans font-semibold uppercase tracking-wider rounded-none border transition-colors ${
                    rentalTerm === "monthly"
                      ? "bg-[var(--jade-700)] text-white border-[var(--jade-700)]"
                      : "bg-[var(--surface-raised)] text-[var(--text-muted)] border-[var(--hairline)]"
                  }`}
                >
                  Thuê Dài Hạn (Tháng)
                </button>
                <button
                  type="button"
                  onClick={() => setRentalTerm("nightly")}
                  className={`py-2 text-xs font-sans font-semibold uppercase tracking-wider rounded-none border transition-colors ${
                    rentalTerm === "nightly"
                      ? "bg-[var(--jade-700)] text-white border-[var(--jade-700)]"
                      : "bg-[var(--surface-raised)] text-[var(--text-muted)] border-[var(--hairline)]"
                  }`}
                >
                  Thuê Ngắn Hạn (Đêm)
                </button>
              </div>

              {/* Date Inputs */}
              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-1 font-sans text-xs text-[var(--text-muted)] uppercase">
                  <span>Ngày Nhận Phòng</span>
                  <input
                    type="date"
                    value={checkinDate}
                    onChange={(e) => setCheckinDate(e.target.value)}
                    className="h-10 px-3 bg-[var(--surface-raised)] border border-[var(--hairline-strong)] text-xs font-sans rounded-none focus:outline-1 focus:outline-[var(--gold-500)]"
                  />
                </label>
                <label className="flex flex-col gap-1 font-sans text-xs text-[var(--text-muted)] uppercase">
                  <span>Ngày Trả Phòng</span>
                  <input
                    type="date"
                    value={checkoutDate}
                    onChange={(e) => setCheckoutDate(e.target.value)}
                    className="h-10 px-3 bg-[var(--surface-raised)] border border-[var(--hairline-strong)] text-xs font-sans rounded-none focus:outline-1 focus:outline-[var(--gold-500)]"
                  />
                </label>
              </div>

              {/* Guests selection */}
              <label className="flex flex-col gap-1 font-sans text-xs text-[var(--text-muted)] uppercase">
                <span>Số Lượng Khách</span>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="h-10 px-3 bg-[var(--surface-raised)] border border-[var(--hairline-strong)] text-xs font-sans rounded-none focus:outline-1 focus:outline-[var(--gold-500)]"
                >
                  <option value="1 Khách">1 Khách</option>
                  <option value="2 Khách">2 Khách</option>
                  <option value="3 Khách">3 Khách</option>
                  <option value="4 Khách">4 Khách (Tối đa)</option>
                </select>
              </label>

              {/* Action Buttons */}
              <div className="mt-2 flex flex-col gap-2.5">
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

      <ContactRail onInquire={() => setInquiryOpen(true)} />

      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        initialUnitCode={unit.unit_code || unit.name}
      />
    </div>
  );
}
