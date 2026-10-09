"use client";

import Image from "next/image";
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
  // The new artwork includes its own neutral gradient, so one source works on
  // both light and dark surfaces. Keep `variant` in the public API because the
  // shared component's callers use it to describe their surrounding surface.
  void variant;
  const src = showTagline
    ? "/assets/logo-brand-full.webp"
    : "/assets/logo-brand-compact.webp";

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
      <Image
        src={src}
        alt="Gao Ji House · Serviced Apartment"
        width={Math.round(height * (showTagline ? 1100 / 620 : 1100 / 500))}
        height={height}
        style={{
          height: `${height}px`,
          width: "auto",
          maxWidth: "100%",
          display: "block",
          objectFit: "contain",
        }}
        priority
      />
    </div>
  );
}

export default Logo;
