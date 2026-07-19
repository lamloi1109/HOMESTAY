import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Property } from "@/lib/api";
import { formatVnd } from "@/lib/format";
import { PropertyMedia } from "@/components/PropertyMedia";

export function PropertyCard({
  property,
  minPrice,
  searchQuery = "",
}: {
  property: Property;
  minPrice?: number | null;
  searchQuery?: string;
}) {
  const location = [property.address, property.city].filter(Boolean).join(", ");
  return (
    <Link
      href={`/properties/${property.id}${searchQuery}`}
      className="group overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <PropertyMedia
          name={property.name}
          imagePath={property.cover_image}
          className="transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="space-y-1.5 p-4">
        <h3 className="font-semibold leading-snug">{property.name}</h3>
        {location ? (
          <p className="flex items-center gap-1 text-sm text-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {location}
          </p>
        ) : null}
        {minPrice != null ? (
          <p className="pt-1 text-sm">
            <span className="font-bold text-terra">{formatVnd(minPrice)}</span>
            <span className="text-muted"> / đêm</span>
          </p>
        ) : null}
      </div>
    </Link>
  );
}
