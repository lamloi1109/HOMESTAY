"use client";

import { Badge } from "./Badge";
import { IconButton } from "./IconButton";
import { RatingStars } from "./RatingStars";
import { RoomSpecs, type RoomSpecsProps } from "./RoomSpecs";
import { useTactile } from "./interactions";

// LƯU Ý: bản gốc trên design system dùng var(--clay-300) ở gradient thứ ba,
// nhưng bảng màu không có --clay-300 (chỉ có 50/100/200/400/500/600/700) nên
// gradient đó hỏng. Ở đây thay bằng --clay-400. Cần sửa lại trên design system.
const GRADS = [
  "linear-gradient(140deg, var(--clay-200), var(--clay-400))",
  "linear-gradient(140deg, var(--jade-100), var(--jade-300))",
  "linear-gradient(150deg, var(--sand-250), var(--clay-400))",
  "linear-gradient(150deg, var(--jade-300), var(--jade-600))",
  "linear-gradient(140deg, var(--clay-100), var(--sanddeep-300))",
];

function grad(seed?: string) {
  let s = 0;
  const str = String(seed || "");
  for (let i = 0; i < str.length; i++) s += str.charCodeAt(i);
  return GRADS[s % GRADS.length];
}

/** Giá kiểu Việt: dấu chấm phân cách nghìn, hậu tố ₫. */
function vnd(n: number | string) {
  if (typeof n !== "number") return n;
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "₫";
}

export interface PropertyCardProps {
  title: string;
  location?: string;
  image?: string | null;
  price: number | string;
  originalPrice?: number;
  unit?: string;
  rating?: number;
  badge?: { label: string; tone?: "neutral" | "accent" | "jade" | "gold" | "success" | "warning" | "danger" | "info"; icon?: string; variant?: "soft" | "solid" | "glass" | "outline" };
  saved?: boolean;
  onSave?: () => void;
  onClick?: () => void;
  aspect?: string;
  specs?: RoomSpecsProps;
  photoCount?: number;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * PropertyCard — card danh sách lấy ảnh làm chính. Tấm ảnh có grain kèm tim lưu
 * và badge nổi, bên dưới là tên / địa điểm / thông số / đánh giá / giá. Có
 * `originalPrice` thì hiện giá gạch ngang + phần trăm giảm.
 */
export function PropertyCard({
  title,
  location,
  image,
  price,
  originalPrice,
  unit = "đêm",
  rating,
  badge,
  saved = false,
  onSave,
  onClick,
  aspect = "4 / 3",
  specs,
  photoCount,
  style,
  className = "",
}: PropertyCardProps) {
  const hasDiscount =
    typeof originalPrice === "number" && typeof price === "number" && originalPrice > price;
  const off = hasDiscount ? Math.round((1 - (price as number) / originalPrice) * 100) : 0;
  const { hover, press, bind } = useTactile();

  return (
    <div
      className={`gh-property ${className}`.trim()}
      onClick={onClick}
      {...bind}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        cursor: onClick ? "pointer" : "default",
        transform: onClick ? (press ? "scale(0.99)" : hover ? "translateY(-3px)" : "none") : "none",
        transition: "transform var(--dur-base) var(--ease-spring)",
        ...style,
      }}
    >
      <div
        className="gh-noise"
        style={{
          position: "relative",
          aspectRatio: aspect,
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          background: image ? `center/cover no-repeat url("${image}")` : grad(title || location),
          boxShadow: "inset 0 0 0 1px rgba(33,28,20,.05)",
        }}
      >
        {badge ? (
          <div style={{ position: "absolute", top: 12, left: 12, zIndex: 2 }}>
            <Badge tone={badge.tone || "gold"} icon={badge.icon} variant={badge.variant || "glass"}>
              {badge.label}
            </Badge>
          </div>
        ) : null}

        <div style={{ position: "absolute", top: 10, right: 10, zIndex: 2 }}>
          <IconButton
            name="heart"
            variant="glass"
            size="md"
            active={saved}
            className={saved ? "gh-fill" : ""}
            label={saved ? "Bỏ lưu" : "Lưu chỗ nghỉ"}
            onClick={(e) => {
              e.stopPropagation();
              onSave?.();
            }}
          />
        </div>

        {photoCount ? (
          <div style={{ position: "absolute", bottom: 12, right: 12, zIndex: 2 }}>
            <Badge tone="neutral" variant="glass" icon="images">
              {photoCount}
            </Badge>
          </div>
        ) : null}

        {hasDiscount ? (
          <div style={{ position: "absolute", bottom: 12, left: 12, zIndex: 2 }}>
            <Badge tone="danger" variant="solid">{`GIẢM ${off}%`}</Badge>
          </div>
        ) : null}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 3, padding: "0 2px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
          <h3
            style={{
              margin: 0,
              fontFamily: "var(--font-sans)",
              fontSize: "var(--fs-h4)",
              fontWeight: "var(--fw-semibold)",
              color: "var(--text-primary)",
              lineHeight: 1.25,
              letterSpacing: "var(--tracking-tight)",
            }}
          >
            {title}
          </h3>
          {rating != null ? (
            <div style={{ flex: "none" }}>
              <RatingStars value={rating} size={14} />
            </div>
          ) : null}
        </div>

        {location ? (
          <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>{location}</div>
        ) : null}

        {specs ? <RoomSpecs size="sm" separator style={{ marginTop: 2 }} {...specs} /> : null}

        <div style={{ marginTop: 6, display: "flex", alignItems: "baseline", gap: 7, flexWrap: "wrap" }}>
          {hasDiscount ? (
            <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", textDecoration: "line-through" }}>
              {vnd(originalPrice)}
            </span>
          ) : null}
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "var(--fs-body-lg)",
              fontWeight: "var(--fw-semibold)",
              color: hasDiscount ? "var(--danger)" : "var(--text-primary)",
            }}
          >
            {vnd(price)}
          </span>
          <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>/ {unit}</span>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;
