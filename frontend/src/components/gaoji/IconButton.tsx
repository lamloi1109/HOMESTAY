"use client";

import { Icon } from "./Icon";
import { useTactile, tactileTransform } from "./interactions";

const DIA = { sm: 36, md: 44, lg: 52 } as const;

type Variant = "clay" | "glass" | "soft" | "ghost" | "contrast" | "accent" | "jade" | "plain";

function paint(variant: Variant, hover: boolean, active: boolean) {
  const A = active;
  switch (variant) {
    case "glass":
      return { bg: "var(--glass-bg)", glass: true, color: A ? "var(--accent)" : "var(--text-primary)", border: "1px solid var(--glass-border)", shadow: "glass" };
    case "soft":
      return { bg: A ? "var(--accent-soft)" : "var(--surface-sunken)", color: A ? "var(--accent)" : hover ? "var(--text-primary)" : "var(--text-secondary)", border: "none", shadow: "none" };
    case "ghost":
      return { bg: hover || A ? "var(--accent-soft)" : "transparent", color: hover || A ? "var(--accent)" : "var(--text-secondary)", border: "none", shadow: "none" };
    case "contrast":
      return { bg: "var(--surface-inverse)", color: "var(--text-inverse)", border: "none", shadow: "clay" };
    case "accent":
      return { bg: hover ? "var(--accent-hover)" : "var(--accent)", color: "var(--accent-on)", border: "none", shadow: "clay" };
    case "jade":
      return { bg: hover ? "var(--accent-2-hover)" : "var(--accent-2)", color: "var(--accent-2-on)", border: "none", shadow: "clay" };
    case "plain":
      return { bg: "transparent", color: A ? "var(--accent)" : "inherit", border: "none", shadow: "none" };
    default:
      return { bg: "var(--surface-raised)", color: A ? "var(--accent)" : hover ? "var(--text-primary)" : "var(--text-secondary)", border: "none", shadow: "clay" };
  }
}

export interface IconButtonProps {
  name?: string;
  children?: React.ReactNode;
  variant?: Variant;
  size?: "sm" | "md" | "lg" | number;
  active?: boolean;
  /** Bắt buộc khi không có children — nút chỉ có icon cần tên cho screen reader. */
  label: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * IconButton — nút tròn có phản hồi xúc giác. Dùng cho tim lưu chỗ nghỉ, nút
 * điều hướng, mũi tên carousel, nút đóng. `active` chuyển glyph sang màu clay.
 */
export function IconButton({
  name,
  children,
  variant = "clay",
  size = "md",
  active = false,
  label,
  disabled = false,
  onClick,
  style,
  className = "",
}: IconButtonProps) {
  const { hover, press, bind } = useTactile();
  const d = typeof size === "number" ? size : DIA[size] || DIA.md;
  const iconSize = Math.round(d * 0.44);
  const p = paint(variant, hover && !disabled, active);

  const boxShadow = disabled
    ? "none"
    : p.shadow === "clay"
      ? press
        ? "var(--shadow-pressed)"
        : hover
          ? "var(--shadow-clay)"
          : "var(--shadow-clay-sm)"
      : p.shadow === "glass"
        ? "var(--shadow-sm), inset 0 1px 0 var(--glass-hi)"
        : "none";

  return (
    <button
      type="button"
      className={`gh-iconbtn ${className}`.trim()}
      aria-label={label}
      aria-pressed={active || undefined}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      {...bind}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: d,
        height: d,
        flex: "none",
        borderRadius: "var(--radius-circle)",
        background: p.bg,
        color: p.color,
        border: p.border,
        boxShadow,
        backdropFilter: p.glass ? "blur(var(--glass-blur)) saturate(1.3)" : undefined,
        WebkitBackdropFilter: p.glass ? "blur(var(--glass-blur)) saturate(1.3)" : undefined,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transform: disabled ? "none" : tactileTransform(press, hover, p.shadow === "clay"),
        transition:
          "transform var(--dur-fast) var(--ease-spring), box-shadow var(--dur-base) var(--ease-out), background var(--dur-fast) var(--ease-standard), color var(--dur-fast)",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
    >
      {children != null ? children : <Icon name={name} size={iconSize} />}
    </button>
  );
}

export default IconButton;
