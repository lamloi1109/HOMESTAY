import React from "react";
import { Eyebrow } from "./Eyebrow";

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  aside?: string;
  action?: React.ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center" | "right";
  className?: string;
  style?: React.CSSProperties;
}

/**
 * SectionHeader — Every section opens the same way: eyebrow, serif headline, hairline,
 * optional right-aligned aside or action.
 */
export function SectionHeader({
  eyebrow,
  title,
  aside,
  action,
  tone = "light",
  align = "left",
  className = "",
  style,
}: SectionHeaderProps) {
  const dark = tone === "dark";

  return (
    <header
      className={`flex flex-col gap-4 ${className}`.trim()}
      style={style}
    >
      {eyebrow && (
        <Eyebrow tone={dark ? "onDark" : "gold"}>
          {eyebrow}
        </Eyebrow>
      )}

      <div
        className="flex flex-wrap items-end justify-between gap-6"
        style={{ textAlign: align }}
      >
        <h2
          className="font-display text-[clamp(1.75rem,1.5rem+1.1vw,2.5rem)] font-normal leading-[1.2] tracking-[-0.01em] uppercase max-w-[22ch]"
          style={{
            color: dark ? "var(--text-inverse)" : "var(--text-primary)",
          }}
        >
          {title}
        </h2>

        {aside && (
          <p
            className="font-sans text-sm sm:text-base leading-[1.6] max-w-[42ch]"
            style={{
              color: dark ? "rgba(250,243,234,.76)" : "var(--text-body)",
            }}
          >
            {aside}
          </p>
        )}

        {action}
      </div>

      <hr
        aria-hidden="true"
        className="h-px border-0 m-0"
        style={{
          background: dark ? "rgba(212,175,55,.3)" : "var(--hairline)",
        }}
      />
    </header>
  );
}

export default SectionHeader;
