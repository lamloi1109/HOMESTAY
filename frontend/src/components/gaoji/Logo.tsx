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
  const isDark = variant === "dark";

  // Select optimal source based on variant (light/dark) and tagline presence.
  // All assets are 100% transparent RGBA with preserved vertical clearance
  // so brand text and descenders are never clipped.
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

  // Aspect ratio: compact is 640x360 (16/9), full is 680x400 (17/10)
  const aspectRatio = showTagline ? 680 / 400 : 640 / 360;
  const width = Math.round(height * aspectRatio);

  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col items-center justify-center select-none bg-transparent ${
        onClick ? "cursor-pointer" : "cursor-default"
      } ${className}`.trim()}
      style={style}
    >
      <Image
        src={src}
        alt="Gao Ji House · Serviced Apartment"
        width={width}
        height={height}
        priority
        style={{
          height: `${height}px`,
          width: "auto",
          maxWidth: "100%",
          display: "block",
          objectFit: "contain",
          background: "transparent",
        }}
      />
    </div>
  );
}

export default Logo;
