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
    <section className="w-full bg-white dark:bg-[#111215] font-sans py-7 sm:py-10 border-b border-gray-100 dark:border-white/5">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and View All */}
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
              Featured Products
            </h2>
            <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-wider bg-red-100 text-[#b51218] px-2.5 py-0.5 rounded-full">
              Wholesale Catalog
            </span>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-[#b51218] dark:hover:text-[#ff4d4f] transition-colors shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* 4 Cards Shelf - Exact same grid as Flash Wholesale Deals */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
