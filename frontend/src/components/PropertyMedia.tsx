import { assetUrl } from "@/lib/api";
import { PropertyArt } from "@/components/PropertyArt";

/**
 * Ảnh property nếu đã upload, fallback SVG art (D-006) khi chưa có.
 * Dùng <img> thường: ảnh serve từ backend cùng máy, chưa cần tối ưu next/image.
 */
export function PropertyMedia({
  name,
  imagePath,
  alt,
  className = "",
}: {
  name: string;
  imagePath?: string | null;
  alt?: string | null;
  className?: string;
}) {
  if (imagePath) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={assetUrl(imagePath)}
        alt={alt ?? name}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  return <PropertyArt name={name} className={className} />;
}
