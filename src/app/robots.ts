import type { MetadataRoute } from "next";
import { SITE_URL, isPreviewDeployment } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (isPreviewDeployment()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
