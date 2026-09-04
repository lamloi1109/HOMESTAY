"use client";

import React, { useState } from "react";
import { Icon } from "./Icon";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
  name?: string;
  label: string;
  variant?: "outline" | "jade" | "onDark" | "channel" | "clay" | "gold";
  shape?: "square" | "circle";
  size?: number | "sm" | "md" | "lg";
  tone?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * IconButton — Square by default (toolbar, close, arrows); circular only for channel and social affordances.
 */
export function IconButton({
  icon,
  name,
  label,
  variant = "outline",
  shape = "square",
  size = 44,
  tone,
  className = "",
  style,
  onClick,
  disabled,
  ...rest
}: IconButtonProps) {
  const [hover, setHover] = useState(false);
  const iconName = icon || name;

  const numSize =
    typeof size === "number"
      ? size
      : size === "sm"
      ? 36
      : size === "lg"
      ? 52
      : 44;

  const tones: Record<
    string,
    { bg: string; fg: string; bd: string; hbg: string; hfg: string }
  > = {
    outline: {
      bg: "transparent",
      fg: "var(--jade-700)",
      bd: "var(--hairline-strong)",
      hbg: "var(--jade-700)",
      hfg: "var(--accent-on, #FAF3EA)",
    },
    jade: {
      bg: "var(--jade-700)",
      fg: "var(--accent-on, #FAF3EA)",
      bd: "var(--jade-700)",
      hbg: "var(--jade-900)",
      hfg: "var(--accent-on, #FAF3EA)",
    },
    gold: {
      bg: "var(--gold-500)",
      fg: "var(--ink-900)",
      bd: "var(--gold-500)",
      hbg: "var(--gold-600)",
      hfg: "var(--ink-900)",
    },
    clay: {
      bg: "var(--clay-500)",
      fg: "#ffffff",
      bd: "var(--clay-500)",
      hbg: "var(--clay-700)",
      hfg: "#ffffff",
    },
    onDark: {
      bg: "rgba(250,243,234,.08)",
      fg: "var(--gold-050)",
      bd: "rgba(212,175,55,.5)",
      hbg: "var(--gold-500)",
      hfg: "var(--ink-900)",
    },
    channel: {
      bg: tone || "var(--channel-zalo)",
      fg: "#ffffff",
      bd: "transparent",
      hbg: tone || "var(--channel-zalo)",
      hfg: "#ffffff",
    },
  };

  const t = tones[variant] || tones.outline;

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`inline-flex items-center justify-center p-0 transition-colors duration-150 cursor-pointer select-none ${
        disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
      } ${className}`.trim()}
      style={{
        width: numSize,
        height: numSize,
        background: hover ? t.hbg : t.bg,
        color: hover ? t.hfg : t.fg,
        border: `1px solid ${t.bd}`,
        borderRadius: shape === "circle" ? "var(--radius-circle, 50%)" : "0px",
        filter: hover && variant === "channel" ? "brightness(1.08)" : "none",
        ...style,
      }}
      {...rest}
    >
      {iconName && <Icon name={iconName} size={Math.round(numSize * 0.44)} />}
    </button>
  );
}

export default IconButton;
