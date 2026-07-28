import Link from "next/link";
import type { Property } from "@/lib/api";
import { formatVnd } from "@/lib/format";
import { PropertyMedia } from "@/components/PropertyMedia";
import { Icon } from "@/components/gaoji/Icon";

/**
 * Card danh sách chỗ nghỉ, theo ngôn ngữ thị giác Gaoji House: tấm ảnh bo
 * `--radius-lg` phủ grain, bên dưới là tên / địa điểm / giá.
 *
 * Vì sao không dùng thẳng `gaoji/PropertyCard`: bản đó có tim lưu chỗ nghỉ và
 * điểm đánh giá — dự án chưa có dữ liệu cho cả hai, mà bịa ra thì thành giao
 * diện nói dối. Nút tim còn là `<button>` nên lồng trong `<a>` sẽ ra HTML sai.
 * Ở đây dùng `<Link>` để Google index được (trang này sống bằng SEO) và hover
 * chạy bằng CSS thuần, không cần JavaScript phía client.
 */
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
      className="group flex flex-col gap-3 transition-transform duration-200 hover:-translate-y-[3px]"
      style={{ transitionTimingFunction: "var(--ease-spring)" }}
    >
      <div
        className="gh-noise overflow-hidden"
        style={{
          aspectRatio: "4 / 3",
          borderRadius: "var(--radius-lg)",
          boxShadow: "inset 0 0 0 1px rgba(33,28,20,.05)",
        }}
      >
        <PropertyMedia
          name={property.name}
          imagePath={property.cover_image}
          className="transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-col gap-[3px] px-[2px]">
        <h3
          style={{
            fontSize: "var(--fs-h4)",
            fontWeight: "var(--fw-semibold)",
            color: "var(--text-primary)",
            lineHeight: 1.25,
            letterSpacing: "var(--tracking-tight)",
          }}
        >
          {property.name}
        </h3>

        {location ? (
          <p
            className="flex items-center gap-1.5"
            style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}
          >
            <Icon name="map-pin" size={14} />
            {location}
          </p>
        ) : null}

        {minPrice != null ? (
          <p className="mt-1.5 flex items-baseline gap-1.5">
            <span
              style={{
                fontSize: "var(--fs-body-lg)",
                fontWeight: "var(--fw-semibold)",
                color: "var(--text-primary)",
              }}
            >
              {formatVnd(minPrice)}
            </span>
            <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>/ đêm</span>
          </p>
        ) : null}
      </div>
    </Link>
  );
}
