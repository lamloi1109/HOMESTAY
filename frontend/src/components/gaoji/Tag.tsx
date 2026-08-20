import React from "react";
import { Icon } from "./Icon";

export interface TagProps {
  children: React.ReactNode;
  icon?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Tag({ children, icon, className = "", style }: TagProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-2 bg-[var(--surface-raised)] border border-[var(--hairline-strong)] font-sans text-[0.875rem] text-[var(--text-body)] rounded-none ${className}`.trim()}
      style={style}
    >
      {icon && <Icon name={icon} size={15} color="var(--gold-900)" />}
      <span>{children}</span>
    </span>
  );
}

export default Tag;
