import type { NextConfig } from "next";

const assetBaseUrl = process.env.NEXT_PUBLIC_ASSET_BASE_URL?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  async redirects() {
    if (!assetBaseUrl) return [];

    return [
      {
        source: "/assets/:path*",
        destination: `${assetBaseUrl}/assets/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
