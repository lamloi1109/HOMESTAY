"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { type Property } from "@/lib/api";
import { formatVnd } from "@/lib/format";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Icon } from "./Icon";

export interface UnitCardProps {
  unit: Property;
  onInquire?: (unitCode: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function UnitCard({ unit, onInquire, className = "", style }: UnitCardProps) {
  const photo = unit.cover_image || "/assets/photos/living-open-plan.jpg";
  const monthlyPrice = unit.price_monthly ? Number(unit.price_monthly) : null;
  const nightlyPrice = unit.price_nightly ? Number(unit.price_nightly) : null;

  return (
    <article
      className={`group relative flex flex-col bg-[var(--surface-raised)] border border-[var(--hairline-strong)] hover:border-[var(--gold-700)] transition-all duration-300 rounded-none shadow-sm hover:shadow-md ${className}`.trim()}
      style={style}
    >
      {/* Image container with 0px radius and 800ms smooth zoom */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--jade-900)]">
        <Image
          src={photo}
          alt={unit.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Subtle overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Unit Code Tag */}
        <div className="absolute top-3 left-3 z-10">
          <Badge tone="gold" variant="solid">
            {unit.unit_code || unit.name}
          </Badge>
        </div>

        {/* Tower & Floor Badge */}
        {unit.tower && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-1 bg-black/60 backdrop-blur-xs text-[var(--paper-150)] font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em]">
              {unit.tower} {unit.floor ? `· Tầng ${unit.floor}` : ""}
            </span>
          </div>
        )}

        {/* View overlay */}
        {unit.view_type && (
          <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center gap-1.5 text-white/95 font-sans text-xs">
            <Icon name="eye" size={13} color="var(--gold-500)" />
            <span className="truncate">{unit.view_type}</span>
          </div>
        )}
      </div>

      {/* Body content */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 gap-4">
        <div className="grid gap-2.5">
          <h3 className="font-display text-xl sm:text-2xl font-normal text-[var(--ink-900)] leading-snug group-hover:text-[var(--jade-700)] transition-colors">
            <Link href={`/properties/${unit.id || unit.slug}`}>
              {unit.name}
            </Link>
          </h3>

          {/* Specs bar */}
          <div className="flex flex-wrap items-center gap-3 py-2 border-y border-[var(--hairline)] font-sans text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <Icon name="bed" size={14} color="var(--gold-900)" />
              <strong>{unit.bedrooms || 2}</strong> PN
            </span>
            <span className="text-[var(--hairline-strong)]">|</span>
            <span className="flex items-center gap-1">
              <Icon name="bath" size={14} color="var(--gold-900)" />
              <strong>{unit.bathrooms || 2}</strong> WC
            </span>
            <span className="text-[var(--hairline-strong)]">|</span>
            <span className="flex items-center gap-1">
              <Icon name="maximize-2" size={13} color="var(--gold-900)" />
              <strong>{unit.sqm || 82}</strong> m²
            </span>
            <span className="text-[var(--hairline-strong)]">|</span>
            <span className="flex items-center gap-1">
              <Icon name="users" size={14} color="var(--gold-900)" />
              Tối đa <strong>{unit.max_guests || 4}</strong> khách
            </span>
          </div>

          <p className="font-sans text-sm text-[var(--text-body)] line-clamp-2 leading-relaxed mt-1">
            {unit.description}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-2 flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <span className="font-sans text-[0.6875rem] uppercase tracking-[0.12em] text-[var(--text-muted)] block">
                Thuê Tháng (Bao Phí)
              </span>
              {monthlyPrice ? (
                <span className="font-display text-xl sm:text-2xl font-medium text-[var(--jade-700)]">
                  {formatVnd(monthlyPrice)}
                  <span className="font-sans text-xs text-[var(--text-muted)] font-normal"> / tháng</span>
                </span>
              ) : (
                <span className="font-sans text-sm text-[var(--text-muted)]">Liên hệ</span>
              )}
            </div>

            {nightlyPrice && (
              <div className="text-right">
                <span className="font-sans text-[0.6875rem] uppercase tracking-[0.12em] text-[var(--text-muted)] block">
                  Thuê Ngắn Hạn
                </span>
                <span className="font-sans text-sm font-semibold text-[var(--gold-900)]">
                  {formatVnd(nightlyPrice)}
                  <span className="text-xs text-[var(--text-muted)] font-normal"> / đêm</span>
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              as="a"
              href={`/properties/${unit.id || unit.slug}`}
              className="text-center"
            >
              Xem Căn Hộ
            </Button>
            <Button
              variant="gold"
              size="sm"
              onClick={() => onInquire?.(unit.unit_code || unit.name)}
            >
              Hỏi Giá / Đặt
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default UnitCard;
