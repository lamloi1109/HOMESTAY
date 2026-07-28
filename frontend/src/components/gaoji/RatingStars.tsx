import { Icon } from "./Icon";

/** Số kiểu Việt: dấu phẩy thập phân, một chữ số ("4,9"). */
const vi = (n: number) => Number(n).toFixed(1).replace(".", ",");

export interface RatingStarsProps {
  value?: number;
  count?: number;
  variant?: "compact" | "stars";
  size?: number;
  showValue?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * RatingStars — tín hiệu đánh giá màu vàng. `compact` hiện một sao đặc + điểm
 * (thập phân dấu phẩy) + số lượt; `stars` hiện đủ năm sao.
 */
export function RatingStars({
  value = 5,
  count,
  variant = "compact",
  size = 15,
  showValue = true,
  style,
  className = "",
}: RatingStarsProps) {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontFamily: "var(--font-sans)",
    ...style,
  };

  if (variant === "stars") {
    const rounded = Math.round(value);
    return (
      <span className={`gh-rating ${className}`.trim()} style={base}>
        <span style={{ display: "inline-flex", gap: 2 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={i < rounded ? "gh-fill" : ""}
              style={{ color: i < rounded ? "var(--rating)" : "var(--border-strong)", display: "inline-flex" }}
            >
              <Icon name="star" size={size} />
            </span>
          ))}
        </span>
        {showValue ? (
          <span style={{ fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-semibold)", color: "var(--text-primary)", marginLeft: 3 }}>
            {vi(value)}
          </span>
        ) : null}
        {count != null ? (
          <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>({count})</span>
        ) : null}
      </span>
    );
  }

  return (
    <span className={`gh-rating ${className}`.trim()} style={base}>
      <span className="gh-fill" style={{ color: "var(--rating)", display: "inline-flex" }}>
        <Icon name="star" size={size} />
      </span>
      {showValue ? (
        <b style={{ fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-semibold)", color: "var(--text-primary)" }}>
          {vi(value)}
        </b>
      ) : null}
      {count != null ? (
        <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>· {count} đánh giá</span>
      ) : null}
    </span>
  );
}

export default RatingStars;
