import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { ApiError, fetchPropertyDetail, type Amenity } from "@/lib/api";
import { AmenityIcon } from "@/components/AmenityIcon";
import { BookingWidget } from "@/components/BookingWidget";
import { PropertyArt } from "@/components/PropertyArt";

export const dynamic = "force-dynamic";

function groupAmenities(amenities: Amenity[]): Map<string, Amenity[]> {
  const groups = new Map<string, Amenity[]>();
  for (const a of amenities) {
    const list = groups.get(a.group_name) ?? [];
    list.push(a);
    groups.set(a.group_name, list);
  }
  return groups;
}

export default async function PropertyDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ in?: string; out?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;

  let property;
  try {
    property = await fetchPropertyDetail(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    return (
      <main className="mx-auto max-w-4xl px-5 py-16">
        <p className="text-muted">
          Chưa kết nối được máy chủ — bật backend rồi tải lại trang.
        </p>
      </main>
    );
  }

  const location = [property.address, property.city].filter(Boolean).join(", ");
  const amenityGroups = groupAmenities(property.amenities);

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <div className="overflow-hidden rounded-3xl border border-line shadow-sm">
        <div className="aspect-[21/9]">
          <PropertyArt name={property.name} />
        </div>
      </div>

      <div className="mt-6">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {property.name}
        </h1>
        {location ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-muted">
            <MapPin className="h-4 w-4" aria-hidden />
            {location}
          </p>
        ) : null}
        {property.description ? (
          <p className="mt-4 max-w-2xl leading-relaxed">{property.description}</p>
        ) : null}
      </div>

      {amenityGroups.size > 0 ? (
        <section className="mt-8">
          <h2 className="text-xl font-bold">Tiện ích</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {[...amenityGroups.entries()].map(([group, items]) => (
              <div
                key={group}
                className="rounded-2xl border border-line bg-surface p-4"
              >
                <h3 className="text-sm font-semibold text-muted">{group}</h3>
                <ul className="mt-2 space-y-1.5">
                  {items.map((a) => (
                    <li key={a.code} className="flex items-center gap-2 text-sm">
                      <AmenityIcon icon={a.icon} className="h-4 w-4 text-terra" />
                      {a.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-8">
        <BookingWidget
          roomTypes={property.room_types}
          initialCheckIn={query.in}
          initialCheckOut={query.out}
        />
      </div>
    </main>
  );
}
