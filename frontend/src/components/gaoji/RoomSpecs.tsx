import { Icon } from "./Icon";

type SpecKey = "bedrooms" | "beds" | "baths" | "kitchens" | "guests";

const ICONS: Record<SpecKey, string> = {
  bedrooms: "door-open",
  beds: "bed-double",
  baths: "bath",
  kitchens: "cooking-pot",
  guests: "users",
};

const LABELS: Record<SpecKey, string> = {
  bedrooms: "phòng ngủ",
  beds: "giường",
  baths: "phòng tắm",
  kitchens: "bếp",
  guests: "khách",
};

export interface RoomSpecsProps {
  bedrooms?: number;
  beds?: number;
  baths?: number;
  kitchens?: number;
  guests?: number;
  items?: { icon: string; label: string }[];
  size?: "sm" | "md";
  separator?: boolean;
  iconColor?: string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * RoomSpecs — hàng icon+số gọn mô tả cấu trúc chỗ nghỉ (phòng ngủ · giường ·
 * phòng tắm · bếp). Truyền số theo từng loại, hoặc truyền thẳng `items`.
 */
export function RoomSpecs({
  bedrooms,
  beds,
  baths,
  kitchens,
  guests,
  items,
  size = "md",
  separator = false,
  iconColor = "var(--text-muted)",
  style,
  className = "",
}: RoomSpecsProps) {
  let list = items;
  if (!list) {
    const built: { icon: string; label: string }[] = [];
    const push = (k: SpecKey, v?: number) => {
      if (v != null) built.push({ icon: ICONS[k], label: `${v} ${LABELS[k]}` });
    };
    push("guests", guests);
    push("bedrooms", bedrooms);
    push("beds", beds);
    push("baths", baths);
    push("kitchens", kitchens);
    list = built;
  }

  const iconSize = size === "sm" ? 15 : 17;
  const fs = size === "sm" ? "var(--fs-caption)" : "var(--fs-body-sm)";

  return (
    <div
      className={`gh-roomspecs ${className}`.trim()}
      style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: separator ? 8 : 16, ...style }}
    >
      {list.map((it, i) => (
        <span key={i} style={{ display: "contents" }}>
          {separator && i > 0 ? (
            <span aria-hidden="true" style={{ color: "var(--border-strong)" }}>
              ·
            </span>
          ) : null}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: fs,
              color: "var(--text-body)",
              whiteSpace: "nowrap",
            }}
          >
            <Icon name={it.icon} size={iconSize} color={iconColor} />
            <span>{it.label}</span>
          </span>
        </span>
      ))}
    </div>
  );
}

export default RoomSpecs;
