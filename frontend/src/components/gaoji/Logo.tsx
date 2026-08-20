import React from "react";

export interface LogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function Logo({
  variant = "light",
  size = "md",
  showTagline = true,
  onClick,
  className = "",
  style,
}: LogoProps) {
  const dark = variant === "dark";
  const w = size === "sm" ? 28 : size === "lg" ? 46 : 36;
  const h = size === "sm" ? 15 : size === "lg" ? 24 : 19;
  const script = size === "sm" ? "1.5rem" : size === "lg" ? "2.85rem" : "2.1rem";
  const houseFs = size === "sm" ? ".6875rem" : size === "lg" ? "1rem" : ".8125rem";
  const tagFs = size === "sm" ? ".4375rem" : size === "lg" ? ".625rem" : ".5rem";
  const rule = size === "sm" ? 16 : size === "lg" ? 48 : 32;

  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col items-center text-center select-none ${onClick ? "cursor-pointer" : "cursor-default"} ${className}`.trim()}
      style={style}
    >
      <svg
        width={w}
        height={h}
        viewBox="0 0 50 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M25 2L3 24H9L25 8L41 24H47L25 2Z" fill="url(#gjGold)" />
        <rect x="21" y="16" width="3.5" height="3.5" fill="url(#gjGold)" />
        <rect x="25.5" y="16" width="3.5" height="3.5" fill="url(#gjGold)" />
        <rect x="21" y="20.5" width="3.5" height="3.5" fill="url(#gjGold)" />
        <rect x="25.5" y="20.5" width="3.5" height="3.5" fill="url(#gjGold)" />
        <defs>
          <linearGradient id="gjGold" x1="0" y1="0" x2="50" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D4AF37" />
            <stop offset="0.5" stopColor="#B8860B" />
            <stop offset="1" stopColor="#8B6508" />
          </linearGradient>
        </defs>
      </svg>

      <span
        style={{
          fontFamily: "var(--font-script, cursive)",
          fontSize: script,
          lineHeight: 1.05,
          letterSpacing: ".02em",
          color: dark ? "var(--gold-050)" : "var(--jade-900)",
          textShadow: dark
            ? "0 0 12px rgba(212,175,55,.4)"
            : "0.4px 0.4px 0 #C59B27, -0.4px -0.4px 0 #C59B27, 0.4px -0.4px 0 #C59B27, -0.4px 0.4px 0 #C59B27",
        }}
      >
        Gao Ji
      </span>

      <span className="flex items-center gap-2 my-0.5">
        <span
          style={{
            width: rule,
            height: 1,
            background: dark ? "rgba(212,175,55,.6)" : "rgba(156,114,29,.6)",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: houseFs,
            letterSpacing: "var(--tracking-caps-wide)",
            color: dark ? "var(--gold-050)" : "var(--gold-900)",
          }}
        >
          house
        </span>
        <span
          style={{
            width: rule,
            height: 1,
            background: dark ? "rgba(212,175,55,.6)" : "rgba(156,114,29,.6)",
          }}
        />
      </span>

      {showTagline && (
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: tagFs,
            fontWeight: "var(--fw-bold)",
            letterSpacing: ".2em",
            textTransform: "uppercase",
            color: dark ? "rgba(255,255,255,.7)" : "var(--ink-900)",
          }}
        >
          Serviced Apartment · Comfort · Vinhomes Central Park
        </span>
      )}
    </div>
  );
}

export default Logo;
