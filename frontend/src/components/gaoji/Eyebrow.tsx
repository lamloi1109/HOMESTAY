import React from "react";

export interface EyebrowProps {
  children: React.ReactNode;
  tone?: "gold" | "jade" | "muted" | "onDark";
  tick?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const COLORS = {
  gold: "var(--gold-900)",
  jade: "var(--jade-700)",
  muted: "var(--text-muted)",
  onDark: "var(--gold-050)",
};

const RULES = {
  gold: "var(--gold-700)",
  jade: "var(--jade-700)",
  muted: "var(--hairline-strong)",
  onDark: "var(--gold-700)",
};

/**
 * Eyebrow: The caps category label that opens every section, card, and band.
 */
export function Eyebrow({
  children,
  tone = "gold",
  tick = true,
  className = "",
  style,
}: EyebrowProps) {
  return (
    <span
      className={`inline-flex items-center gap-3 font-sans text-[var(--fs-label)] font-semibold uppercase tracking-[var(--tracking-caps)] leading-[var(--lh-label)] ${className}`.trim()}
      style={{
        color: COLORS[tone] || COLORS.gold,
        ...style,
      }}
    >
      {tick && (
        <span
          aria-hidden="true"
          style={{
            width: 32,
            height: 1,
            background: RULES[tone] || RULES.gold,
            flex: "none",
          }}
        />
      )}
      {children}
    </span>
  );
}

export default Eyebrow;
