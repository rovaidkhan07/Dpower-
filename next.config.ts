import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    const headers = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    if (process.env.VERCEL_ENV === "preview" || process.env.VERCEL_ENV === "development") {
      return [{ source: "/:path*", headers }];
    }
    // Do not disallow these HTML pages in robots.txt: crawlers must see noindex.
    return [
      "/admin/:path*", "/account/:path*", "/login", "/register",
      "/forgot-password", "/cart", "/checkout", "/track-order",
      "/order-confirmation/:path*", "/api/:path*",
    ].map((source) => ({ source, headers }));
  },
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
