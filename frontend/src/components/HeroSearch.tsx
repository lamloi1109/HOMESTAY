"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/gaoji/Icon";
import { isoDate } from "@/lib/format";

/**
 * Panel tìm kiếm trong hero, theo thiết kế trang chủ Gaoji House.
 *
 * Thiết kế gốc có ba tab "Theo giờ / Qua đêm / Theo ngày". Backend hiện chỉ
 * tính giá theo đêm (`base_price` mỗi đêm, `booking_nights` mỗi đêm một dòng),
 * nên chỉ dựng luồng theo đêm. Muốn có đặt theo giờ thì phải đổi mô hình giá
 * và bảng đêm phòng ở backend trước.
 */
export function HeroSearch({ placeholder = "Bạn muốn đi đâu?" }: { placeholder?: string }) {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState(isoDate(1));
  const [checkOut, setCheckOut] = useState(isoDate(2));
  const [guests, setGuests] = useState(2);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city.trim()) params.set("city", city.trim());
    if (checkIn) params.set("in", checkIn);
    if (checkOut) params.set("out", checkOut);
    params.set("guests", String(guests));
    router.push(`/properties?${params.toString()}`);
  }

  const label: React.CSSProperties = {
    fontSize: 10.5,
    fontWeight: "var(--fw-bold)",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: ".1em",
    marginBottom: 3,
  };
  const field: React.CSSProperties = {
    padding: "14px 18px",
    borderRadius: "var(--radius-lg)",
    minWidth: 0,
  };
  const input: React.CSSProperties = {
    background: "none",
    border: "none",
    outline: "none",
    fontFamily: "var(--font-sans)",
    fontSize: 15,
    fontWeight: "var(--fw-medium)",
    color: "var(--text-primary)",
    width: "100%",
  };
  const stepper: React.CSSProperties = {
    width: 26,
    height: 26,
    borderRadius: "var(--radius-circle)",
    border: "1.5px solid var(--border-default)",
    background: "none",
    cursor: "pointer",
    color: "var(--text-secondary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
    flexShrink: 0,
  };

  return (
    <form
      onSubmit={submit}
      style={{
        background: "var(--surface-raised)",
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-clay)",
        padding: 10,
        maxWidth: 920,
      }}
    >
      <div className="flex flex-col items-stretch sm:flex-row">
        <label style={{ ...field, flex: 1.6 }}>
          <span style={label}>Địa điểm</span>
          <input
            style={input}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={placeholder}
            aria-label="Điểm đến"
          />
        </label>

        <Divider />

        <div style={{ ...field, flex: 1.4 }}>
          <span style={label}>Ngày nhận — Ngày trả</span>
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={checkIn}
              min={isoDate(0)}
              onChange={(e) => setCheckIn(e.target.value)}
              style={{ ...input, width: "auto" }}
              aria-label="Ngày nhận phòng"
            />
            <span style={{ color: "var(--text-muted)" }}>–</span>
            <input
              type="date"
              value={checkOut}
              min={checkIn}
              onChange={(e) => setCheckOut(e.target.value)}
              style={{ ...input, width: "auto" }}
              aria-label="Ngày trả phòng"
            />
          </div>
        </div>

        <Divider />

        <div style={{ ...field, flex: 1 }}>
          <span style={label}>Số khách</span>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              style={{ ...stepper, fontSize: 17 }}
              aria-label="Bớt một khách"
            >
              −
            </button>
            <span
              style={{ fontSize: 15, fontWeight: "var(--fw-medium)", color: "var(--text-primary)" }}
              aria-live="polite"
            >
              {guests} khách
            </span>
            <button
              type="button"
              onClick={() => setGuests((g) => Math.min(10, g + 1))}
              style={{ ...stepper, fontSize: 15 }}
              aria-label="Thêm một khách"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex shrink-0 items-center" style={{ padding: "5px 5px 5px 8px" }}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2"
            style={{
              background: "var(--accent)",
              color: "var(--accent-on)",
              border: "none",
              borderRadius: "var(--radius-md)",
              padding: "14px 22px",
              fontFamily: "var(--font-sans)",
              fontSize: 15,
              fontWeight: "var(--fw-semibold)",
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: "var(--shadow-clay-sm)",
              transition: "background var(--dur-base) var(--ease-standard)",
            }}
          >
            <Icon name="search" size={17} strokeWidth={2} />
            Tìm chỗ nghỉ
          </button>
        </div>
      </div>
    </form>
  );
}

/** Vạch ngăn: dọc trên máy tính, ngang trên điện thoại. */
function Divider() {
  return (
    <div
      aria-hidden
      className="h-px w-full self-auto sm:h-auto sm:w-px sm:self-stretch"
      style={{ background: "var(--border-subtle)", flexShrink: 0 }}
    />
  );
}
