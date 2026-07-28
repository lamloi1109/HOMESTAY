import {
  ArrowRight,
  BadgeCheck,
  Bath,
  BedDouble,
  CalendarCheck,
  CookingPot,
  DoorOpen,
  Heart,
  Images,
  LoaderCircle,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * Icon — bản chuyển của `components/core/Icon` trong design system Gaoji House.
 *
 * ĐÂY LÀ BẢN CHUYỂN, KHÔNG PHẢI BẢN SAO. Bản gốc nạp Lucide từ CDN
 * (unpkg.com/lucide) rồi bơm SVG bằng innerHTML trong useEffect. Trong Next.js
 * cách đó hỏng hai thứ: server render ra thẻ rỗng nên Google không thấy icon
 * (trang này sống bằng SEO), và thêm một request ra CDN ngoài. Bản này dùng
 * `lucide-react` đã có sẵn trong dự án nên render được cả phía server.
 *
 * Giao diện prop giữ nguyên như bản gốc (`name` dạng kebab-case) để các
 * component khác của design system dùng lại không phải sửa.
 *
 * Thêm icon mới: import ở trên rồi khai báo trong REGISTRY. Cố ý liệt kê tay
 * thay vì `import *` để bundle chỉ chứa icon thật sự dùng.
 */
const REGISTRY: Record<string, LucideIcon> = {
  "arrow-right": ArrowRight,
  "badge-check": BadgeCheck,
  bath: Bath,
  "bed-double": BedDouble,
  "calendar-check": CalendarCheck,
  "cooking-pot": CookingPot,
  "door-open": DoorOpen,
  heart: Heart,
  images: Images,
  "loader-circle": LoaderCircle,
  "map-pin": MapPin,
  phone: Phone,
  search: Search,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  star: Star,
  users: Users,
};

export interface IconProps {
  name?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  /** Có label thì icon mang nghĩa (role="img"); không có thì ẩn với screen reader. */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Icon({
  name,
  size = 20,
  strokeWidth = 1.5,
  color,
  label,
  className = "",
  style,
}: IconProps) {
  const Glyph = name ? REGISTRY[name] : undefined;

  // Tên lạ thì không vẽ gì — thà thiếu icon còn hơn vẽ nhầm glyph khác nghĩa.
  if (!Glyph) {
    if (process.env.NODE_ENV !== "production" && name) {
      console.warn(`[gaoji/Icon] chưa đăng ký icon "${name}" — thêm vào REGISTRY.`);
    }
    return null;
  }

  return (
    <span
      className={`gh-icon ${className}`.trim()}
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      style={{
        display: "inline-flex",
        width: size,
        height: size,
        lineHeight: 0,
        color: color || "inherit",
        flex: "none",
        ...style,
      }}
    >
      <Glyph size={size} strokeWidth={strokeWidth} style={{ display: "block" }} />
    </span>
  );
}

export default Icon;
