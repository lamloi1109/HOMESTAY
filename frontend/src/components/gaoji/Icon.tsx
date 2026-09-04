import {
  AirVent,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bath,
  Bed,
  BedDouble,
  Building,
  Calendar,
  CalendarCheck,
  Car,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Compass,
  CookingPot,
  Copy,
  CreditCard,
  DoorOpen,
  Dumbbell,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Footprints,
  Heart,
  Images,
  Info,
  Key,
  LoaderCircle,
  LogOut,
  Mail,
  Map,
  MapPin,
  Maximize2,
  Menu,
  MessageCircle,
  MessageSquare,
  Moon,
  Phone,
  PhoneCall,
  Search,
  Send,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Sun,
  Train,
  Tv,
  User,
  Users,
  Wifi,
  Wine,
  X,
  type LucideIcon,
} from "lucide-react";
import React from "react";

const REGISTRY: Record<string, LucideIcon> = {
  "air-vent": AirVent,
  "alert-triangle": AlertTriangle,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "badge-check": BadgeCheck,
  bath: Bath,
  bed: Bed,
  "bed-double": BedDouble,
  building: Building,
  calendar: Calendar,
  "calendar-check": CalendarCheck,
  car: Car,
  check: Check,
  "check-circle": CheckCircle,
  "chevron-down": ChevronDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  clock: Clock,
  coffee: Coffee,
  compass: Compass,
  "cooking-pot": CookingPot,
  copy: Copy,
  "credit-card": CreditCard,
  "door-open": DoorOpen,
  dumbbell: Dumbbell,
  eye: Eye,
  "eye-off": EyeOff,
  "file-text": FileText,
  filter: Filter,
  footprints: Footprints,
  heart: Heart,
  images: Images,
  info: Info,
  key: Key,
  "loader-circle": LoaderCircle,
  "log-out": LogOut,
  mail: Mail,
  map: Map,
  "map-pin": MapPin,
  "maximize-2": Maximize2,
  menu: Menu,
  "message-circle": MessageCircle,
  "message-square": MessageSquare,
  moon: Moon,
  phone: Phone,
  "phone-call": PhoneCall,
  search: Search,
  send: Send,
  "share-2": Share2,
  "shield-check": ShieldCheck,
  "sliders-horizontal": SlidersHorizontal,
  sparkles: Sparkles,
  star: Star,
  sun: Sun,
  train: Train,
  tv: Tv,
  user: User,
  users: Users,
  wifi: Wifi,
  wine: Wine,
  x: X,
};

export interface IconProps {
  name?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
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

  if (!Glyph) {
    if (process.env.NODE_ENV !== "production" && name) {
      console.warn(`[gaoji/Icon] icon "${name}" not found in REGISTRY.`);
    }
    return null;
  }

  return (
    <span
      className={`inline-flex shrink-0 leading-none ${className}`.trim()}
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      style={{
        width: size,
        height: size,
        color: color || "inherit",
        ...style,
      }}
    >
      <Glyph size={size} strokeWidth={strokeWidth} style={{ display: "block" }} />
    </span>
  );
}

export default Icon;
