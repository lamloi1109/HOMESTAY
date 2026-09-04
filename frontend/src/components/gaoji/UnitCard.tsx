"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { RoomSpecs } from "./RoomSpecs";

export interface UnitCardItem {
  id: string;
  name: string;
  unit_code?: string | null;
  floor?: string | number | null;
  tower?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  sqm?: number | null;
  guests?: number | null;
  price_monthly?: number | string | null;
  price_nightly?: number | string | null;
  status?: string | null;
  cover_image?: string | null;
  view_type?: string | null;
  description?: string | null;
  slug?: string | null;
}

export interface UnitCardProps {
  unit: UnitCardItem;
  onInquire?: (unitCode: string) => void;
  onView?: (unitCode: string) => void;
  labels?: {
    view?: string;
    inquire?: string;
    month?: string;
    night?: string;
  };
  className?: string;
  style?: React.CSSProperties;
}

const formatPriceVnd = (n: number) => {
  if (n >= 1e6) {
    return (n / 1e6).toLocaleString("vi-VN", { maximumFractionDigits: 1 }) + " Triệu VNĐ";
  }
  return n.toLocaleString("vi-VN") + " VNĐ";
};

export function UnitCard({
  unit,
  onInquire,
  onView,
  labels = {},
  className = "",
  style,
}: UnitCardProps) {
  const [hover, setHover] = useState(false);

  const t = {
    view: "Xem Chi Tiết Căn Hộ",
    inquire: "Đặt Phòng / Hỏi Giá",
    month: "Giá Thuê Tháng",
    night: "Giá Theo Đêm",
    ...labels,
  };

  const photo = unit.cover_image || "/assets/photos/living-open-plan.jpg";
  const monthlyRateVnd = unit.price_monthly ? Number(unit.price_monthly) : null;
  const nightlyRateVnd = unit.price_nightly ? Number(unit.price_nightly) : null;
  const isAvailable = unit.status === "available" || !unit.status;

  const floorText = unit.floor
    ? `Tầng ${unit.floor} · ${unit.tower || "Landmark"} · Vinhomes Central Park`
    : unit.tower
    ? `${unit.tower} · Vinhomes Central Park`
    : null;

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`flex flex-col bg-[var(--surface-raised)] border border-[var(--hairline)] rounded-none transition-colors duration-200 ${className}`.trim()}
      style={style}
    >
      {/* 4:3 Aspect Ratio Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface-sunken)]">
        <Image
          src={photo}
          alt={unit.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out"
          style={{
            transform: hover ? "scale(1.04)" : "scale(1)",
          }}
        />

        {/* Top-Left Code Badge */}
        <span className="absolute top-3 left-3 z-10">
          <Badge tone="paper">
            {unit.unit_code || unit.name}
          </Badge>
        </span>

        {/* Top-Right Status Badge */}
        <span className="absolute top-3 right-3 z-10">
          <Badge
            tone={isAvailable ? "available" : "held"}
            icon={isAvailable ? "badge-check" : "calendar-check"}
          >
            {isAvailable ? "Còn Phòng" : "Đã Giữ Chỗ · Nhận Chờ"}
          </Badge>
        </span>
      </div>

      {/* Details Header */}
      <div className="p-4 sm:p-5 pb-0">
        {unit.view_type && (
          <span className="font-sans text-[0.625rem] font-semibold tracking-[0.15em] uppercase text-[var(--gold-900)] block">
            {unit.view_type}
          </span>
        )}
        <h3
          className="mt-1.5 font-display text-[1.33rem] sm:text-[1.45rem] font-medium leading-[1.25] transition-colors"
          style={{ color: hover ? "var(--gold-900)" : "var(--text-primary)" }}
        >
          {unit.name}
        </h3>
        {floorText && (
          <p className="mt-1.5 font-serif italic text-[0.875rem] text-[var(--text-muted)]">
            {floorText}
          </p>
        )}
      </div>

      {/* Room Specs Strip */}
      <div className="my-4 py-2 border-y border-[var(--hairline)]">
        <RoomSpecs
          beds={unit.bedrooms}
          baths={unit.bathrooms}
          sqm={unit.sqm}
          guests={unit.guests}
        />
      </div>

      {/* Pricing Columns */}
      <div className="px-4 sm:px-5 flex flex-wrap gap-4 sm:gap-6">
        {monthlyRateVnd ? (
          <div>
            <div className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">
              {t.month}
            </div>
            <div className="font-display text-[1.35rem] font-medium text-[var(--jade-700)]">
              {formatPriceVnd(monthlyRateVnd)}
            </div>
          </div>
        ) : null}

        {nightlyRateVnd ? (
          <div>
            <div className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">
              {t.night}
            </div>
            <div className="font-display text-[1.35rem] font-medium text-[var(--jade-700)]">
              {formatPriceVnd(nightlyRateVnd)}
            </div>
          </div>
        ) : null}
      </div>

      {/* Action Buttons Stack */}
      <div className="mt-auto p-4 sm:p-5 pt-5 grid gap-2">
        <Button
          variant="jade"
          size="sm"
          full
          iconAfter="arrow-right"
          as={Link}
          href={`/properties/${unit.id || unit.slug || unit.unit_code}`}
          onClick={() => onView?.(unit.unit_code || unit.name)}
        >
          {t.view}
        </Button>
        <Button
          variant="outline"
          size="sm"
          full
          onClick={() => onInquire?.(unit.unit_code || unit.name)}
        >
          {t.inquire}
        </Button>
      </div>
    </article>
  );
}

export default UnitCard;
