/**
 * Thông tin site dùng cho SEO và chia sẻ mạng xã hội.
 *
 * `NEXT_PUBLIC_SITE_URL` phải là domain thật khi deploy — sitemap, canonical và
 * thẻ Open Graph đều cần URL tuyệt đối. Để mặc định localhost thì lúc dev vẫn
 * chạy, nhưng deploy mà quên set là Google sẽ index nhầm localhost.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const SITE_NAME = "Gaoji House";

export const SITE_DESCRIPTION =
  "Đặt phòng trực tiếp những không gian ấm áp, mang đậm chất liệu tự nhiên và bản sắc mộc mạc khắp Việt Nam.";
