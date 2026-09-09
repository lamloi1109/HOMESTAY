"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Badge } from "./Badge";
import { RoomSpecs } from "./RoomSpecs";

export type UnitRate =
  | { type: "fixed"; amount: number | string }
  | { type: "range"; min: number | string; max: number | string }
  | { type: "negotiable"; label?: string };

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
  rate?: UnitRate | null;
  monthly_rate?: UnitRate | null;
  nightly_rate?: UnitRate | null;
  status?: string | null;
  cover_image?: string | null;
  view_type?: string | null;
  description?: string | null;
  slug?: string | null;
}

export interface UnitCardProps {
  unit: UnitCardItem;
  onView?: (unitCode: string) => void;
  labels?: {
    rate?: string;
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

const legacyRate = (value: number | string | null | undefined): UnitRate | null => {
  if (value === null || value === undefined || value === "") return null;
  const amount = Number(value);
  return Number.isFinite(amount) ? { type: "fixed", amount } : null;
};

const rateText = (rate: UnitRate) => {
  if (rate.type === "negotiable") return rate.label || "Thương Lượng";
  if (rate.type === "range") {
    const min = Number(rate.min);
    const max = Number(rate.max);
    if (!Number.isFinite(min) || !Number.isFinite(max)) return "Thương Lượng";
    if (min >= 1e6 && max >= 1e6) {
      const formatMillions = (value: number) =>
        (value / 1e6).toLocaleString("vi-VN", { maximumFractionDigits: 1 });
      return `${formatMillions(min)} – ${formatMillions(max)} Triệu VNĐ`;
    }
    return `${formatPriceVnd(min)} – ${formatPriceVnd(max)}`;
  }
  const amount = Number(rate.amount);
  return Number.isFinite(amount) ? formatPriceVnd(amount) : "Thương Lượng";
};

export function UnitCard({
  unit,
  onView,
  labels = {},
  className = "",
  style,
}: UnitCardProps) {
  const [hover, setHover] = useState(false);

  const t = {
    rate: "Khoảng Giá Thuê",
    ...labels,
  };

  const photo = unit.cover_image || "/assets/photos/living-open-plan.jpg";
  const displayRate = unit.rate || unit.monthly_rate || legacyRate(unit.price_monthly);
  const isAvailable = unit.status === "available" || !unit.status;

  const floorText = unit.floor
    ? `Tầng ${unit.floor} · ${unit.tower || "Landmark"} · Vinhomes Central Park`
    : unit.tower
    ? `${unit.tower} · Vinhomes Central Park`
    : null;

  const href = `/properties/${unit.id || unit.slug || unit.unit_code}`;

  return (
    <Link
      href={href}
      aria-label={`${unit.name} — ${t.rate}: ${displayRate ? rateText(displayRate) : "Thương Lượng"}`}
      onClick={() => onView?.(unit.unit_code || unit.name)}
      className={`block h-full text-inherit no-underline ${className}`.trim()}
      style={style}
    >
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex h-full flex-col bg-[var(--surface-raised)] border border-[var(--hairline)] rounded-none transition-[color,border-color,box-shadow] duration-200 hover:border-[var(--gold-700)] hover:shadow-[0_12px_36px_rgba(27,46,37,0.10)] focus-within:border-[var(--gold-700)]"
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

      {/* One calm pricing line; the entire card is the detail link. */}
      <div className="mx-4 mt-auto grid min-h-[92px] content-center border-t border-[var(--hairline)] py-4 sm:mx-5">
        <div className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">
          {t.rate}
        </div>
        <div
          className={`mt-1 min-h-[2rem] text-pretty font-display font-medium leading-[1.15] text-[var(--jade-700)] ${
            !displayRate || displayRate.type === "negotiable"
              ? "text-[1.18rem] italic"
              : displayRate.type === "range"
                ? "text-[1.25rem] sm:text-[1.35rem]"
                : "text-[1.35rem]"
          }`}
        >
          {displayRate ? rateText(displayRate) : "Thương Lượng"}
        </div>
      </div>
    </article>
    </Link>
  );
}

export default UnitCard;
