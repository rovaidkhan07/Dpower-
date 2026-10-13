"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { ProductWithDetails } from "@/types";

interface TrendingSectionProps {
  products: ProductWithDetails[];
}

export function TrendingSection({ products }: TrendingSectionProps) {
  const displayedProducts = products.slice(0, 4);

  if (!displayedProducts || displayedProducts.length === 0) return null;

  return (
    <section className="w-full bg-white dark:bg-[#15181E] font-sans py-5 sm:py-8 lg:py-12">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section matching mockup */}
        <div className="flex items-center justify-between gap-4 mb-3 sm:mb-6">
          <h2 className="text-base sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Featured Products
          </h2>

          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Product Cards: horizontal scroll on mobile, responsive grid on sm+ */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible scrollbar-none snap-x sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 md:gap-6">
          {displayedProducts.map((product) => (
            <div key={product.id} className="w-[155px] sm:w-auto shrink-0 snap-start min-w-0 flex">
              <ProductCard product={product} variant="compact" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



