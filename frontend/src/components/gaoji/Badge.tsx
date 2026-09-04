import React from "react";
import { Icon } from "./Icon";

export type Tone =
  | "neutral"
  | "jade"
  | "gold"
  | "clay"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "available"
  | "held"
  | "paper";

export type Variant = "soft" | "solid" | "outline" | "glass";

const TONES: Record<
  Tone,
  { solidBg: string; solidOn: string; softBg: string; softOn: string; border: string }
> = {
  neutral: {
    solidBg: "var(--ink-900)",
    solidOn: "var(--paper-150)",
    softBg: "var(--paper-200)",
    softOn: "var(--ink-900)",
    border: "var(--hairline-strong)",
  },
  jade: {
    solidBg: "var(--jade-700)",
    solidOn: "var(--paper-150)",
    softBg: "rgba(31,58,46,.12)",
    softOn: "var(--jade-700)",
    border: "var(--jade-700)",
  },
  accent: {
    solidBg: "var(--jade-700)",
    solidOn: "var(--paper-150)",
    softBg: "rgba(31,58,46,.12)",
    softOn: "var(--jade-700)",
    border: "var(--jade-700)",
  },
  gold: {
    solidBg: "var(--gold-500)",
    solidOn: "var(--ink-900)",
    softBg: "var(--gold-100)",
    softOn: "var(--gold-900)",
    border: "var(--gold-700)",
  },
  clay: {
    solidBg: "var(--clay-500)",
    solidOn: "var(--paper-000)",
    softBg: "var(--clay-100)",
    softOn: "var(--clay-700)",
    border: "var(--clay-500)",
  },
  success: {
    solidBg: "var(--success)",
    solidOn: "#ffffff",
    softBg: "var(--success-soft)",
    softOn: "var(--success)",
    border: "var(--success)",
  },
  available: {
    solidBg: "var(--success)",
    solidOn: "#ffffff",
    softBg: "var(--success-soft)",
    softOn: "var(--success)",
    border: "var(--success)",
  },
  warning: {
    solidBg: "var(--warning)",
    solidOn: "var(--ink-900)",
    softBg: "var(--warning-soft)",
    softOn: "var(--warning)",
    border: "var(--warning)",
  },
  held: {
    solidBg: "var(--warning)",
    solidOn: "var(--ink-900)",
    softBg: "var(--warning-soft)",
    softOn: "var(--warning)",
    border: "var(--warning)",
  },
  danger: {
    solidBg: "var(--danger)",
    solidOn: "#ffffff",
    softBg: "var(--danger-soft)",
    softOn: "var(--danger)",
    border: "var(--danger)",
  },
  info: {
    solidBg: "var(--info)",
    solidOn: "#ffffff",
    softBg: "var(--info-soft)",
    softOn: "var(--info)",
    border: "var(--info)",
  },
  paper: {
    solidBg: "var(--glass-warm)",
    solidOn: "var(--ink-900)",
    softBg: "var(--glass-warm)",
    softOn: "var(--ink-900)",
    border: "var(--hairline)",
  },
};

export interface BadgeProps {
  children?: React.ReactNode;
  tone?: Tone;
  variant?: Variant;
  size?: "sm" | "md";
  icon?: string;
  dot?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function Badge({
  children,
  tone = "neutral",
  variant = "soft",
  size = "md",
  icon,
  dot = false,
  style,
  className = "",
}: BadgeProps) {
  const t = TONES[tone] || TONES.neutral;
  const solid = variant === "solid";
  const outline = variant === "outline";
  const glass = variant === "glass";
  const iconSize = size === "sm" ? 12 : 14;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-sans font-semibold uppercase tracking-[0.15em] text-[0.6875rem] leading-none whitespace-nowrap rounded-none ${className}`.trim()}
      style={{
        height: size === "sm" ? 22 : 26,
        padding: size === "sm" ? "0 8px" : "0 10px",
        background: glass
          ? "rgba(250,243,234,.9)"
          : outline
          ? "transparent"
          : solid
          ? t.solidBg
          : t.softBg,
        color: glass
          ? "var(--ink-900)"
          : outline
          ? t.softOn
          : solid
          ? t.solidOn
          : t.softOn,
        border: glass ? "1px solid var(--hairline-strong)" : `1px solid ${t.border}`,
        backdropFilter: glass ? "blur(8px)" : undefined,
        ...style,
      }}
    >
      {dot && <span style={{ width: 5, height: 5, background: "currentColor", flex: "none" }} />}
      {icon && <Icon name={icon} size={iconSize} />}
      {children != null && <span>{children}</span>}
    </span>
  );
}

export default Badge;
