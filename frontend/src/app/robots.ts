import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Trang tra cứu đặt phòng theo mã — không có nội dung để index, và
      // không nên để crawler dò mã booking của khách.
      disallow: ["/lookup", "/bookings/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
