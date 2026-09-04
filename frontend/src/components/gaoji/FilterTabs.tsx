"use client";

import React from "react";

export type FilterTabOption =
  | string
  | {
      label: string;
      value: string | number;
      badge?: string | number;
    };

export interface FilterTabsProps {
  tabs: FilterTabOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  tone?: "light" | "dark";
  className?: string;
  style?: React.CSSProperties;
}

/**
 * FilterTabs — Square caps tabs with a jade fill on active (or gold on dark).
 */
export function FilterTabs({
  tabs = [],
  value,
  onChange,
  tone = "light",
  className = "",
  style,
}: FilterTabsProps) {
  const dark = tone === "dark";

  return (
    <div
      role="tablist"
      className={`flex flex-wrap gap-2 ${className}`.trim()}
      style={style}
    >
      {tabs.map((tb) => {
        const v = typeof tb === "string" ? tb : tb.value;
        const l = typeof tb === "string" ? tb : tb.label;
        const badge = typeof tb !== "string" ? tb.badge : undefined;
        const on = v === value;

        return (
          <button
            key={String(v)}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(v)}
            className="px-4 py-2.5 min-h-[40px] cursor-pointer font-sans text-[var(--fs-label,0.75rem)] font-semibold uppercase tracking-[var(--tracking-caps,0.15em)] rounded-none transition-all duration-300 inline-flex items-center gap-2"
            style={{
              background: on
                ? dark
                  ? "var(--gold-500)"
                  : "var(--jade-700)"
                : "transparent",
              color: on
                ? dark
                  ? "var(--ink-900)"
                  : "var(--accent-on, #FAF3EA)"
                : dark
                ? "var(--gold-050)"
                : "var(--text-body)",
              border: `1px solid ${
                on
                  ? dark
                    ? "var(--gold-500)"
                    : "var(--jade-700)"
                  : dark
                  ? "rgba(212,175,55,.35)"
                  : "var(--hairline)"
              }`,
            }}
          >
            <span>{l}</span>
            {badge !== undefined && (
              <span
                className={`text-[0.625rem] px-1.5 py-0.5 font-bold ${
                  on
                    ? dark
                      ? "bg-[var(--jade-900)] text-[var(--gold-500)]"
                      : "bg-[var(--gold-500)] text-[var(--ink-900)]"
                    : "bg-[var(--hairline)] text-[var(--text-muted)]"
                }`}
              >
                {badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default FilterTabs;
