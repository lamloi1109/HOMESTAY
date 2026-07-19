import {
  AirVent,
  ArrowUpDown,
  Bed,
  Car,
  ChefHat,
  Coffee,
  Flame,
  Laptop,
  Microwave,
  PawPrint,
  Projector,
  Refrigerator,
  Shield,
  ShowerHead,
  Sparkles,
  Sun,
  Tv,
  WashingMachine,
  Waves,
  Wifi,
  Wind,
  type LucideIcon,
} from "lucide-react";

// Map theo cột amenities.icon trong DB (seed ở backend/app/seed.py).
const ICONS: Record<string, LucideIcon> = {
  wifi: Wifi,
  "air-vent": AirVent,
  "shower-head": ShowerHead,
  tv: Tv,
  bed: Bed,
  "chef-hat": ChefHat,
  refrigerator: Refrigerator,
  microwave: Microwave,
  coffee: Coffee,
  "washing-machine": WashingMachine,
  wind: Wind,
  car: Car,
  sun: Sun,
  waves: Waves,
  flame: Flame,
  projector: Projector,
  laptop: Laptop,
  "arrow-up-down": ArrowUpDown,
  shield: Shield,
  "paw-print": PawPrint,
};

export function AmenityIcon({
  icon,
  className = "h-4 w-4",
}: {
  icon: string | null;
  className?: string;
}) {
  const Icon = (icon && ICONS[icon]) || Sparkles;
  return <Icon className={className} aria-hidden />;
}
