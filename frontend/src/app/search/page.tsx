"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  ContactRail,
  Icon,
  InquiryModal,
  UnitCard,
} from "@/components/gaoji";
import { fetchProperties, type Property } from "@/lib/api";

type SortOption = "default" | "price-asc" | "price-desc" | "sqm";

export default function SearchPage() {
  const [units, setUnits] = useState<Property[]>([]);
  const [query, setQuery] = useState("");
  const [checkin, setCheckin] = useState("");
  const [guests, setGuests] = useState("0");
  const [bedroom, setBedroom] = useState<string | number>("all");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedUnitCode, setSelectedUnitCode] = useState("");

  useEffect(() => {
    fetchProperties().then((data) => setUnits(data));
  }, []);

  const handleOpenInquiry = (code?: string) => {
    setSelectedUnitCode(code || "");
    setInquiryOpen(true);
  };

  // Filter & Sort
  const filteredUnits = units
    .filter((u) => {
      const matchBed = bedroom === "all" ? true : u.bedrooms === Number(bedroom);
      const matchGuests =
        guests === "0" ? true : (u.max_guests || 4) >= Number(guests);
      const matchQuery =
        query.trim() === ""
          ? true
          : (u.name + " " + (u.unit_code || "") + " " + (u.tower || "") + " " + (u.description || "") + " " + (u.view_type || ""))
              .toLowerCase()
              .includes(query.toLowerCase());
      return matchBed && matchGuests && matchQuery;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") {
        return (Number(a.price_monthly) || 0) - (Number(b.price_monthly) || 0);
      }
      if (sortBy === "price-desc") {
        return (Number(b.price_monthly) || 0) - (Number(a.price_monthly) || 0);
      }
      if (sortBy === "sqm") {
        return (b.sqm || 0) - (a.sqm || 0);
      }
      return 0;
    });

  return (
    <main className="min-h-screen bg-[var(--canvas,#F9F7F2)] text-[var(--text-primary,#1A1A1A)] pb-24">
      {/* ── SEARCH BANNER (JADE-700) ────────────────────────── */}
      <section className="bg-[var(--jade-700)] text-[var(--text-inverse)] border-b border-[var(--gold-700)] py-12 sm:py-16 px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-px bg-[var(--gold-700)]" />
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold-050)]">
              Tìm Căn Hộ Dịch Vụ · Vinhomes Central Park
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-normal uppercase leading-tight tracking-tight text-[var(--text-inverse)]">
            Tìm Căn Hộ Phù Hợp
          </h1>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end"
          >
            <label className="lg:col-span-4 flex flex-col gap-2">
              <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[var(--gold-050)]">
                Từ Khoá Tìm Kiếm
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Mã căn, toà Landmark, view sông, duplex..."
                className="w-full h-12 px-4 bg-[var(--jade-900)] border border-[var(--gold-700)] text-[var(--text-inverse)] font-sans text-sm rounded-none focus:outline-2 focus:outline-[var(--gold-500)]"
              />
            </label>

            <label className="lg:col-span-3 flex flex-col gap-2">
              <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[var(--gold-050)]">
                Ngày Nhận Phòng
              </span>
              <input
                type="date"
                value={checkin}
                onChange={(e) => setCheckin(e.target.value)}
                className="w-full h-12 px-4 bg-[var(--jade-900)] border border-[var(--gold-700)] text-[var(--text-inverse)] font-sans text-sm rounded-none focus:outline-2 focus:outline-[var(--gold-500)]"
              />
            </label>

            <label className="lg:col-span-2 flex flex-col gap-2">
              <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[var(--gold-050)]">
                Số Lượng Khách
              </span>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full h-12 px-4 bg-[var(--jade-900)] border border-[var(--gold-700)] text-[var(--text-inverse)] font-sans text-sm rounded-none focus:outline-2 focus:outline-[var(--gold-500)]"
              >
                <option value="0">Bất Kỳ</option>
                <option value="1">1 Khách</option>
                <option value="2">2 Khách</option>
                <option value="3">3 Khách</option>
                <option value="4">4+ Khách</option>
              </select>
            </label>

            <label className="lg:col-span-2 flex flex-col gap-2">
              <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[var(--gold-050)]">
                Số Phòng Ngủ
              </span>
              <select
                value={bedroom}
                onChange={(e) => setBedroom(e.target.value)}
                className="w-full h-12 px-4 bg-[var(--jade-900)] border border-[var(--gold-700)] text-[var(--text-inverse)] font-sans text-sm rounded-none focus:outline-2 focus:outline-[var(--gold-500)]"
              >
                <option value="all">Tất Cả Loại Phòng</option>
                <option value="1">1 Phòng Ngủ</option>
                <option value="2">2 Phòng Ngủ</option>
                <option value="3">3 Phòng Ngủ</option>
              </select>
            </label>

            <div className="lg:col-span-1">
              <Button
                variant="gold"
                size="md"
                full
                onClick={() => {}}
                style={{ height: 48 }}
              >
                Lọc
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* ── RESULTS TOOLBAR & GRID ──────────────────────────── */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 mt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--hairline)]">
          <div className="flex items-center gap-2">
            <span className="font-sans text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
              Kết Quả:
            </span>
            <span className="font-display text-xl text-[var(--jade-700)]">
              {filteredUnits.length} Căn Hộ
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-sans text-xs uppercase tracking-wider text-[var(--text-muted)]">
              Sắp Xếp:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-9 px-3 bg-[var(--surface-raised)] border border-[var(--hairline-strong)] text-xs font-sans rounded-none"
            >
              <option value="default">Mặc Định</option>
              <option value="price-asc">Giá Thuê Tăng Dần</option>
              <option value="price-desc">Giá Thuê Giảm Dần</option>
              <option value="sqm">Diện Tích Lớn Nhất</option>
            </select>
          </div>
        </div>

        {/* Units Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {filteredUnits.map((unit) => (
            <UnitCard
              key={unit.id}
              unit={unit}
              onInquire={(code) => handleOpenInquiry(code)}
            />
          ))}
        </div>

        {/* Empty state */}
        {filteredUnits.length === 0 && (
          <div className="mt-12 p-12 bg-[var(--surface-raised)] border border-[var(--hairline)] text-center grid gap-4 justify-items-center">
            <Icon name="search" size={40} color="var(--gold-700)" />
            <h3 className="font-display text-2xl text-[var(--ink-900)]">
              Không tìm thấy căn hộ thoả mãn điều kiện
            </h3>
            <p className="font-sans text-sm text-[var(--text-muted)] max-w-md">
              Hãy thử nới lỏng các tiêu chí tìm kiếm hoặc nhắn tin trực tiếp qua Zalo để kiểm tra căn hộ sắp trống.
            </p>
            <div className="flex gap-3 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setGuests("0");
                  setBedroom("all");
                }}
              >
                Đặt Lại Tiêu Chí
              </Button>
              <Button
                variant="gold"
                size="sm"
                onClick={() => handleOpenInquiry()}
              >
                Chat Zalo Với Quản Lý
              </Button>
            </div>
          </div>
        )}
      </section>

      <ContactRail onInquire={() => handleOpenInquiry()} />

      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        initialUnitCode={selectedUnitCode}
      />
    </main>
  );
}
