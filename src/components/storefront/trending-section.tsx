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

  const count = displayedProducts.length;

  // Grid class based on product count — avoids big empty space for 1-2 products
  const gridClass =
    count === 1
      ? "flex justify-center"
      : count === 2
      ? "grid grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto sm:max-w-none sm:grid-cols-2"
      : count === 3
      ? "grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
      : "grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4";

  return (
    <section className="w-full bg-white dark:bg-[#15181E] font-sans py-4 sm:py-6 lg:py-8">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-3 sm:mb-5">
          <h2 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            Featured Products
          </h2>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-[#d71920] dark:hover:text-[#ef2b32] transition-colors shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Single card — compact centered */}
        {count === 1 ? (
          <div className="flex justify-center">
            <div className="w-full max-w-[260px] sm:max-w-[280px]">
              <ProductCard product={displayedProducts[0]} variant="compact" />
            </div>
          </div>
        ) : (
          /* Mobile horizontal scroll + responsive grid on sm+ */
          <div className={`flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible scrollbar-none snap-x sm:${gridClass}`}>
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                className="w-[155px] sm:w-auto shrink-0 snap-start min-w-0 flex"
              >
                <ProductCard product={product} variant="compact" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
