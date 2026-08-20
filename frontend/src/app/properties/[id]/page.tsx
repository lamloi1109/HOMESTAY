"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/gaoji/Badge";
import { Button } from "@/components/gaoji/Button";
import { ContactRail } from "@/components/gaoji/ContactRail";
import { Icon } from "@/components/gaoji/Icon";
import { InquiryModal } from "@/components/gaoji/InquiryModal";
import { Tag } from "@/components/gaoji/Tag";
import { fetchPropertyDetail, type PropertyDetail } from "@/lib/api";
import { formatVnd } from "@/lib/format";

export default function PropertyDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const [unit, setUnit] = useState<PropertyDetail | null>(null);
  const [activePhoto, setActivePhoto] = useState<string>("");
  const [inquiryOpen, setInquiryOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPropertyDetail(id).then((data) => {
        setUnit(data);
        if (data.images && data.images.length > 0) {
          setActivePhoto(data.images[0].url);
        } else if (data.cover_image) {
          setActivePhoto(data.cover_image);
        }
      });
    }
  }, [id]);

  if (!unit) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 font-sans text-lg text-[var(--text-muted)]">
          <Icon name="loader-circle" size={24} className="animate-spin" />
          <span>Đang tải thông tin căn hộ...</span>
        </div>
      </main>
    );
  }

  const monthlyPrice = unit.price_monthly ? Number(unit.price_monthly) : null;
  const nightlyPrice = unit.price_nightly ? Number(unit.price_nightly) : null;
  const layoutItems = Array.isArray(unit.room_layout) ? unit.room_layout : [];

  return (
    <div className="bg-[var(--canvas)] min-h-screen text-[var(--text-primary)] pb-20">
      {/* ── BREADCRUMB ────────────────────────────────────── */}
      <div className="bg-[var(--surface-raised)] border-b border-[var(--hairline)] py-3">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 flex items-center gap-2 font-sans text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--gold-900)] transition-colors">
            Trang Chủ
          </Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-[var(--gold-900)] transition-colors">
            Bộ Sưu Tập Căn Hộ
          </Link>
          <span>/</span>
          <span className="text-[var(--ink-900)] font-semibold">{unit.unit_code || unit.name}</span>
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 pt-8">
        {/* ── HEADER TITLE & BADGES ─────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6">
          <div className="grid gap-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge tone="gold" variant="solid">
                {unit.unit_code || "Vinhomes Central Park"}
              </Badge>
              {unit.tower && (
                <span className="px-2.5 py-0.5 bg-[var(--surface-sunken)] border border-[var(--hairline-strong)] font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[var(--jade-700)]">
                  {unit.tower} · Tầng {unit.floor}
                </span>
              )}
              {unit.view_type && (
                <span className="px-2.5 py-0.5 bg-[var(--gold-100)] border border-[var(--gold-700)] font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[var(--gold-900)]">
                  {unit.view_type}
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[var(--ink-900)] mt-1">
              {unit.name}
            </h1>

            <p className="flex items-center gap-1.5 font-sans text-sm text-[var(--text-muted)]">
              <Icon name="map-pin" size={15} color="var(--gold-900)" />
              <span>{unit.address || "208 Nguyễn Hữu Cảnh, P. 22, Bình Thạnh, TP. Hồ Chí Minh"}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              as="a"
              href="https://zalo.me/0889237833"
              target="_blank"
              icon="message-circle"
            >
              Chat Zalo
            </Button>
            <Button
              variant="gold"
              size="sm"
              onClick={() => setInquiryOpen(true)}
              icon="calendar"
            >
              Đặt Phòng / Hỏi Giá
            </Button>
          </div>
        </div>

        {/* ── PHOTO GALLERY ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-6">
          {/* Main Large Photo */}
          <div className="lg:col-span-8 relative aspect-[16/10] bg-[var(--jade-900)] border border-[var(--hairline-strong)] overflow-hidden">
            <Image
              src={activePhoto || unit.cover_image || "/assets/photos/living-open-plan.jpg"}
              alt={unit.name}
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Thumbnails Grid */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            {unit.images.slice(0, 4).map((img) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setActivePhoto(img.url)}
                className={`relative aspect-[4/3] bg-[var(--surface-sunken)] border transition-all overflow-hidden cursor-pointer ${
                  activePhoto === img.url
                    ? "border-[var(--gold-500)] ring-2 ring-[var(--gold-500)]"
                    : "border-[var(--hairline-strong)] hover:border-[var(--gold-700)] opacity-85 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt || unit.name}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* ── MAIN CONTENT & STICKY SIDEBAR ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
          {/* Left Column (8 cols): Description, Specs, Layout, Amenities */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {/* Specs Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-[var(--surface-raised)] border border-[var(--hairline-strong)]">
              <div className="flex flex-col gap-1">
                <span className="font-sans text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  Diện Tích
                </span>
                <span className="font-display text-2xl text-[var(--jade-700)] font-medium">
                  {unit.sqm || 82} m²
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  Phòng Ngủ
                </span>
                <span className="font-display text-2xl text-[var(--jade-700)] font-medium">
                  {unit.bedrooms || 2} PN
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  Phòng Tắm
                </span>
                <span className="font-display text-2xl text-[var(--jade-700)] font-medium">
                  {unit.bathrooms || 2} WC
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  Sức Chứa
                </span>
                <span className="font-display text-2xl text-[var(--jade-700)] font-medium">
                  {unit.max_guests || 4} Khách
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-px bg-[var(--gold-700)]" />
                <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-900)]">
                  Giới Thiệu Căn Hộ
                </h2>
              </div>
              <p className="font-sans text-base sm:text-lg leading-relaxed text-[var(--text-body)]">
                {unit.description}
              </p>
            </div>

            {/* Room Layout Breakdown */}
            {layoutItems.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-5 h-px bg-[var(--gold-700)]" />
                  <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-900)]">
                    Cấu Trúc Bố Trí Không Gian (Room Layout)
                  </h2>
                </div>

                <div className="grid gap-3">
                  {layoutItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-[var(--surface-raised)] border border-[var(--hairline)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center bg-[var(--gold-100)] text-[var(--gold-900)] shrink-0">
                          <Icon name="bed" size={16} />
                        </div>
                        <div>
                          <span className="font-sans font-semibold text-sm text-[var(--ink-900)] block">
                            {item.room}
                          </span>
                          <span className="font-sans text-xs text-[var(--gold-900)] font-medium">
                            {item.bed}
                          </span>
                        </div>
                      </div>
                      <span className="font-sans text-xs text-[var(--text-muted)] max-w-sm">
                        {item.specs}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities Checklist */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-5 h-px bg-[var(--gold-700)]" />
                <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-900)]">
                  Tiện Nghi & Đặc Quyền Cư Trú
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {unit.amenities.map((a) => (
                  <Tag key={a.code} icon={a.icon || "sparkles"}>
                    {a.name}
                  </Tag>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Sticky CTA Booking Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-[var(--surface-raised)] border border-[var(--gold-700)] shadow-xl p-6 sm:p-8 flex flex-col gap-6">
              <div>
                <span className="font-sans text-xs uppercase tracking-[0.15em] text-[var(--gold-900)] font-semibold block mb-1">
                  Giá Thuê Trực Tiếp Từ Quản Lý
                </span>
                {monthlyPrice && (
                  <div className="mt-2">
                    <span className="font-display text-3xl font-medium text-[var(--jade-700)]">
                      {formatVnd(monthlyPrice)}
                    </span>
                    <span className="font-sans text-xs text-[var(--text-muted)] block mt-0.5">
                      / tháng (đã bao gồm phí quản lý & internet tốc độ cao)
                    </span>
                  </div>
                )}

                {nightlyPrice && (
                  <div className="mt-3 pt-3 border-t border-[var(--hairline)] flex items-baseline justify-between">
                    <span className="font-sans text-xs text-[var(--text-muted)]">Thuê Ngắn Hạn:</span>
                    <span className="font-sans font-semibold text-sm text-[var(--gold-900)]">
                      {formatVnd(nightlyPrice)} / đêm
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  variant="gold"
                  size="lg"
                  full
                  onClick={() => setInquiryOpen(true)}
                  icon="calendar"
                >
                  Đặt Phòng / Hỏi Giá
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  full
                  as="a"
                  href="https://zalo.me/0889237833"
                  target="_blank"
                  icon="message-circle"
                >
                  Chat Zalo Trực Tiếp (0889 237 833)
                </Button>
              </div>

              {/* Trust badges */}
              <div className="pt-4 border-t border-[var(--hairline)] flex flex-col gap-2.5 font-sans text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-2">
                  <Icon name="badge-check" size={16} color="var(--success)" />
                  <span>Không phụ phí nền tảng trung gian</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="shield-check" size={16} color="var(--success)" />
                  <span>Hỗ trợ xem phòng trực tiếp 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="phone" size={16} color="var(--success)" />
                  <span>Hotline quản lý căn hộ: 088 923 7833</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactRail
        zalo="https://zalo.me/0889237833"
        phone="0889237833"
        email="stay@gaojihouse.vn"
        onInquire={() => setInquiryOpen(true)}
      />

      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        initialUnitCode={unit.unit_code || unit.name}
      />
    </div>
  );
}
