"use client";

import { useTactile, tactileTransform } from "./interactions";

type Variant = "clay" | "glass" | "flat" | "sunken" | "outline";
type RadiusKey = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const RADII: Record<RadiusKey, string> = {
  xs: "var(--radius-xs)",
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  xl: "var(--radius-xl)",
  "2xl": "var(--radius-2xl)",
};

function base(variant: Variant) {
  switch (variant) {
    case "glass":
      return { bg: "var(--glass-bg)", border: "1px solid var(--glass-border)", shadow: "var(--shadow-md), inset 0 1px 0 var(--glass-hi)", glass: true };
    case "flat":
      return { bg: "var(--surface-raised)", border: "1px solid var(--border-subtle)", shadow: "var(--shadow-sm)" };
    case "sunken":
      return { bg: "var(--surface-sunken)", border: "1px solid var(--border-subtle)", shadow: "none" };
    case "outline":
      return { bg: "transparent", border: "1.5px solid var(--border-default)", shadow: "none" };
    default:
      return { bg: "var(--surface-raised)", border: "none", shadow: "var(--shadow-clay)" };
  }
}

export interface CardProps {
  variant?: Variant;
  radius?: RadiusKey | string;
  padding?: number | string;
  /** Phủ lớp grain — chất liệu chống "mệt mỏi thị giác" của design system. */
  grain?: boolean;
  interactive?: boolean;
  href?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Card — bề mặt nền của design system. Mặc định claymorphic; còn có glass,
 * flat, sunken, outline. `grain` phủ lớp nhiễu; `interactive` thêm nhấc khi
 * hover và nén khi bấm.
 */
export function Card({
  variant = "clay",
  radius = "lg",
  padding,
  grain = false,
  interactive = false,
  href,
  onClick,
  children,
  style,
  className = "",
}: CardProps) {
  const { hover, press, bind } = useTactile();
  const b = base(variant);
  const clickable = interactive || !!onClick || !!href;
  const r = RADII[radius as RadiusKey] || radius;

  const shadow =
    clickable && press && variant === "clay"
      ? "var(--shadow-pressed)"
      : clickable && hover
        ? variant === "clay"
          ? "var(--shadow-clay)"
          : "var(--shadow-lg)"
        : b.shadow;

  const st: React.CSSProperties = {
    position: "relative",
    boxSizing: "border-box",
    background: b.bg,
    border: b.border,
    borderRadius: r,
    boxShadow: shadow,
    padding: padding != null ? padding : "var(--space-lg)",
    color: "var(--text-body)",
    backdropFilter: b.glass ? "blur(var(--glass-blur)) saturate(1.3)" : undefined,
    WebkitBackdropFilter: b.glass ? "blur(var(--glass-blur)) saturate(1.3)" : undefined,
    transform: clickable ? tactileTransform(press, hover, true) : "none",
    transition: "transform var(--dur-base) var(--ease-spring), box-shadow var(--dur-base) var(--ease-out)",
    cursor: clickable ? "pointer" : "default",
    ...style,
  };

  const cls = `gh-surface ${grain ? "gh-noise " : ""}${className}`.trim();
  const bindProps = clickable ? bind : {};

  if (href) {
    return (
      <a href={href} className={cls} style={st} onClick={onClick} {...bindProps}>
        {children}
      </a>
    );
  }
  return (
    <div className={cls} style={st} onClick={onClick} {...bindProps}>
      {children}
    </div>
  );
}

export default Card;
