"use client";

import React from "react";
import { HeroBanner } from "@/components/storefront/hero-banner";
import { TrendingSection } from "@/components/storefront/trending-section";
import { CategoryGrid } from "@/components/storefront/category-grid";
import { TrustFeatures } from "@/components/storefront/trust-features";
import { VipBanner } from "@/components/storefront/vip-banner";
import { ProductWithDetails } from "@/types";
import { Category } from "@/generated/prisma/client";

interface HomepageShellProps {
  featuredProducts: ProductWithDetails[];
  categories: Category[];
  trendingProducts: { products: ProductWithDetails[] };
}

export function HomepageShell({ featuredProducts, categories, trendingProducts }: HomepageShellProps) {
  const displayProducts = featuredProducts?.length ? featuredProducts : trendingProducts.products;

  return (
    <div className="space-y-0 bg-[#fafafa] dark:bg-[#0f0f10]">
      <HeroBanner />
      <CategoryGrid categories={categories} />
      <TrendingSection products={displayProducts} />
      <TrustFeatures />
      <VipBanner />
    </div>
  );
}
