import React from "react";
import { Icon } from "./Icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "gold" | "jade" | "outline" | "ghost" | "danger" | "onDark" | "clay";
  size?: "sm" | "md" | "lg";
  icon?: string;
  iconAfter?: string;
  full?: boolean;
  as?: React.ElementType;
  href?: string;
  target?: string;
  rel?: string;
  children?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconAfter,
  full = false,
  as,
  href,
  target,
  rel,
  children,
  className = "",
  style,
  disabled,
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary: "bg-[var(--ink-900)] text-[var(--gold-050)] border border-[var(--gold-700)] hover:bg-[var(--jade-900)]",
    gold: "bg-[var(--gold-500)] text-[var(--ink-900)] border border-[var(--gold-500)] hover:bg-[var(--gold-600)]",
    jade: "bg-[var(--jade-700)] text-[var(--paper-150)] border border-[var(--jade-700)] hover:bg-[var(--jade-900)]",
    outline: "bg-transparent text-[var(--text-primary)] border border-[var(--hairline-strong)] hover:border-[var(--gold-700)] hover:text-[var(--gold-900)]",
    onDark: "bg-[rgba(250,243,234,0.08)] text-[var(--gold-050)] border border-[rgba(212,175,55,0.5)] hover:bg-[var(--gold-500)] hover:text-[var(--ink-900)]",
    clay: "bg-[var(--clay-500)] text-white border border-[var(--clay-500)] hover:bg-[var(--clay-700)]",
    ghost: "bg-transparent text-[var(--text-primary)] border-0 hover:text-[var(--gold-900)]",
    danger: "bg-[var(--danger)] text-white border border-[var(--danger)] hover:opacity-90",
  };

  const sizeStyles = {
    sm: "min-h-[40px] px-3.5 text-[0.75rem]",
    md: "min-h-[46px] px-4 text-[0.8125rem]",
    lg: "min-h-[52px] px-6 text-[0.875rem]",
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2.5 font-sans font-semibold uppercase tracking-[0.15em]
    transition-colors duration-150 cursor-pointer select-none rounded-none no-underline
    ${full ? "w-full" : "w-auto"}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
    ${className}
  `.trim();

  const content = (
    <>
      {icon && <Icon name={icon} size={size === "sm" ? 15 : size === "lg" ? 18 : 16} />}
      <span>{children}</span>
      {iconAfter && <Icon name={iconAfter} size={size === "sm" ? 15 : size === "lg" ? 18 : 16} />}
    </>
  );

  const Component = as || (href ? "a" : "button");

  return (
    <Component
      href={href}
      target={target}
      rel={rel}
      disabled={disabled}
      className={baseClasses}
      style={style}
      {...props}
    >
      {content}
    </Component>
  );
}

export default Button;
