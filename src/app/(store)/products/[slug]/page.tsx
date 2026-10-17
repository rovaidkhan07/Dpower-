import type { Metadata } from "next";
import React from "react";
import { siteUrl } from "@/lib/seo";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/services/productService";
import { ProductDetailView } from "@/components/product/product-detail-view";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.isActive) {
    return { title: "Product Not Found", robots: { index: false, follow: false } };
  }

  const description = product.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160)
    || `Shop ${product.name} at DK Power in Pakistan.`;
  const url = siteUrl(`/products/${encodeURIComponent(product.slug)}`);
  const images = product.images.map((image) => ({
    url: image.imageUrl,
    alt: image.altText || product.name,
  }));

  return {
    title: product.name,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", siteName: "DK Power", title: product.name, description, url, images },
    twitter: { card: images.length ? "summary_large_image" : "summary", title: product.name, description, images: images.map((image) => image.url) },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.isActive) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id, 4);

  return <ProductDetailView product={product} relatedProducts={relatedProducts} />;
}

