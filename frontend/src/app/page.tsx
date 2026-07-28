import Link from "next/link";
import { fetchProperties, fetchPropertyDetail, type Property } from "@/lib/api";
import { PropertyMedia } from "@/components/PropertyMedia";
import { HeroSearch } from "@/components/HeroSearch";
import { NAV_HEIGHT } from "@/components/Header";
import { Icon } from "@/components/gaoji/Icon";
import { formatVnd } from "@/lib/format";

export const dynamic = "force-dynamic";

interface Featured {
  property: Property;
  minPrice: number | null;
}

async function loadFeatured(): Promise<Featured[] | null> {
  try {
    const properties = await fetchProperties();
    return await Promise.all(
      properties.slice(0, 4).map(async (property) => {
        try {
          const detail = await fetchPropertyDetail(property.id);
          const prices = detail.room_types.map((rt) => Number(rt.base_price));
          return { property, minPrice: prices.length ? Math.min(...prices) : null };
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
 * Dải tin cậy. Thiết kế gốc ghi "Xác nhận tức thì", "Tự nhận phòng 24/7 · mã
 * PIN khoá thông minh", "Miễn phí huỷ 24 giờ · hoàn tiền 100%" — hệ thống
 * không có tính năng nào trong số đó, nên thay bằng điều đúng với thực tế.
 */
const TRUST = [
  {
    icon: "shield-check",
    tint: "var(--accent-soft)",
    color: "var(--accent)",
    title: "Đặt trực tiếp với chủ nhà",
    sub: "Không phụ phí nền tảng",
  },
  {
    icon: "phone",
    tint: "var(--success-soft)",
    color: "var(--success)",
    title: "Tư vấn trước khi đặt",
    sub: "Hỏi kỹ rồi hãy quyết",
  },
  {
    icon: "badge-check",
    tint: "var(--info-soft)",
    color: "var(--info)",
    title: "Giá niêm yết rõ ràng",
    sub: "Xem giá ngay trên trang",
  },
];

export default async function Home() {
  const featured = await loadFeatured();
  const hero = featured?.[0]?.property;
  const heroCity = hero?.city ?? "Việt Nam";

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      {/* Kéo ngược lên dưới nav để dải gradient chạy hết sau lớp kính mờ,
          rồi chừa lại đúng chiều cao nav cho phần nội dung. */}
      <section
        className="relative flex flex-col overflow-hidden"
        style={{
          minHeight: "min(100vh, 860px)",
          marginTop: -NAV_HEIGHT,
          paddingTop: NAV_HEIGHT,
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            zIndex: 0,
            background:
              "linear-gradient(148deg,#BC5B3A 0%,#CB744F 16%,#D6A485 30%,#EAE0D0 50%,#DEE8E0 68%,#5A8070 100%)",
          }}
        />
        <div aria-hidden className="gh-noise absolute inset-0" style={{ zIndex: 1 }} />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{
            height: "45%",
            zIndex: 1,
            background: "linear-gradient(to top,rgba(21,17,11,.18) 0%,transparent 100%)",
          }}
        />

        <div className="relative flex flex-1 items-end" style={{ zIndex: 2 }}>
          <div
            className="mx-auto w-full"
            style={{
              maxWidth: "var(--container-max)",
              padding:
                "clamp(40px,6vw,72px) clamp(16px,4vw,48px) clamp(52px,7vw,88px)",
            }}
          >
            <div
              className="gh-au gh-au-1 mb-5 inline-flex items-center gap-2"
              style={{
                background: "rgba(251,249,243,.16)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,.26)",
                borderRadius: "var(--radius-pill)",
                padding: "5px 14px",
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#FBF9F3",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: "var(--fw-semibold)",
                  color: "rgba(251,249,243,.9)",
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                }}
              >
                Homestay · {heroCity}
              </span>
            </div>

            <h1
              className="gh-au gh-au-2 gh-serif mb-3.5"
              style={{
                fontSize: "clamp(2.6rem,7.5vw,5.5rem)",
                lineHeight: 1.03,
                letterSpacing: "-.025em",
                color: "#FBF9F3",
                maxWidth: 680,
                fontWeight: "var(--fw-regular)",
              }}
            >
              Nghỉ dưỡng đẳng cấp
              <br />
              <em
                style={{
                  fontStyle: "italic",
                  fontWeight: "var(--fw-light)",
                  color: "rgba(251,243,236,.78)",
                }}
              >
                giữa thiên nhiên
              </em>
            </h1>

            <p
              className="gh-au gh-au-3 mb-9"
              style={{
                fontSize: "clamp(13px,1.8vw,17px)",
                color: "rgba(251,249,243,.7)",
                letterSpacing: ".005em",
              }}
            >
              Đặt trực tiếp với chủ nhà &nbsp;·&nbsp; Tư vấn trước khi đặt &nbsp;·&nbsp; Giá
              niêm yết rõ ràng
            </p>

            <div className="gh-au gh-au-4">
              <HeroSearch placeholder={`Bạn muốn đi đâu?`} />
            </div>
          </div>
        </div>
      </section>

      {/* ── DẢI TIN CẬY ──────────────────────────────────── */}
      <div
        style={{
          background: "var(--surface-raised)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div
          className="mx-auto flex flex-wrap items-center justify-center"
          style={{
            maxWidth: "var(--container-max)",
            padding: "14px clamp(16px,4vw,48px)",
            gap: "clamp(16px,4vw,44px)",
          }}
        >
          {TRUST.map((t, i) => (
            <div key={t.title} className="flex items-center gap-2.5">
              {i > 0 ? (
                <span
                  aria-hidden
                  className="hidden sm:block"
                  style={{
                    width: 1,
                    height: 32,
                    background: "var(--border-subtle)",
                    marginRight: "clamp(16px,4vw,44px)",
                  }}
                />
              ) : null}
              <span
                className="flex shrink-0 items-center justify-center"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "var(--radius-sm)",
                  background: t.tint,
                  color: t.color,
                }}
              >
                <Icon name={t.icon} size={16} />
              </span>
              <span>
                <span
                  className="block"
                  style={{ fontSize: 13, fontWeight: "var(--fw-semibold)", color: "var(--text-primary)" }}
                >
                  {t.title}
                </span>
                <span className="block" style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                  {t.sub}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CHỖ NGHỈ NỔI BẬT (lưới bento) ────────────────── */}
      <section style={{ padding: "clamp(40px,6vw,72px) 0" }}>
        <div
          className="mx-auto"
          style={{ maxWidth: "var(--container-max)", padding: "0 clamp(16px,4vw,48px)" }}
        >
          <div className="mb-7 flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <div className="gh-eyebrow mb-2">Khám phá</div>
              <h2
                className="gh-serif"
                style={{
                  fontSize: "clamp(1.5rem,3.5vw,2.4rem)",
                  fontWeight: "var(--fw-semibold)",
                  color: "var(--text-primary)",
                  letterSpacing: "-.02em",
                }}
              >
                Chỗ nghỉ nổi bật
              </h2>
            </div>
            <Link
              href="/properties"
              className="shrink-0 whitespace-nowrap"
              style={{ fontSize: 14, fontWeight: "var(--fw-semibold)" }}
            >
              Xem tất cả →
            </Link>
          </div>

          {featured === null ? (
            <p style={{ color: "var(--text-muted)" }}>
              Chưa kết nối được máy chủ — bật backend rồi tải lại trang.
            </p>
          ) : featured.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>
              Chưa có chỗ ở nào được đăng. Chạy{" "}
              <code style={{ fontFamily: "var(--font-mono)" }}>python -m app.seed --demo</code>{" "}
              để có dữ liệu mẫu.
            </p>
          ) : (
            <BentoGrid items={featured} />
          )}
        </div>
      </section>
    </>
  );
}

/**
 * Lưới bento bất đối xứng của thiết kế: ô lớn bên trái chiếm 2 hàng, ô rộng
 * trên phải, hai ô nhỏ dưới. Ít hơn 4 property thì tự thu về lưới đều —
 * để nguyên khung 4 ô sẽ hở lỗ trống.
 */
function BentoGrid({ items }: { items: Featured[] }) {
  if (items.length < 4) {
    return (
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
          gap: 18,
        }}
      >
        {items.map((it) => (
          <PropertyTile key={it.property.id} {...it} size="md" />
        ))}
      </div>
    );
  }

  const [a, b, c, d] = items;
  return (
    <div className="gh-bento-home">
      <div style={{ gridArea: "a" }}>
        <PropertyTile {...a} size="lg" />
      </div>
      <div style={{ gridArea: "b" }}>
        <PropertyTile {...b} size="md" />
      </div>
      <div style={{ gridArea: "c" }}>
        <PropertyTile {...c} size="sm" />
      </div>
      <div style={{ gridArea: "d" }}>
        <PropertyTile {...d} size="sm" />
      </div>
    </div>
  );
}

function PropertyTile({
  property,
  minPrice,
  size,
}: Featured & { size: "lg" | "md" | "sm" }) {
  const location = [property.address, property.city].filter(Boolean).join(", ");
  const titleSize = size === "lg" ? 17 : size === "md" ? 15.5 : 13.5;
  const priceSize = size === "lg" ? "1.6rem" : size === "md" ? "1.3rem" : "1.1rem";
  const mediaFlex = size === "lg" ? "1 1 auto" : "0 0 52%";

  return (
    <Link
      href={`/properties/${property.id}`}
      className="gh-prop-card flex h-full flex-col overflow-hidden"
      style={{
        background: "var(--surface-raised)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-clay)",
        color: "inherit",
      }}
    >
      <div className="gh-noise relative" style={{ flex: mediaFlex, minHeight: 128 }}>
        <PropertyMedia
          name={property.name}
          imagePath={property.cover_image}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div
        className="flex flex-1 flex-col justify-between"
        style={{ padding: size === "lg" ? "20px 22px 24px" : "13px 15px 15px" }}
      >
        <div>
          <h3
            style={{
              fontSize: titleSize,
              fontWeight: "var(--fw-semibold)",
              color: "var(--text-primary)",
              lineHeight: 1.25,
              marginBottom: 3,
            }}
          >
            {property.name}
          </h3>
          {location ? (
            <span
              className="flex items-center gap-1"
              style={{ fontSize: size === "lg" ? 13 : 11.5, color: "var(--text-muted)" }}
            >
              <Icon name="map-pin" size={12} />
              {location}
            </span>
          ) : null}
        </div>

        {minPrice != null ? (
          <div style={{ marginTop: size === "lg" ? 14 : 10 }}>
            {size === "lg" ? (
              <div
                style={{ height: 1, background: "var(--border-subtle)", marginBottom: 14 }}
                aria-hidden
              />
            ) : null}
            <span
              className="gh-serif"
              style={{
                fontSize: priceSize,
                fontWeight: "var(--fw-semibold)",
                color: "var(--accent)",
              }}
            >
              {formatVnd(minPrice)}
            </span>
            <span style={{ fontSize: size === "lg" ? 13 : 11, color: "var(--text-muted)" }}>
              {" "}
              / đêm
            </span>
          </div>
        ) : null}
      </div>
    </Link>
  );
}
