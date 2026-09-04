import React from "react";
import { Icon } from "./Icon";

export interface RoomSpecsProps {
  beds?: number | null;
  baths?: number | null;
  sqm?: number | null;
  guests?: number | null;
  bedrooms?: number | null;
  kitchens?: number | null;
  tone?: "light" | "dark";
  className?: string;
  style?: React.CSSProperties;
}

/**
 * RoomSpecs — The bed/bath/area strip under a unit headline. Hairline-separated, caps.
 */
export function RoomSpecs({
  beds,
  baths,
  sqm,
  guests,
  bedrooms,
  kitchens,
  tone = "light",
  className = "",
  style,
}: RoomSpecsProps) {
  const actualBeds = beds ?? bedrooms;

  const items = [
    actualBeds != null && {
      icon: "bed-double",
      text: `${actualBeds} PN`,
    },
    baths != null && {
      icon: "bath",
      text: `${baths} WC`,
    },
    sqm != null && {
      icon: "door-open",
      text: `${sqm} M²`,
    },
    guests != null && {
      icon: "users",
      text: `${guests} KHÁCH`,
    },
    kitchens != null && {
      icon: "cooking-pot",
      text: `${kitchens} BẾP`,
    },
  ].filter(Boolean) as { icon: string; text: string }[];

  const fg = tone === "dark" ? "var(--text-inverse)" : "var(--text-body)";
  const line = tone === "dark" ? "rgba(212,175,55,.3)" : "var(--hairline)";

  return (
    <div
      className={`flex flex-wrap items-center ${className}`.trim()}
      style={style}
    >
      {items.map((it, i) => (
        <span
          key={it.text}
          className="inline-flex items-center gap-2 font-sans text-xs sm:text-[var(--fs-label,0.75rem)] font-medium uppercase tracking-[0.08em]"
          style={{
            padding: "0 14px",
            borderLeft: i === 0 ? "none" : `1px solid ${line}`,
            color: fg,
          }}
        >
          <Icon
            name={it.icon}
            size={15}
            color={tone === "dark" ? "var(--gold-500)" : "var(--gold-700)"}
          />
          <span>{it.text}</span>
        </span>
      ))}
    </div>
  );
}

export default RoomSpecs;
