"use client";

import React, { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";

export interface StayQueryBarProps {
  onSubmit?: (params: {
    intent: string;
    unitType: string;
    checkin: string;
    guests: string;
  }) => void;
  labels?: {
    intent?: string;
    unit?: string;
    checkin?: string;
    guests?: string;
    submit?: string;
  };
  unitTypes?: string[];
  className?: string;
  style?: React.CSSProperties;
}

/**
 * StayQueryBar — The availability bar docked under the hero.
 * Jade band, gold hairline top, four fields + one gold CTA.
 */
export function StayQueryBar({
  onSubmit,
  labels = {},
  unitTypes = ["Tất Cả Loại Căn", "1 Phòng Ngủ", "2 Phòng Ngủ", "3 Phòng Ngủ"],
  className = "",
  style,
}: StayQueryBarProps) {
  const [intent, setIntent] = useState("Lưu Trú Dài Hạn");
  const [unitType, setUnitType] = useState(unitTypes[0] || "");
  const [checkin, setCheckin] = useState("");
  const [guests, setGuests] = useState("1 - 2 Khách");

  const t = {
    intent: "Nhu Cầu Lưu Trú",
    unit: "Loại Căn Hộ",
    checkin: "Ngày Nhận Phòng",
    guests: "Số Khách",
    submit: "Kiểm Tra Phòng Trống",
    ...labels,
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSubmit?.({ intent, unitType, checkin, guests });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end p-6 sm:p-7 bg-[var(--jade-700)] border-t border-[var(--gold-700)] shadow-2xl ${className}`.trim()}
      style={style}
    >
      <Select
        onDark
        label={t.intent}
        value={intent}
        onChange={(e) => setIntent(e.target.value)}
        options={["Lưu Trú Dài Hạn (Tháng)", "Lưu Trú Ngắn Ngày (Đêm)", "Công Tác / Doanh Nghiệp"]}
      />

      <Select
        onDark
        label={t.unit}
        value={unitType}
        onChange={(e) => setUnitType(e.target.value)}
        options={unitTypes}
      />

      <Input
        onDark
        label={t.checkin}
        type="date"
        value={checkin}
        onChange={(e) => setCheckin(e.target.value)}
      />

      <Select
        onDark
        label={t.guests}
        value={guests}
        onChange={(e) => setGuests(e.target.value)}
        options={["1 - 2 Khách", "3 - 4 Khách", "5+ Khách"]}
      />

      <Button
        variant="gold"
        type="submit"
        iconAfter="arrow-right"
        full
        style={{ minHeight: 46 }}
      >
        {t.submit}
      </Button>
    </form>
  );
}

export default StayQueryBar;
