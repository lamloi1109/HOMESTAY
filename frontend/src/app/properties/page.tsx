import { fetchProperties, fetchPropertyDetail } from "@/lib/api";
import { PropertyCard } from "@/components/PropertyCard";
import { SearchBar } from "@/components/SearchBar";

export const dynamic = "force-dynamic";

export const metadata = { title: "Chỗ ở — Gaoji House" };

function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; in?: string; out?: string }>;
}) {
  const params = await searchParams;
  const city = params.city ?? "";
  const checkIn = params.in ?? "";
  const checkOut = params.out ?? "";

  let properties = null;
  try {
    properties = await fetchProperties();
  } catch {
    properties = null;
  }

  const filtered =
    properties?.filter((p) => {
      if (!city) return true;
      const haystack = normalize(`${p.name} ${p.city ?? ""} ${p.address ?? ""}`);
      return haystack.includes(normalize(city));
    }) ?? [];

  const withPrices = await Promise.all(
    filtered.map(async (property) => {
      try {
        const detail = await fetchPropertyDetail(property.id);
        const prices = detail.room_types.map((rt) => Number(rt.base_price));
        return { property, minPrice: prices.length ? Math.min(...prices) : null };
      } catch {
        return { property, minPrice: null };
      }
    }),
  );

  const forwardQuery =
    checkIn && checkOut ? `?in=${checkIn}&out=${checkOut}` : "";

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Chỗ ở</h1>
      <div className="mt-5">
        <SearchBar
          initialCity={city}
          initialCheckIn={checkIn}
          initialCheckOut={checkOut}
        />
      </div>

      {properties === null ? (
        <p className="mt-8 text-muted">
          Chưa kết nối được máy chủ — bật backend rồi tải lại trang.
        </p>
      ) : withPrices.length === 0 ? (
        <p className="mt-8 text-muted">
          {city
            ? `Chưa có chỗ ở nào khớp “${city}”. Thử từ khóa khác nhé.`
            : "Chưa có chỗ ở nào được đăng."}
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {withPrices.map(({ property, minPrice }) => (
            <PropertyCard
              key={property.id}
              property={property}
              minPrice={minPrice}
              searchQuery={forwardQuery}
            />
          ))}
        </div>
      )}
    </main>
  );
}
