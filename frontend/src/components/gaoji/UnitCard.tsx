"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Icon } from "./Icon";
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
    available?: string;
    held?: string;
    unitCode?: string;
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
    available: "Còn Phòng",
    held: "Nhận Chờ",
    unitCode: "Mã căn",
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
      className={`block h-full rounded-[14px] text-inherit no-underline outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-700)] focus-visible:ring-offset-2 ${className}`.trim()}
      style={style}
    >
      <article
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="flex h-full flex-col overflow-hidden rounded-[14px] border border-[var(--hairline)] bg-[var(--surface-raised)] transition-[color,border-color,box-shadow] duration-200 hover:border-[var(--gold-700)] hover:shadow-[0_16px_42px_rgba(27,46,37,0.12)]"
      >
      {/* Photography remains the card's strongest sales signal. */}
      <div className="relative aspect-[5/4] overflow-hidden bg-[var(--surface-sunken)]">
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

        {/* Status is intentionally quiet; the photo stays dominant. */}
        <span
          className={`absolute right-3 top-3 z-10 inline-flex min-h-7 items-center gap-1.5 rounded-full border px-2.5 font-sans text-[0.65rem] font-semibold ${
            isAvailable
              ? "border-[#A7D4AF] bg-[#DDF3DF] text-[#165B2B]"
              : "border-[var(--gold-700)] bg-[var(--gold-100)] text-[var(--gold-900)]"
          }`}
        >
          <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
          {isAvailable ? t.available : t.held}
        </span>
      </div>

      {/* Details Header */}
      <div className="px-4 pt-4 sm:px-5 sm:pt-5">
        {unit.view_type && (
          <span className="font-sans text-[0.625rem] font-semibold tracking-[0.15em] uppercase text-[var(--gold-900)] block">
            {unit.view_type}
          </span>
        )}
        <h3
          className="mt-2 min-h-[2.7em] text-balance font-display text-[1.45rem] font-medium leading-[1.16] transition-colors sm:text-[1.6rem]"
          style={{ color: hover ? "var(--gold-900)" : "var(--text-primary)" }}
        >
          {unit.name}
        </h3>
        {floorText && (
          <div className="mt-3 flex items-start gap-1.5 font-sans text-[0.78rem] leading-[1.35] text-[var(--text-body)]">
            <Icon name="map-pin" size={14} color="var(--gold-900)" className="mt-0.5 shrink-0" />
            <span>{floorText}</span>
          </div>
        )}
        {unit.unit_code && (
          <p className="mt-1 font-sans text-[0.68rem] text-[var(--text-muted)]">
            {t.unitCode} {unit.unit_code}
          </p>
        )}
      </div>

      {/* Room Specs Strip */}
      <div className="mx-4 mt-4 border-t border-[var(--hairline)] py-3 sm:mx-5">
        <RoomSpecs
          beds={unit.bedrooms}
          baths={unit.bathrooms}
          sqm={unit.sqm}
          variant="plain"
        />
      </div>

      {/* Price is the final visual anchor; the entire card is the detail link. */}
      <div className="mx-4 mb-4 mt-auto grid min-h-[88px] content-center rounded-[9px] bg-[var(--jade-100)] px-4 py-3 sm:mx-5 sm:mb-5">
        <div className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">
          {t.rate}
        </div>
        <div
          className={`mt-1 min-h-[2rem] text-pretty font-display font-medium leading-[1.15] text-[var(--jade-700)] ${
            !displayRate || displayRate.type === "negotiable"
              ? "text-[1.3rem] italic"
              : displayRate.type === "range"
                ? "text-[1.45rem] sm:text-[1.6rem]"
                : "text-[1.5rem]"
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
