import React from "react";
import { useLanguage, type LanguageCode } from "@/context/LanguageContext";
import { Icon } from "./Icon";

const SPEC_LABELS: Record<LanguageCode, { beds: string; baths: string; guests: string; kitchens: string }> = {
  vi: { beds: "PN", baths: "WC", guests: "KHÁCH", kitchens: "BẾP" },
  en: { beds: "BR", baths: "BATHS", guests: "GUESTS", kitchens: "KITCHENS" },
  cn: { beds: "卧室", baths: "浴室", guests: "位客人", kitchens: "厨房" },
  tw: { beds: "臥室", baths: "浴室", guests: "位房客", kitchens: "廚房" },
};

export interface RoomSpecsProps {
  beds?: number | null;
  baths?: number | null;
  sqm?: number | null;
  guests?: number | null;
  bedrooms?: number | null;
  kitchens?: number | null;
  tone?: "light" | "dark";
  variant?: "strip" | "plain";
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
  variant = "strip",
  className = "",
  style,
}: RoomSpecsProps) {
  const { lang } = useLanguage();
  const labels = SPEC_LABELS[lang];
  const actualBeds = beds ?? bedrooms;

  const items = [
    actualBeds != null && {
      icon: "bed-double",
      text: `${actualBeds} ${labels.beds}`,
    },
    baths != null && {
      icon: "bath",
      text: `${baths} ${labels.baths}`,
    },
    sqm != null && {
      icon: "door-open",
      text: `${sqm} M²`,
    },
    guests != null && {
      icon: "users",
      text: `${guests} ${labels.guests}`,
    },
    kitchens != null && {
      icon: "cooking-pot",
      text: `${kitchens} ${labels.kitchens}`,
    },
  ].filter(Boolean) as { icon: string; text: string }[];

  const fg = tone === "dark" ? "var(--text-inverse)" : "var(--text-body)";
  const line = tone === "dark" ? "rgba(212,175,55,.3)" : "var(--hairline)";

  return (
    <div
      className={`flex flex-wrap items-center ${variant === "plain" ? "gap-x-5 gap-y-2" : ""} ${className}`.trim()}
      style={style}
    >
      {items.map((it, i) => (
        <span
          key={it.text}
          className="inline-flex items-center gap-2 font-sans text-xs sm:text-[var(--fs-label,0.75rem)] font-medium uppercase tracking-[0.08em]"
          style={{
            padding: variant === "plain" ? 0 : "0 14px",
            borderLeft: variant === "plain" || i === 0 ? "none" : `1px solid ${line}`,
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
