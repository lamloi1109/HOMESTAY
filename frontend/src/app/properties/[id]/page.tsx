import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import {
  ApiError,
  assetUrl,
  fetchPropertyDetail,
  type Amenity,
  type PropertyDetail,
} from "@/lib/api";
import { AmenityIcon } from "@/components/AmenityIcon";
import { BookingWidget } from "@/components/BookingWidget";
import { PropertyMedia } from "@/components/PropertyMedia";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

/** `cache` để generateMetadata và page dùng chung một lần gọi API, không gọi đôi. */
const loadProperty = cache(
  async (id: string): Promise<PropertyDetail | null> => {
    try {
      return await fetchPropertyDetail(id);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) return null;
      throw err;
    }
  },
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  let property: PropertyDetail | null = null;
  try {
    property = await loadProperty(id);
  } catch {
    return { title: "Chỗ ở" }; // backend chết — vẫn phải trả metadata hợp lệ
  }
  if (!property) return { title: "Không tìm thấy chỗ ở" };

  const location = [property.address, property.city].filter(Boolean).join(", ");
  const description =
    property.description ??
    (location
      ? `${property.name} tại ${location}. Đặt trực tiếp, tư vấn trước khi đặt.`
      : `${property.name}. Đặt trực tiếp, tư vấn trước khi đặt.`);
  const cover = property.images[0]?.url;
  const path = `/properties/${property.id}`;

  return {
    title: property.name,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      siteName: SITE_NAME,
      title: property.name,
      description,
      url: path,
      // Ảnh serve từ backend nên phải là URL tuyệt đối, metadataBase không lo được.
      images: cover ? [{ url: assetUrl(cover), alt: property.images[0]?.alt ?? property.name }] : undefined,
    },
  };
}

/** Khoảng giá cho JSON-LD. Chỉ một mức giá thì ghi một số, không ghi "X - X". */
function priceRange(prices: number[]): string {
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const vnd = (n: number) => `${n.toLocaleString("vi-VN")}₫`;
  return min === max ? vnd(min) : `${vnd(min)} - ${vnd(max)}`;
}

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

  let property: PropertyDetail | null;
  try {
    property = await loadProperty(id);
  } catch {
    return (
      <main className="mx-auto max-w-4xl px-5 py-16">
        <p className="text-muted">
          Chưa kết nối được máy chủ — bật backend rồi tải lại trang.
        </p>
      </main>
    );
  }
  if (!property) notFound();

  const location = [property.address, property.city].filter(Boolean).join(", ");
  const amenityGroups = groupAmenities(property.amenities);
  const prices = property.room_types.map((rt) => Number(rt.base_price)).filter(Number.isFinite);

  // Dữ liệu có cấu trúc cho Google — giúp hiện dạng kết quả giàu thông tin.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: property.name,
    description: property.description ?? undefined,
    url: `${SITE_URL}/properties/${property.id}`,
    image: property.images.map((img) => assetUrl(img.url)),
    address: location
      ? {
          "@type": "PostalAddress",
          streetAddress: property.address ?? undefined,
          addressLocality: property.city ?? undefined,
          addressCountry: "VN",
        }
      : undefined,
    priceRange: prices.length ? priceRange(prices) : undefined,
    amenityFeature: property.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a.name,
      value: true,
    })),
  };

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <script
        type="application/ld+json"
        // Dữ liệu tự sinh từ DB của mình, không phải input người dùng ngoài.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="overflow-hidden rounded-3xl border border-line shadow-sm">
        <div className="aspect-[21/9]">
          <PropertyMedia
            name={property.name}
            imagePath={property.images[0]?.url}
            alt={property.images[0]?.alt}
          />
        </div>
      </div>
      {property.images.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {property.images.slice(1, 5).map((img) => (
            <div
              key={img.id}
              className="aspect-[4/3] overflow-hidden rounded-xl border border-line"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={assetUrl(img.url)}
                alt={img.alt ?? property.name}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : null}

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
