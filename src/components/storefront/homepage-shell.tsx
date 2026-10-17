"use client";

import React from "react";
import { HeroBanner } from "@/components/storefront/hero-banner";
import { CategoryIconStrip } from "@/components/storefront/category-icon-strip";
import { FlashDealsSection } from "@/components/storefront/flash-deals-section";
import { TrendingSection } from "@/components/storefront/trending-section";
import { CategoryGrid } from "@/components/storefront/category-grid";
import { SocialProofBanner } from "@/components/storefront/social-proof-banner";
import { TrustFeatures } from "@/components/storefront/trust-features";
import { VipBanner } from "@/components/storefront/vip-banner";
import { KharidlyDesktopHome } from "@/components/storefront/kharidly-desktop-home";
import { ProductWithDetails } from "@/types";
import { Category } from "@/generated/prisma/client";

interface HomepageShellProps {
  featuredProducts: ProductWithDetails[];
  categories: Category[];
  trendingProducts: { products: ProductWithDetails[] };
}

export function HomepageShell({ featuredProducts, categories, trendingProducts }: HomepageShellProps) {
  const displayProducts = featuredProducts?.length ? featuredProducts : trendingProducts.products;
  const flashProducts = trendingProducts.products.length ? trendingProducts.products : displayProducts;

  return (
    <>
      <div className="hidden lg:block">
        <KharidlyDesktopHome products={displayProducts} />
      </div>

      <div className="lg:hidden bg-[#fcfcfc] dark:bg-[#0c0d0e] transition-colors">
        <HeroBanner />
        <CategoryIconStrip />
        <FlashDealsSection products={flashProducts} />
        <CategoryGrid categories={categories} />
        <TrendingSection products={displayProducts} />
        <SocialProofBanner />
        <TrustFeatures />
        <VipBanner />
      </div>
    </>
  );
}
