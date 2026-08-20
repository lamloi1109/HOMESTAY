"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ContactRail } from "@/components/gaoji/ContactRail";
import { Button } from "@/components/gaoji/Button";
import { Icon } from "@/components/gaoji/Icon";
import { InquiryModal } from "@/components/gaoji/InquiryModal";
import { UnitCard } from "@/components/gaoji/UnitCard";
import { fetchProperties, fetchServices, type Property, type TourService } from "@/lib/api";
import { formatVnd } from "@/lib/format";

export default function HomePage() {
  const [units, setUnits] = useState<Property[]>([]);
  const [services, setServices] = useState<TourService[]>([]);
  const [selectedBedroom, setSelectedBedroom] = useState<number | "all">("all");
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedUnitCode, setSelectedUnitCode] = useState<string>("");

  useEffect(() => {
    fetchProperties().then((data) => setUnits(data));
    fetchServices().then((data) => setServices(data));
  }, []);

  const handleOpenInquiry = (code?: string) => {
    setSelectedUnitCode(code || "");
    setInquiryOpen(true);
  };

  const filteredUnits = units.filter((u) => {
    if (selectedBedroom === "all") return true;
    return u.bedrooms === selectedBedroom;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[var(--canvas)] text-[var(--text-primary)]">
      {/* ── 1. HERO SECTION ─────────────────────────────────── */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-end overflow-hidden bg-[var(--jade-900)]">
        {/* Background hero photo */}
        <Image
          src="/assets/photos/living-open-plan.jpg"
          alt="Không gian phòng khách căn hộ dịch vụ Gao Ji House"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Protection Gradients */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/80 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 bottom-0 h-40 bg-gradient-to-t from-[var(--canvas)] via-[var(--canvas)]/70 to-transparent pointer-events-none"
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1360px] mx-auto w-full px-4 sm:px-8 pt-24 pb-16 sm:pb-24">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-[var(--gold-500)]" />
            <span className="font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold-050)]">
              Gao Ji House · Vinhomes Central Park
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-normal uppercase text-white leading-[1.1] max-w-4xl tracking-tight">
            Căn Hộ Dịch Vụ Cho Thuê
            <br />
            <span className="text-[var(--gold-050)] italic font-light lowercase">
              ven sông Sài Gòn & kề cận Landmark 81
            </span>
          </h1>

          <p className="font-sans text-base sm:text-lg lg:text-xl text-[var(--paper-150)]/90 max-w-2xl mt-5 leading-relaxed">
            Bộ sưu tập 5 căn hộ cao cấp đầy đủ nội thất sang trọng. Đáp ứng hoàn hảo cho chuyên gia lưu trú dài hạn, gia đình nghỉ dưỡng và du khách tìm kiếm sự riêng tư tuyệt đối.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <Button
              variant="gold"
              size="lg"
              iconAfter="arrow-right"
              as="a"
              href="#units"
            >
              Xem Bộ Sưu Tập Căn Hộ
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleOpenInquiry()}
              className="bg-black/40 text-white border-white/40 hover:border-[var(--gold-500)] hover:text-[var(--gold-500)]"
              icon="message-circle"
            >
              Liên Hệ Báo Giá Trực Tiếp
            </Button>
          </div>
        </div>
      </section>

      {/* ── 2. STATS & TRUST BAR ───────────────────────────── */}
      <section className="bg-[var(--surface-raised)] border-y border-[var(--hairline)] py-6 sm:py-8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col gap-1 border-r border-[var(--hairline)] pr-4">
            <span className="font-display text-2xl sm:text-3xl text-[var(--jade-700)] font-normal">
              5 Căn Hộ
            </span>
            <span className="font-sans text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Vinhomes Central Park
            </span>
          </div>

          <div className="flex flex-col gap-1 border-r border-[var(--hairline)] pr-4">
            <span className="font-display text-2xl sm:text-3xl text-[var(--jade-700)] font-normal">
              1 - 3 Phòng Ngủ
            </span>
            <span className="font-sans text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
              54 m² Đến 140 m² Duplex
            </span>
          </div>

          <div className="flex flex-col gap-1 border-r border-[var(--hairline)] pr-4">
            <span className="font-display text-2xl sm:text-3xl text-[var(--jade-700)] font-normal">
              Từ 28 - 65 Triệu
            </span>
            <span className="font-sans text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Thuê Tháng Bao Phí / Thuê Đêm
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-display text-2xl sm:text-3xl text-[var(--jade-700)] font-normal">
              24/7
            </span>
            <span className="font-sans text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Hỗ Trợ Khách & Thủ Tục Tạm Trú
            </span>
          </div>
        </div>
      </section>

      {/* ── 3. UNITS COLLECTION SECTION ────────────────────── */}
      <section id="units" className="py-16 sm:py-24 max-w-[1360px] mx-auto px-4 sm:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[var(--hairline)]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-px bg-[var(--gold-700)]" />
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-900)]">
                Bộ Sưu Tập Căn Hộ Vận Hành
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[var(--ink-900)]">
              Chọn Không Gian Trú Ẩn Của Bạn
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[var(--surface-raised)] border border-[var(--hairline-strong)]">
            {[
              { label: "Tất Cả (5 Căn)", value: "all" },
              { label: "1 Phòng Ngủ", value: 1 },
              { label: "2 Phòng Ngủ", value: 2 },
              { label: "3 Phòng Ngủ", value: 3 },
            ].map((tab) => (
              <button
                key={String(tab.value)}
                type="button"
                onClick={() => setSelectedBedroom(tab.value as number | "all")}
                className={`px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer ${
                  selectedBedroom === tab.value
                    ? "bg-[var(--jade-700)] text-white"
                    : "text-[var(--text-muted)] hover:text-[var(--ink-900)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Units Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {filteredUnits.map((unit) => (
            <UnitCard
              key={unit.id}
              unit={unit}
              onInquire={(code) => handleOpenInquiry(code)}
            />
          ))}
        </div>
      </section>

      {/* ── 4. LOCATION & VINHOMES CENTRAL PARK ─────────────── */}
      <section id="location" className="py-16 sm:py-24 bg-[var(--surface)] border-y border-[var(--hairline)]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Visual Plate */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] w-full bg-[var(--jade-900)] overflow-hidden shadow-xl border border-[var(--hairline)]">
                <Image
                  src="/assets/photos/landmark-81-balcony.jpg"
                  alt="Landmark 81 nhìn từ căn hộ Gao Ji House"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 hidden sm:block p-6 bg-[var(--canvas-warm)] border border-[var(--gold-700)] shadow-lg max-w-xs">
                <span className="font-sans text-xs uppercase tracking-[0.15em] text-[var(--gold-900)] font-semibold block mb-1">
                  Đặc Quyền Vị Trí
                </span>
                <p className="font-display text-base text-[var(--jade-700)]">
                  Bước chân xuống sảnh là công viên bờ sông 14ha và Vincom Landmark 81.
                </p>
              </div>
            </div>

            {/* Right Column: Highlights */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-px bg-[var(--gold-700)]" />
                  <span className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-900)]">
                    Vị Trí Kim Cương
                  </span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-normal text-[var(--ink-900)] leading-tight">
                  Tâm Điểm Thịnh Vượng Bên Bờ Sông Sài Gòn
                </h2>
              </div>

              <p className="font-sans text-base text-[var(--text-body)] leading-relaxed">
                Tọa lạc tại khu đô thị đáng sống bậc nhất TP. Hồ Chí Minh, Gao Ji House mang đến sự tiện lợi vượt trội cho cả nhu cầu công tác lẫn nghỉ dưỡng cao cấp:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-[var(--surface-raised)] border border-[var(--hairline)]">
                  <div className="flex items-center gap-2 text-[var(--jade-700)] mb-1">
                    <Icon name="building" size={18} />
                    <span className="font-sans font-semibold text-sm">Landmark 81 (2 Phút)</span>
                  </div>
                  <p className="font-sans text-xs text-[var(--text-muted)] leading-normal">
                    Trung tâm mua sắm Vincom, rạp CGV, sân băng, nhà hàng ẩm thực Á - Âu.
                  </p>
                </div>

                <div className="p-4 bg-[var(--surface-raised)] border border-[var(--hairline)]">
                  <div className="flex items-center gap-2 text-[var(--jade-700)] mb-1">
                    <Icon name="sparkles" size={18} />
                    <span className="font-sans font-semibold text-sm">Công Viên 14ha (50m)</span>
                  </div>
                  <p className="font-sans text-xs text-[var(--text-muted)] leading-normal">
                    Quảng trường xanh ven sông, hồ cá Koi phong cách Nhật, đường chạy bộ rợp bóng cây.
                  </p>
                </div>

                <div className="p-4 bg-[var(--surface-raised)] border border-[var(--hairline)]">
                  <div className="flex items-center gap-2 text-[var(--jade-700)] mb-1">
                    <Icon name="sparkles" size={18} />
                    <span className="font-sans font-semibold text-sm">Bến Du Thuyền</span>
                  </div>
                  <p className="font-sans text-xs text-[var(--text-muted)] leading-normal">
                    Bến thuyền Marina tiêu chuẩn quốc tế, tour du ngoạn ngắm hoàng hôn sông Sài Gòn.
                  </p>
                </div>

                <div className="p-4 bg-[var(--surface-raised)] border border-[var(--hairline)]">
                  <div className="flex items-center gap-2 text-[var(--jade-700)] mb-1">
                    <Icon name="shield-check" size={18} />
                    <span className="font-sans font-semibold text-sm">An Ninh 24/7 & Y Tế</span>
                  </div>
                  <p className="font-sans text-xs text-[var(--text-muted)] leading-normal">
                    Bệnh viện quốc tế Vinmec, hệ thống camera và bảo vệ tuần tra khép kín 24/24.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. SERVICES & HOSPITALITY ───────────────────────── */}
      <section id="services" className="py-16 sm:py-24 max-w-[1360px] mx-auto px-4 sm:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-6 h-px bg-[var(--gold-700)]" />
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-900)]">
              Dịch Vụ & Tiện Ích Bổ Sung
            </span>
            <span className="w-6 h-px bg-[var(--gold-700)]" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-normal text-[var(--ink-900)]">
            Chu Đáo Như Ở Nhà, Tiện Nghi Như Khách Sạn
          </h2>
          <p className="font-sans text-base text-[var(--text-muted)] mt-3">
            Đội ngũ quản lý căn hộ Gao Ji House hỗ trợ tận tâm mọi nhu cầu di chuyển, sinh hoạt và trải nghiệm của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="p-6 bg-[var(--surface-raised)] border border-[var(--hairline-strong)] hover:border-[var(--gold-700)] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 flex items-center justify-center bg-[var(--gold-100)] text-[var(--gold-900)] mb-4">
                  <Icon name={svc.icon || "sparkles"} size={20} />
                </div>
                <span className="font-sans text-[0.6875rem] uppercase tracking-[0.12em] text-[var(--text-muted)] font-semibold block">
                  {svc.category}
                </span>
                <h3 className="font-display text-lg font-medium text-[var(--ink-900)] mt-1 mb-2">
                  {svc.name}
                </h3>
                <p className="font-sans text-xs text-[var(--text-body)] leading-relaxed">
                  {svc.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--hairline)] flex items-center justify-between">
                <span className="font-sans text-xs font-semibold text-[var(--jade-700)]">
                  {Number(svc.price) === 0 ? "Hỗ Trợ Miễn Phí" : `${formatVnd(Number(svc.price))} / ${svc.price_unit}`}
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenInquiry()}
                  className="font-sans text-[0.6875rem] uppercase tracking-[0.12em] text-[var(--gold-900)] hover:underline font-semibold cursor-pointer"
                >
                  Đăng Ký →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. FLOATING CONTACT RAIL & INQUIRY MODAL ────────── */}
      <ContactRail
        zalo="https://zalo.me/0889237833"
        phone="0889237833"
        email="stay@gaojihouse.vn"
        onInquire={() => handleOpenInquiry()}
      />

      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        initialUnitCode={selectedUnitCode}
      />
    </div>
  );
}
