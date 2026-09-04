"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Icon } from "./Icon";

export interface FeatureCardProps {
  icon?: string;
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
  bullets?: string[];
  tone?: "paper" | "warm" | "jade" | "ink";
  image?: string;
  imageAlt?: string;
  imageRatio?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * FeatureCard — Amenity / service card: glyph, caps eyebrow, serif headline, body, optional bullets.
 */
export function FeatureCard({
  icon,
  eyebrow,
  title,
  children,
  bullets = [],
  tone = "paper",
  image,
  imageAlt = "",
  imageRatio = "16 / 10",
  className = "",
  style,
}: FeatureCardProps) {
  const [hover, setHover] = useState(false);
  const dark = tone === "jade" || tone === "ink";
  const bg =
    tone === "jade"
      ? "var(--jade-700)"
      : tone === "ink"
      ? "var(--surface-ink)"
      : tone === "warm"
      ? "var(--canvas-warm)"
      : "var(--surface-raised)";

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`flex flex-col rounded-none transition-colors duration-200 ${className}`.trim()}
      style={{
        background: bg,
        border: `1px solid ${dark ? "rgba(212,175,55,.28)" : "var(--hairline)"}`,
        ...style,
      }}
    >
      {image && (
        <span
          className="relative block overflow-hidden bg-[var(--surface-sunken)] w-full"
          style={{ aspectRatio: imageRatio }}
        >
          <Image
            src={image}
            alt={imageAlt || title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover block transition-transform duration-800 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: hover ? "scale(var(--hover-zoom, 1.04))" : "scale(1)",
            }}
          />
        </span>
      )}

      <div className="flex flex-col gap-3 p-6 sm:p-7 flex-1">
        {icon && (
          <Icon
            name={icon}
            size={26}
            color={dark ? "var(--gold-500)" : "var(--gold-700)"}
          />
        )}

        {eyebrow && (
          <span
            className="font-sans text-[var(--fs-micro,0.6875rem)] font-semibold uppercase tracking-[var(--tracking-caps,0.15em)]"
            style={{ color: dark ? "var(--gold-050)" : "var(--gold-900)" }}
          >
            {eyebrow}
          </span>
        )}

        <h3
          className="font-display text-xl sm:text-2xl font-medium leading-[1.25]"
          style={{ color: dark ? "var(--text-inverse)" : "var(--text-primary)" }}
        >
          {title}
        </h3>

        {children && (
          <p
            className="font-sans text-sm sm:text-base leading-relaxed"
            style={{ color: dark ? "rgba(250,243,234,.78)" : "var(--text-body)" }}
          >
            {children}
          </p>
        )}

        {bullets.length > 0 && (
          <ul className="mt-2 list-none p-0 grid gap-2">
            {bullets.map((b) => (
              <li
                key={b}
                className="flex gap-2.5 items-start font-sans text-xs sm:text-sm tracking-[0.04em]"
                style={{ color: dark ? "rgba(250,243,234,.86)" : "var(--text-body)" }}
              >
                <span
                  aria-hidden="true"
                  className="w-1.5 h-1.5 mt-2 bg-[var(--gold-700)] shrink-0"
                />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

export default FeatureCard;
