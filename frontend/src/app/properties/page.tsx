"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  ContactRail,
  FilterTabs,
  Icon,
  InquiryModal,
  SectionHeader,
  UnitCard,
} from "@/components/gaoji";
import { fetchProperties, type Property } from "@/lib/api";

export default function PropertiesPage() {
  const [units, setUnits] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBedroom, setSelectedBedroom] = useState<string | number>("all");
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedUnitCode, setSelectedUnitCode] = useState<string>("");

  useEffect(() => {
    fetchProperties().then((data) => setUnits(data));
  }, []);

  const handleOpenInquiry = (code?: string) => {
    setSelectedUnitCode(code || "");
    setInquiryOpen(true);
  };

  const filteredUnits = units.filter((u) => {
    const matchBed =
      selectedBedroom === "all" ? true : u.bedrooms === Number(selectedBedroom);
    const matchQuery =
      searchQuery.trim() === ""
        ? true
        : (u.name + " " + (u.unit_code || "") + " " + (u.tower || "") + " " + (u.description || ""))
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
    return matchBed && matchQuery;
  });

  return (
    <main className="min-h-screen bg-[var(--canvas,#F9F7F2)] text-[var(--text-primary,#1A1A1A)] py-12 sm:py-16 px-4 sm:px-8 lg:px-12">
      <div className="max-w-[1600px] mx-auto">
        <SectionHeader
          eyebrow="BẢNG GIÁ THUÊ & MẶT BẰNG CĂN HỘ · VINHOMES CENTRAL PARK"
          title="Bộ Sưu Tập Căn Hộ Dịch Vụ"
          aside="Cho thuê theo tháng (đã bao gồm toàn bộ phí quản lý toà nhà), theo tuần và theo đêm. Liên hệ quản lý căn hộ để xem nhà trực tiếp 24/7."
        />

        {/* Toolbar */}
        <div className="mt-8 p-4 bg-[var(--surface-raised)] border border-[var(--hairline)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo mã căn, toà Landmark, view sông..."
              className="w-full h-11 px-4 bg-[var(--surface-sunken)] border border-[var(--hairline-strong)] text-sm font-sans rounded-none focus:outline-2 focus:outline-[var(--gold-500)]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <FilterTabs
              tabs={[
                { label: "Tất Cả (5 Căn)", value: "all" },
                { label: "1 Phòng Ngủ", value: 1 },
                { label: "2 Phòng Ngủ", value: 2 },
                { label: "3 Phòng Ngủ", value: 3 },
              ]}
              value={selectedBedroom}
              onChange={(val) => setSelectedBedroom(val)}
            />

            <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[var(--gold-900)] ml-auto md:ml-2">
              {filteredUnits.length} Căn Hộ
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
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
            <Icon name="search" size={36} color="var(--gold-700)" />
            <h3 className="font-display text-2xl text-[var(--ink-900)]">
              Không tìm thấy căn hộ phù hợp với từ khoá
            </h3>
            <div className="flex gap-3 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedBedroom("all");
                }}
              >
                Xoá Bộ Lọc
              </Button>
              <Button
                variant="gold"
                size="sm"
                onClick={() => handleOpenInquiry()}
              >
                Liên Hệ Quản Lý
              </Button>
            </div>
          </div>
        )}
      </div>

      <ContactRail onInquire={() => handleOpenInquiry()} />

      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        initialUnitCode={selectedUnitCode}
      />
    </main>
  );
}
