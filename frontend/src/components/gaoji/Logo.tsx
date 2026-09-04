"use client";

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
  const isDark = variant === "dark";

  // Select optimal source based on variant (light/dark) and tagline presence
  const src = isDark
    ? showTagline
      ? "/assets/logo-dark.png"
      : "/assets/logo-dark-compact.png"
    : showTagline
    ? "/assets/logo-full.png"
    : "/assets/logo-compact.png";

  // Height configurations for crisp rendering across all screen sizes
  const height =
    size === "sm"
      ? showTagline
        ? 44
        : 38
      : size === "lg"
      ? showTagline
        ? 88
        : 76
      : showTagline
      ? 60
      : 52;

  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col items-center justify-center select-none ${
        onClick ? "cursor-pointer" : "cursor-default"
      } ${className}`.trim()}
      style={style}
    >
      <img
        src={src}
        alt="Gao Ji House · Serviced Apartment"
        height={height}
        style={{
          height: `${height}px`,
          width: "auto",
          maxWidth: "100%",
          display: "block",
          objectFit: "contain",
        }}
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

export default Logo;
