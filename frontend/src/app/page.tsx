import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchProperties, fetchPropertyDetail, type Property } from "@/lib/api";
import { PropertyArt } from "@/components/PropertyArt";
import { PropertyCard } from "@/components/PropertyCard";
import { SearchBar } from "@/components/SearchBar";

export const dynamic = "force-dynamic";

interface Featured {
  property: Property;
  minPrice: number | null;
}

async function loadFeatured(): Promise<Featured[] | null> {
  try {
    const properties = await fetchProperties();
    return await Promise.all(
      properties.slice(0, 6).map(async (property) => {
        try {
          const detail = await fetchPropertyDetail(property.id);
          const prices = detail.room_types.map((rt) => Number(rt.base_price));
          return {
            property,
            minPrice: prices.length ? Math.min(...prices) : null,
          };
        } catch {
          return { property, minPrice: null };
        }
      }),
    );
  } catch {
    return null; // backend chưa chạy
  }
}

export default async function Home() {
  const featured = await loadFeatured();

  return (
    <main className="mx-auto max-w-6xl px-5">
      {/* Hero */}
      <section className="grid items-center gap-10 py-12 md:grid-cols-2 md:py-16">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            Tìm Nơi Trú Ẩn
            <br />
            <span className="text-terra">Hoàn Hảo Của Bạn.</span>
          </h1>
          <p className="mt-4 max-w-md text-muted">
            Khám phá những không gian ấm áp, mang đậm chất liệu tự nhiên và bản
            sắc mộc mạc khắp Việt Nam.
          </p>
          <div className="mt-6">
            <SearchBar />
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-line shadow-sm">
          <div className="aspect-[4/3]">
            <PropertyArt name="Homestay Việt Nam" />
          </div>
        </div>
      </section>

      {/* Danh sách nổi bật */}
      <section className="py-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold">Trải Nghiệm Nổi Bật</h2>
          <Link
            href="/properties"
            className="flex items-center gap-1 text-sm font-medium text-terra hover:text-terra-deep"
          >
            Xem tất cả <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        {featured === null ? (
          <div className="mt-6 rounded-2xl border border-line bg-surface p-6 text-sm">
            <p className="font-semibold">Chưa kết nối được máy chủ.</p>
            <p className="mt-1 text-muted">
              Bật backend rồi tải lại trang:{" "}
              <code className="font-mono">
                docker compose up -d db · uvicorn app.main:app --reload
              </code>
            </p>
          </div>
        ) : featured.length === 0 ? (
          <p className="mt-6 text-muted">
            Chưa có chỗ ở nào được đăng. Chạy{" "}
            <code className="font-mono">python -m app.seed --demo</code> để có dữ
            liệu mẫu.
          </p>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map(({ property, minPrice }) => (
              <PropertyCard
                key={property.id}
                property={property}
                minPrice={minPrice}
              />
            ))}
          </div>
        )}
      </section>

      {/* Banner ưu đãi */}
      <section className="py-8">
        <div className="relative overflow-hidden rounded-3xl bg-terra p-8 text-white md:p-10">
          <span className="inline-block rounded-lg bg-white/20 px-3 py-1 text-xs font-semibold tracking-wide">
            ƯU ĐÃI MÙA HÈ
          </span>
          <h2 className="mt-3 text-2xl font-extrabold md:text-3xl">
            Giảm 20% cho chuyến đi dài ngày
          </h2>
          <p className="mt-1 text-white/85">
            Áp dụng cho các đặt phòng từ 3 đêm trở lên.
          </p>
          <Link
            href="/properties"
            className="mt-5 inline-block rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-terra transition-colors hover:bg-wash"
          >
            Khám phá ngay
          </Link>
          <svg
            className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 opacity-20"
            viewBox="0 0 100 100"
            aria-hidden
          >
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <ellipse
                key={deg}
                cx="50"
                cy="30"
                rx="12"
                ry="20"
                fill="white"
                transform={`rotate(${deg} 50 50)`}
              />
            ))}
            <circle cx="50" cy="50" r="8" fill="white" />
          </svg>
        </div>
      </section>
    </main>
  );
}
