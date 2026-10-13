import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteUrl, isPreviewDeployment } from "@/lib/seo";

// Query at request time so the build does not need a database connection.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (isPreviewDeployment()) return [];

  const paths = [
    "/", "/shop", "/categories", "/about", "/contact", "/faq",
    "/delivery-information", "/refund-policy", "/warranty-policy",
  ];
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
    orderBy: { slug: "asc" },
    take: 50000 - paths.length + 1,
  });

  // Fail visibly instead of silently omitting products at the sitemap limit.
  if (products.length + paths.length > 50000) {
    throw new Error("Split the product sitemap before exceeding 50,000 URLs.");
  }

  return [
    ...paths.map((path) => ({ url: siteUrl(path) })),
    ...products.map((product) => ({
      url: siteUrl(`/products/${encodeURIComponent(product.slug)}`),
      lastModified: product.updatedAt,
    })),
  ];
}
