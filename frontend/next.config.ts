import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    const assetBaseUrl = process.env.NEXT_PUBLIC_ASSET_BASE_URL?.replace(/\/$/, "");
    if (!assetBaseUrl) return [];

    return [
      {
        source: "/assets/photos/:path*",
        destination: `${assetBaseUrl}/assets/photos/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
