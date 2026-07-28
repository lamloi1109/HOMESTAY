import Link from "next/link";

/**
 * Footer theo thiết kế trang chủ Gaoji House.
 *
 * Thiết kế gốc có 4 cột với 12 link (Flash Sale, Đăng phòng, Chính sách hoa
 * hồng, Chính sách huỷ, Điều khoản, Bảo mật…) và 3 nút mạng xã hội. Ở đây chỉ
 * để những link có trang thật — link chết trong footer vừa hại SEO vừa làm
 * khách mất lòng tin. Có nội dung thật thì thêm cột vào là khớp lại thiết kế.
 */
const EXPLORE = [
  { href: "/", label: "Trang chủ" },
  { href: "/properties", label: "Chỗ ở" },
  { href: "/lookup", label: "Tra cứu đặt phòng" },
];

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-subtle)",
        background: "var(--surface)",
        padding: "clamp(40px,6vw,64px) clamp(16px,4vw,48px) clamp(24px,4vw,40px)",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: "var(--container-max)" }}>
        <div className="grid gap-10 sm:grid-cols-[2fr_1fr]">
          <div>
            <div className="mb-3.5 flex items-center gap-2.5">
              <span
                className="flex items-center justify-center"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: "var(--accent)",
                  color: "var(--accent-on)",
                  fontFamily: "var(--font-display)",
                  fontSize: 16,
                  fontWeight: "var(--fw-semibold)",
                  lineHeight: 1,
                }}
                aria-hidden
              >
                G
              </span>
              <span
                className="gh-serif"
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "var(--fw-semibold)",
                  color: "var(--text-primary)",
                  letterSpacing: "-.01em",
                }}
              >
                Gaoji House
              </span>
            </div>
            <p
              style={{
                fontSize: 13.5,
                color: "var(--text-muted)",
                lineHeight: 1.65,
                maxWidth: 260,
              }}
            >
              Chỗ nghỉ ấm áp, đặt trực tiếp với chủ nhà.
            </p>
          </div>

          <div>
            <h2
              style={{
                fontSize: 12,
                fontWeight: "var(--fw-bold)",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: 14,
              }}
            >
              Khám phá
            </h2>
            <div className="flex flex-col gap-2.5">
              {EXPLORE.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  style={{ fontSize: 13.5, color: "var(--text-secondary)" }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div
          className="mt-9 flex flex-wrap items-center justify-between gap-2.5 pt-5"
          style={{
            borderTop: "1px solid var(--border-subtle)",
            fontSize: 12.5,
            color: "var(--text-muted)",
          }}
        >
          <span>© 2026 Gaoji House · Tất cả quyền được bảo lưu</span>
          <span>Tiếng Việt · VND ₫</span>
        </div>
      </div>
    </footer>
  );
}
