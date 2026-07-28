import Link from "next/link";
import { fetchProperties, fetchPropertyDetail, type Property } from "@/lib/api";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyMedia } from "@/components/PropertyMedia";
import { SearchBar } from "@/components/SearchBar";
import { Card } from "@/components/gaoji/Card";
import { Icon } from "@/components/gaoji/Icon";

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

/**
 * Ba điểm tin cậy. Cố ý chỉ nói những điều ĐÚNG với cách vận hành hiện tại —
 * không hứa "xác nhận tức thì" hay "hoàn tiền" như bản OTA của design system,
 * vì hệ thống chưa làm được. Chị chủ cần duyệt lại câu chữ trước khi lên thật.
 */
const TRUST = [
  {
    icon: "shield-check",
    title: "Đặt trực tiếp với chủ nhà",
    body: "Không qua sàn trung gian nên không có phụ phí nền tảng cộng thêm vào giá.",
  },
  {
    icon: "phone",
    title: "Tư vấn trước khi đặt",
    body: "Gọi hoặc nhắn để hỏi kỹ về phòng, đường đi và giờ nhận phòng trước khi quyết định.",
  },
  {
    icon: "badge-check",
    title: "Giá niêm yết rõ ràng",
    body: "Giá theo đêm hiển thị ngay trên trang, không phải liên hệ mới biết.",
  },
];

const HERO_CHIPS = [
  { icon: "shield-check", label: "Đặt trực tiếp" },
  { icon: "phone", label: "Tư vấn tận tình" },
  { icon: "badge-check", label: "Giá rõ ràng" },
];

export default async function Home() {
  const featured = await loadFeatured();
  const hero = featured?.[0]?.property;
  const heroCity = hero?.city ?? "Đà Lạt";

  return (
    <main
      style={{
        maxWidth: "var(--container-max)",
        margin: "0 auto",
        padding: "0 var(--page-gutter)",
      }}
    >
      {/* ── Hero ───────────────────────────────────────────── */}
      <section style={{ padding: "var(--section-y) 0 var(--space-xl)" }}>
        <div className="grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-12">
          <div>
            <div
              style={{
                fontSize: "var(--fs-caption)",
                fontWeight: "var(--fw-semibold)",
                letterSpacing: "var(--tracking-caps)",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: 18,
              }}
            >
              Homestay · Việt Nam
            </div>

            {/* Chữ thường theo quy tắc của design system — tiếng Việt không viết hoa đầu từ. */}
            <h1
              className="gh-display"
              style={{
                fontSize: "var(--fs-display-xl)",
                fontWeight: "var(--fw-medium)",
                lineHeight: 1.02,
              }}
            >
              Tìm nơi trú ẩn
              <br />
              hoàn hảo của bạn.
            </h1>

            <p
              style={{
                margin: "20px 0 0",
                maxWidth: 440,
                fontSize: "var(--fs-body-lg)",
                lineHeight: 1.6,
                color: "var(--text-body)",
              }}
            >
              Khám phá những không gian ấm áp, mang đậm chất liệu tự nhiên và bản sắc mộc
              mạc khắp Việt Nam.
            </p>

            <div className="mt-6 flex flex-wrap gap-[18px]">
              {HERO_CHIPS.map((c) => (
                <span
                  key={c.label}
                  className="inline-flex items-center gap-[7px]"
                  style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)" }}
                >
                  <Icon name={c.icon} size={17} color="var(--accent-2)" />
                  {c.label}
                </span>
              ))}
            </div>
          </div>

          <div
            className="gh-noise relative overflow-hidden"
            style={{
              aspectRatio: "4 / 4.4",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <PropertyMedia
              name={hero?.name ?? "Gaoji House"}
              imagePath={hero?.cover_image}
            />
            <div style={{ position: "absolute", left: 16, bottom: 16, zIndex: 2 }}>
              <div
                className="gh-glass inline-flex flex-col"
                style={{ padding: "10px 16px", borderRadius: "var(--radius-md)" }}
              >
                <span
                  className="gh-serif"
                  style={{ fontWeight: "var(--fw-semibold)", fontSize: 19, color: "var(--text-primary)" }}
                >
                  {heroCity}
                </span>
                <span style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                  {hero?.name ?? "Chỗ nghỉ giữa đồi thông"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="w-full" style={{ maxWidth: 860 }}>
            <SearchBar />
          </div>
        </div>
      </section>

      {/* ── Chỗ nghỉ nổi bật ───────────────────────────────── */}
      <section style={{ marginTop: "var(--section-y)" }}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="gh-eyebrow">Tuyển chọn</div>
            <h2
              className="gh-display mt-2"
              style={{ fontSize: "var(--fs-display-md)", fontWeight: "var(--fw-medium)" }}
            >
              Trải nghiệm nổi bật
            </h2>
          </div>
          <Link
            href="/properties"
            className="inline-flex shrink-0 items-center gap-1.5"
            style={{ fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-semibold)" }}
          >
            Xem tất cả
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>

        {featured === null ? (
          <Card variant="flat" radius="md" padding="var(--space-lg)" style={{ marginTop: "var(--space-lg)" }}>
            <p style={{ fontWeight: "var(--fw-semibold)", color: "var(--text-primary)" }}>
              Chưa kết nối được máy chủ.
            </p>
            <p style={{ marginTop: 4, fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>
              Bật backend rồi tải lại trang:{" "}
              <code style={{ fontFamily: "var(--font-mono)" }}>
                docker compose up -d db · uvicorn app.main:app --reload
              </code>
            </p>
          </Card>
        ) : featured.length === 0 ? (
          <p style={{ marginTop: "var(--space-lg)", color: "var(--text-muted)" }}>
            Chưa có chỗ ở nào được đăng. Chạy{" "}
            <code style={{ fontFamily: "var(--font-mono)" }}>python -m app.seed --demo</code> để
            có dữ liệu mẫu.
          </p>
        ) : (
          <div
            className="grid"
            style={{
              marginTop: "var(--space-lg)",
              gridTemplateColumns: "repeat(auto-fill, minmax(248px, 1fr))",
              gap: "var(--space-lg)",
            }}
          >
            {featured.map(({ property, minPrice }) => (
              <PropertyCard key={property.id} property={property} minPrice={minPrice} />
            ))}
          </div>
        )}
      </section>

      {/* ── Dải tin cậy ────────────────────────────────────── */}
      <section style={{ margin: "var(--section-y) 0" }}>
        <Card variant="sunken" radius="xl" padding="var(--space-2xl)" grain>
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2
              className="gh-display"
              style={{
                marginBottom: "var(--space-xl)",
                fontSize: "var(--fs-display-md)",
                fontWeight: "var(--fw-medium)",
              }}
            >
              Vì sao đặt trực tiếp
            </h2>
            <div
              className="grid"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "var(--space-xl)",
              }}
            >
              {TRUST.map((f) => (
                <div key={f.title}>
                  <span
                    className="mb-3.5 inline-flex items-center justify-center"
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: "var(--radius-circle)",
                      background: "var(--accent-soft)",
                      color: "var(--accent)",
                    }}
                  >
                    <Icon name={f.icon} size={22} />
                  </span>
                  <h3
                    style={{
                      marginBottom: 6,
                      fontSize: "var(--fs-h4)",
                      fontWeight: "var(--fw-semibold)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "var(--fs-body-sm)",
                      lineHeight: 1.6,
                      color: "var(--text-body)",
                    }}
                  >
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}
