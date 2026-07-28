import { Icon } from "./Icon";

type Tone = "neutral" | "accent" | "jade" | "gold" | "success" | "warning" | "danger" | "info";
type Variant = "soft" | "solid" | "glass" | "outline";

const TONES: Record<Tone, { solidBg: string; solidOn: string; softBg: string; softOn: string }> = {
  neutral: { solidBg: "var(--surface-inverse)", solidOn: "var(--text-inverse)", softBg: "var(--surface-sunken)", softOn: "var(--text-secondary)" },
  accent: { solidBg: "var(--accent)", solidOn: "var(--accent-on)", softBg: "var(--accent-soft)", softOn: "var(--accent-active)" },
  jade: { solidBg: "var(--accent-2)", solidOn: "var(--accent-2-on)", softBg: "var(--accent-2-soft)", softOn: "var(--accent-2)" },
  gold: { solidBg: "var(--gold-500)", solidOn: "#2e2408", softBg: "var(--gold-50)", softOn: "var(--umber-700)" },
  success: { solidBg: "var(--success)", solidOn: "#fbfdfb", softBg: "var(--success-soft)", softOn: "var(--success)" },
  warning: { solidBg: "var(--warning)", solidOn: "#2e2408", softBg: "var(--warning-soft)", softOn: "var(--warning)" },
  danger: { solidBg: "var(--danger)", solidOn: "#fdfbf7", softBg: "var(--danger-soft)", softOn: "var(--danger)" },
  info: { solidBg: "var(--info)", solidOn: "#fbfdff", softBg: "var(--info-soft)", softOn: "var(--info)" },
};

export interface BadgeProps {
  children?: React.ReactNode;
  tone?: Tone;
  variant?: Variant;
  size?: "sm" | "md";
  icon?: string;
  dot?: boolean;
  uppercase?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Badge — nhãn trạng thái / marketing nhỏ đặt trên card và hàng danh sách.
 * "Khách yêu thích", "MỚI", "Đã xác minh". Không tương tác được.
 */
export function Badge({
  children,
  tone = "neutral",
  variant = "soft",
  size = "md",
  icon,
  dot = false,
  uppercase = false,
  style,
  className = "",
}: BadgeProps) {
  const t = TONES[tone] || TONES.neutral;
  const solid = variant === "solid";
  const glass = variant === "glass";
  const outline = variant === "outline";
  const iconSize = size === "sm" ? 12 : 13;

  return (
    <span
      className={`gh-badge ${className}`.trim()}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size === "sm" ? 4 : 5,
        height: size === "sm" ? 20 : 24,
        padding: size === "sm" ? "0 8px" : "0 10px",
        borderRadius: "var(--radius-pill)",
        fontFamily: "var(--font-sans)",
        fontSize: uppercase ? "var(--fs-micro)" : "var(--fs-caption)",
        fontWeight: "var(--fw-semibold)",
        letterSpacing: uppercase ? "var(--tracking-caps)" : "0.005em",
        textTransform: uppercase ? "uppercase" : "none",
        lineHeight: 1,
        whiteSpace: "nowrap",
        background: glass ? "var(--glass-bg)" : outline ? "transparent" : solid ? t.solidBg : t.softBg,
        color: glass ? "var(--text-primary)" : outline ? t.softOn : solid ? t.solidOn : t.softOn,
        border: outline ? `1px solid ${t.softOn}` : glass ? "1px solid var(--glass-border)" : "none",
        backdropFilter: glass ? "blur(var(--glass-blur)) saturate(1.3)" : undefined,
        WebkitBackdropFilter: glass ? "blur(var(--glass-blur)) saturate(1.3)" : undefined,
        boxShadow: glass ? "var(--shadow-sm)" : "none",
        ...style,
      }}
    >
      {dot ? (
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", flex: "none" }} />
      ) : null}
      {icon ? <Icon name={icon} size={iconSize} /> : null}
      {children != null ? <span>{children}</span> : null}
    </span>
  );
}

export default Badge;
