import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

/** Chiều cao nav — layout chừa đúng khoảng này vì nav ở chế độ fixed. */
export const NAV_HEIGHT = 68;

const LINKS = [
  { href: "/properties", label: "Khám phá" },
  { href: "/lookup", label: "Tra cứu đặt phòng" },
];

/**
 * Nav cố định nền kính mờ, theo thiết kế trang chủ Gaoji House.
 *
 * Thiết kế gốc còn có nút Đăng nhập / Đăng ký và mục "Chủ nhà" — chưa dựng vì
 * hệ thống chưa có tài khoản cho khách. Nút bấm vào không làm gì thì tệ hơn là
 * không có nút.
 */
export function Header() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: "var(--glass-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--glass-border)",
      }}
    >
      <div
        className="mx-auto flex items-center justify-between gap-4"
        style={{
          maxWidth: "var(--container-max)",
          padding: "0 clamp(16px, 4vw, 48px)",
          height: NAV_HEIGHT,
        }}
      >
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          style={{ color: "inherit" }}
        >
          <span
            className="flex items-center justify-center"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "var(--accent)",
              color: "var(--accent-on)",
              fontFamily: "var(--font-display)",
              fontSize: 18,
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
              fontSize: "1.2rem",
              fontWeight: "var(--fw-semibold)",
              color: "var(--text-primary)",
              letterSpacing: "-.02em",
            }}
          >
            Gaoji House
          </span>
        </Link>

        <nav className="hidden items-center gap-7 sm:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="gh-nav-link"
              style={{
                fontSize: "var(--fs-body-sm)",
                fontWeight: "var(--fw-medium)",
                color: "var(--text-secondary)",
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
