"use client";

import React, { useEffect, useState } from "react";
import { ContactRail } from "@/components/gaoji/ContactRail";
import { InquiryModal } from "@/components/gaoji/InquiryModal";
import { UnitCard } from "@/components/gaoji/UnitCard";
import { fetchProperties, type Property } from "@/lib/api";

export default function PropertiesPage() {
  const [units, setUnits] = useState<Property[]>([]);
  const [selectedBedroom, setSelectedBedroom] = useState<number | "all">("all");
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
    if (selectedBedroom === "all") return true;
    return u.bedrooms === selectedBedroom;
  });

  return (
    <main className="min-h-screen bg-[var(--canvas)] text-[var(--text-primary)] py-12">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[var(--hairline)]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-px bg-[var(--gold-700)]" />
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-900)]">
                Vinhomes Central Park · Gao Ji House
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[var(--ink-900)]">
              Danh Sách Căn Hộ Dịch Vụ
            </h1>
            <p className="font-sans text-sm sm:text-base text-[var(--text-muted)] mt-2">
              Cho thuê theo tháng (bao phí quản lý), theo tuần và theo đêm. Liên hệ quản lý căn hộ để xem nhà trực tiếp.
            </p>
          </div>

          {/* Filter tabs */}
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
      </div>

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
    </main>
  );
}
