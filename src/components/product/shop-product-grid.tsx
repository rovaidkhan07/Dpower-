"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductWithDetails } from "@/types";
import { ProductCard } from "@/components/product/product-card";
import { QuickViewModal } from "@/components/product/quick-view-modal";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ChevronLeft, RotateCcw } from "lucide-react";

interface ShopProductGridProps {
  products: ProductWithDetails[];
  totalCount?: number;
  totalPages: number;
  currentPage: number;
  searchParams: Record<string, string | undefined>;
}

export function ShopProductGrid({
  products,
  totalPages,
  currentPage,
  searchParams,
}: ShopProductGridProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductWithDetails | null>(null);

  const handleQuickView = (product: ProductWithDetails) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  if (products.length === 0) {
    return (
      <div className="bg-white dark:bg-[#15181E] rounded-2xl border border-gray-200 dark:border-[#262C37] p-8 sm:p-12 text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-secondary dark:bg-[#1C2028] flex items-center justify-center mx-auto text-muted-foreground">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">No accessories match these filters</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Try adjusting the price range, switching brands, or resetting filters.
          </p>
        </div>
        <Button asChild variant="outline" className="mt-2 text-xs font-bold rounded-full px-5">
          <Link href="/shop" className="flex items-center gap-2">
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onQuickView={handleQuickView} variant="compact" />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-8 border-t border-gray-200 dark:border-[#262C37]">
          {currentPage > 1 && (
            <Button asChild variant="outline" size="sm" className="rounded-full px-4 text-xs font-semibold">
              <Link
                href={`/shop?${new URLSearchParams({
                  ...searchParams,
                  page: String(currentPage - 1),
                }).toString()}`}
                className="flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Link>
            </Button>
          )}

          <span className="text-xs font-bold px-3.5 py-1.5 bg-white dark:bg-[#15181E] border border-gray-200 dark:border-[#262C37] rounded-full text-foreground">
            Page {currentPage} of {totalPages}
          </span>

          {currentPage < totalPages && (
            <Button asChild variant="outline" size="sm" className="rounded-full px-4 text-xs font-semibold">
              <Link
                href={`/shop?${new URLSearchParams({
                  ...searchParams,
                  page: String(currentPage + 1),
                }).toString()}`}
                className="flex items-center gap-1.5"
              >
                Next <ChevronLeft className="w-4 h-4 rotate-180" />
              </Link>
            </Button>
          )}
        </div>
      )}

      {/* Quick View Modal */}
      {isQuickViewOpen && quickViewProduct && (
        <QuickViewModal isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} product={quickViewProduct} />
      )}
    </>
  );
}



