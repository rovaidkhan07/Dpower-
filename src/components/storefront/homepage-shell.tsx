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
    <div className="bg-[#fcfcfc] dark:bg-[#0c0d0e] transition-colors">
      {/* 1. High-Energy Hero Carousel */}
      <HeroBanner />

      {/* 2. DabLew Style Circular Category Icon Strip */}
      <CategoryIconStrip />

      {/* 3. Flash Deals with Live Urgency Countdown Timer (⚡ Deal Ending In ⚡) */}
      <FlashDealsSection products={flashProducts} />

      {/* 4. Quick Category Visual Cards */}
      <CategoryGrid categories={categories} />

      {/* 5. Trending & Featured Products Shelf */}
      <TrendingSection products={displayProducts} />

      {/* 6. Heavy Social Proof Banner with 50K+ Trust Metrics and Reviews */}
      <SocialProofBanner />

      {/* 7. Wholesale & Retail Guarantees */}
      <TrustFeatures />

      {/* 8. VIP Wholesale & Bulk Order Callout */}
      <VipBanner />
    </div>
  );
}
