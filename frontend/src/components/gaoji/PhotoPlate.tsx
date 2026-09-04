"use client";

import Image from "next/image";
import React, { useState } from "react";

export interface PhotoPlateProps {
  src: string;
  alt?: string;
  caption?: string;
  ratio?: string;
  offset?: "left" | "right";
  frame?: string;
  zoom?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * PhotoPlate — The signature offset frame: a hairline rectangle shifted behind a photograph,
 * so the composition reads as two planes. Caption is a print-style plate label.
 */
export function PhotoPlate({
  src,
  alt = "",
  caption,
  ratio = "4 / 3",
  offset = "right",
  frame = "var(--gold-700)",
  zoom = true,
  className = "",
  style,
}: PhotoPlateProps) {
  const [hover, setHover] = useState(false);
  const dx = offset === "left" ? "calc(var(--frame-offset, 12px) * -1)" : "var(--frame-offset, 12px)";

  return (
    <figure className={`m-0 relative ${className}`.trim()} style={style}>
      {/* Signature Offset Frame */}
      <span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${dx}, var(--frame-offset, 12px))`,
          border: `1px solid ${frame}`,
        }}
      />

      {/* Image container */}
      <span
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="relative block overflow-hidden bg-[var(--surface-sunken)] w-full"
        style={{ aspectRatio: ratio }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover block transition-transform duration-800 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: hover && zoom ? "scale(var(--hover-zoom, 1.04))" : "scale(1)",
          }}
        />
      </span>

      {/* Plate caption */}
      {caption && (
        <figcaption className="mt-3 font-sans text-[var(--fs-micro,0.6875rem)] font-semibold uppercase tracking-[var(--tracking-caps,0.15em)] text-[var(--text-muted)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export default PhotoPlate;
