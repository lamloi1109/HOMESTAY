import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Bath,
  Bed,
  BedDouble,
  Building,
  Calendar,
  CalendarCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  CookingPot,
  Copy,
  DoorOpen,
  Eye,
  Filter,
  Heart,
  Images,
  Info,
  LoaderCircle,
  Mail,
  MapPin,
  Maximize2,
  MessageCircle,
  MessageSquare,
  Moon,
  Phone,
  Search,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Sun,
  Tv,
  Users,
  Wifi,
  X,
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
  "alert-triangle": AlertTriangle,
  "arrow-right": ArrowRight,
  "badge-check": BadgeCheck,
  bath: Bath,
  bed: Bed,
  "bed-double": BedDouble,
  building: Building,
  calendar: Calendar,
  "calendar-check": CalendarCheck,
  check: Check,
  "chevron-down": ChevronDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  clock: Clock,
  "cooking-pot": CookingPot,
  copy: Copy,
  "door-open": DoorOpen,
  eye: Eye,
  filter: Filter,
  heart: Heart,
  images: Images,
  info: Info,
  "loader-circle": LoaderCircle,
  mail: Mail,
  "map-pin": MapPin,
  "maximize-2": Maximize2,
  "message-circle": MessageCircle,
  "message-square": MessageSquare,
  moon: Moon,
  phone: Phone,
  search: Search,
  "share-2": Share2,
  "shield-check": ShieldCheck,
  "sliders-horizontal": SlidersHorizontal,
  sparkles: Sparkles,
  star: Star,
  sun: Sun,
  tv: Tv,
  users: Users,
  wifi: Wifi,
  x: X,
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
