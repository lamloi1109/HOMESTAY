import React, { useState } from "react";
import { Icon } from "./Icon";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  icon?: string;
  hint?: string;
  error?: string;
  as?: "input" | "textarea";
  rows?: number;
  onDark?: boolean;
}

export function Input({
  label,
  icon,
  hint,
  error,
  as = "input",
  rows = 4,
  onDark = false,
  className = "",
  style,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
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
        {icon && (
          <span
            className="absolute left-3 flex items-center pointer-events-none"
            style={{ color: onDark ? "var(--gold-700)" : "var(--text-muted)" }}
          >
            <Icon name={icon} size={16} />
          </span>
        )}
        {as === "textarea" ? (
          <textarea
            rows={rows}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            className="w-full px-3.5 py-3 font-sans text-[0.9375rem] leading-relaxed rounded-none outline-none resize-y transition-colors duration-150"
            style={{
              paddingLeft: icon ? "36px" : "14px",
              background: onDark ? "rgba(250,243,234,.06)" : "var(--surface-raised)",
              color: onDark ? "var(--text-inverse)" : "var(--text-primary)",
              border: `1px solid ${border}`,
            }}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            className="w-full h-[48px] px-3.5 font-sans text-[0.9375rem] leading-none rounded-none outline-none transition-colors duration-150"
            style={{
              paddingLeft: icon ? "36px" : "14px",
              background: onDark ? "rgba(250,243,234,.06)" : "var(--surface-raised)",
              color: onDark ? "var(--text-inverse)" : "var(--text-primary)",
              border: `1px solid ${border}`,
            }}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
      </span>
      {error ? (
        <span className="font-sans text-[0.75rem] text-[var(--danger)]">{error}</span>
      ) : hint ? (
        <span className="font-sans text-[0.75rem] text-[var(--text-muted)]">{hint}</span>
      ) : null}
    </label>
  );
}

export default Input;
