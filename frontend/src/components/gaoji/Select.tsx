import React, { useState } from "react";
import { Icon } from "./Icon";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: (string | SelectOption)[];
  onDark?: boolean;
  error?: string;
}

export function Select({
  label,
  options,
  onDark = false,
  error,
  className = "",
  style,
  onFocus,
  onBlur,
  ...props
}: SelectProps) {
  const [isFocused, setIsFocused] = useState(false);

  const border = error
    ? "var(--danger)"
    : isFocused
    ? "var(--gold-500)"
    : onDark
    ? "rgba(212,175,55,.35)"
    : "var(--hairline-strong)";

  return (
    <label className={`flex flex-col gap-1.5 w-full ${className}`.trim()} style={style}>
      {label && (
        <span
          className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.15em]"
          style={{ color: onDark ? "var(--gold-050)" : "var(--text-muted)" }}
        >
          {label}
        </span>
      )}
      <span className="relative flex items-center w-full">
        <select
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          className="w-full h-[48px] px-3.5 pr-9 font-sans text-[0.9375rem] leading-none rounded-none outline-none appearance-none cursor-pointer transition-colors duration-150"
          style={{
            background: onDark ? "rgba(250,243,234,.06)" : "var(--surface-raised)",
            color: onDark ? "var(--text-inverse)" : "var(--text-primary)",
            border: `1px solid ${border}`,
          }}
          {...props}
        >
          {options.map((opt) => {
            const val = typeof opt === "string" ? opt : opt.value;
            const lbl = typeof opt === "string" ? opt : opt.label;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
        <span
          className="absolute right-3 pointer-events-none flex items-center"
          style={{ color: onDark ? "var(--gold-700)" : "var(--text-muted)" }}
        >
          <Icon name="chevron-down" size={16} />
        </span>
      </span>
      {error && <span className="font-sans text-[0.75rem] text-[var(--danger)]">{error}</span>}
    </label>
  );
}

export default Select;
