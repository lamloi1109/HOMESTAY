import type { MetadataRoute } from "next";
import { fetchProperties } from "@/lib/api";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/properties`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];

  // Backend chết thì vẫn phải trả về sitemap tĩnh — không được để hỏng cả build.
  try {
    const properties = await fetchProperties();
    return [
      ...staticRoutes,
      ...properties.map((p) => ({
        url: `${SITE_URL}/properties/${p.id}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
