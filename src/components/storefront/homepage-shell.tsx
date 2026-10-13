"use client";

import React from "react";
import { HeroBanner } from "@/components/storefront/hero-banner";
import { TrendingSection } from "@/components/storefront/trending-section";
import { CategoryGrid } from "@/components/storefront/category-grid";
import { TechFeaturesSection } from "@/components/storefront/tech-features-section";
import { CustomerReviews } from "@/components/storefront/customer-reviews";
import { VipBanner } from "@/components/storefront/vip-banner";
import { TrustFeatures } from "@/components/storefront/trust-features";
import { ProductWithDetails } from "@/types";
import { Category } from "@/generated/prisma/client";

interface HomepageShellProps {
  featuredProducts: ProductWithDetails[];
  categories: Category[];
  trendingProducts: { products: ProductWithDetails[] };
}

export function HomepageShell({
  featuredProducts,
  categories,
  trendingProducts,
}: HomepageShellProps) {
  const displayProducts =
    featuredProducts && featuredProducts.length > 0
      ? featuredProducts
      : trendingProducts.products;

  return (
    <div className="space-y-0 bg-[#FAF8F5] dark:bg-[#0F1115]">
      {/* 1. Core value proposition */}
      <HeroBanner />

      {/* 2. Fast path into the catalog (4 horizontal cards) */}
      <CategoryGrid categories={categories} />

      {/* 3. Featured products (horizontal scroll on mobile) */}
      <TrendingSection products={displayProducts} />

      {/* 4. Desktop-only extended editorial content */}
      <div className="hidden lg:block space-y-0">
        <TrustFeatures />
        <TechFeaturesSection />
        <CustomerReviews />
      </div>

      {/* 5. VIP Banner / Newsletter */}
      <VipBanner />
    </div>
  );
}
