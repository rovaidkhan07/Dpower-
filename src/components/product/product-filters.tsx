"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Filter, RotateCcw, Check, ChevronDown } from "lucide-react";

interface ProductFiltersProps {
  categories: Category[];
  brands: string[];
}

export function ProductFilters({ categories, brands }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentBrand = searchParams.get("brand") || "";
  const currentSort = searchParams.get("sort") || "featured";
  const currentInStock = searchParams.get("inStock") === "true";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentSearch = searchParams.get("search") || "";

  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const applyFilters = (updates: Record<string, string | null | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Reset page to 1 on filter change
    params.delete("page");

    router.push(`/shop?${params.toString()}`);
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({
      minPrice: minPrice ? minPrice : null,
      maxPrice: maxPrice ? maxPrice : null,
    });
  };

  const handleResetAll = () => {
    setMinPrice("");
    setMaxPrice("");
    router.push("/shop");
  };

  const hasActiveFilters = Boolean(
    currentCategory ||
      currentBrand ||
      currentInStock ||
      currentMinPrice ||
      currentMaxPrice ||
      currentSearch ||
      (currentSort && currentSort !== "featured")
  );

  return (
    <div className="w-full">
      {/* Mobile Filter Toggle Button Bar */}
      <div className="lg:hidden flex items-center justify-between gap-2.5 mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-gray-200 dark:border-[#262C37] bg-white dark:bg-[#15181E] font-bold text-xs shadow-xs cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5 text-[#FF6B00]" />
          <span>Filters {hasActiveFilters && "• (Active)"}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpenMobile ? "rotate-180" : ""}`} />
        </Button>

        {/* Sort selector in mobile bar */}
        <select
          value={currentSort}
          onChange={(e) => applyFilters({ sort: e.target.value })}
          className="h-11 px-3.5 bg-white dark:bg-[#15181E] border border-gray-200 dark:border-[#262C37] rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 outline-none shadow-xs cursor-pointer"
        >
          <option value="featured">Featured</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
          <option value="newest">Newest First</option>
          <option value="best-selling">Best Selling</option>
        </select>
      </div>

      {/* Filter Content Container */}
      <div
        className={`${
          isOpenMobile ? "block" : "hidden"
        } lg:block bg-white dark:bg-[#15181E] p-5 rounded-2xl border border-gray-200/80 dark:border-[#262C37] shadow-xs space-y-5`}
      >
        {/* Header with Clear Button */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#262C37]">
          <h3 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#FF6B00]" /> Filter Products
          </h3>
          {hasActiveFilters && (
            <button
              onClick={handleResetAll}
              className="text-xs text-[#FF6B00] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>

        {/* Sort Options (Desktop) */}
        <div className="hidden lg:block space-y-2">
          <label className="text-xs font-bold text-gray-900 dark:text-[#E9EBEF] uppercase tracking-wider">
            Sort Order
          </label>
          <select
            value={currentSort}
            onChange={(e) => applyFilters({ sort: e.target.value })}
            className="w-full h-10 px-3 bg-[#F8F9FA] dark:bg-[#1C2028] border border-gray-200 dark:border-[#2A2F3A] rounded-xl text-xs font-semibold text-gray-900 dark:text-gray-100 outline-none focus:border-[#FF6B00] cursor-pointer"
          >
            <option value="featured">Featured Items</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
            <option value="best-selling">Best Selling</option>
          </select>
        </div>

        {/* Categories Filter */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-gray-900 dark:text-[#E9EBEF] uppercase tracking-wider">
            Category
          </label>
          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            <button
              onClick={() => applyFilters({ category: null })}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                !currentCategory
                  ? "bg-[#FF6B00] text-white font-bold shadow-xs"
                  : "text-gray-700 dark:text-[#B8BEC8] hover:bg-[#F8F9FA] dark:hover:bg-[#1C2028]"
              }`}
            >
              <span>All Categories</span>
              {!currentCategory && <Check className="w-3.5 h-3.5" />}
            </button>

            {categories.map((cat) => {
              const isSelected = currentCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => applyFilters({ category: isSelected ? null : cat.slug })}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? "bg-[#FF6B00] text-white font-bold shadow-xs"
                      : "text-gray-700 dark:text-[#B8BEC8] hover:bg-[#F8F9FA] dark:hover:bg-[#1C2028]"
                  }`}
                >
                  <span className="line-clamp-1">{cat.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Brands Filter */}
        {brands.length > 0 && (
          <div className="space-y-2.5 pt-4 border-t border-gray-100 dark:border-[#262C37]">
            <label className="text-xs font-bold text-gray-900 dark:text-[#E9EBEF] uppercase tracking-wider">
              Popular Brands
            </label>
            <div className="flex flex-wrap gap-1.5">
              {brands.map((b) => {
                const isSelected = currentBrand.toLowerCase() === b.toLowerCase();
                return (
                  <button
                    key={b}
                    onClick={() => applyFilters({ brand: isSelected ? null : b })}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#FF6B00] text-white border-[#FF6B00] shadow-xs"
                        : "bg-[#F8F9FA] dark:bg-[#1C2028] text-gray-700 dark:text-[#B8BEC8] border-gray-200 dark:border-[#2A2F3A] hover:bg-gray-100"
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Price Range Filter */}
        <div className="space-y-2.5 pt-4 border-t border-gray-100 dark:border-[#262C37]">
          <label className="text-xs font-bold text-gray-900 dark:text-[#E9EBEF] uppercase tracking-wider">
            Price Range (PKR)
          </label>
          <form onSubmit={handlePriceApply} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min Rs."
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-[#F8F9FA] dark:bg-[#1C2028] border border-gray-200 dark:border-[#2A2F3A] rounded-xl outline-none focus:border-[#FF6B00] font-mono"
              />
              <input
                type="number"
                placeholder="Max Rs."
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-[#F8F9FA] dark:bg-[#1C2028] border border-gray-200 dark:border-[#2A2F3A] rounded-xl outline-none focus:border-[#FF6B00] font-mono"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="w-full text-xs font-bold rounded-xl h-10 bg-[#FF6B00] hover:bg-[#E05E00] text-white cursor-pointer shadow-xs"
            >
              Apply Filter
            </Button>
          </form>
        </div>

        {/* Availability Toggle */}
        <div className="pt-4 border-t border-gray-100 dark:border-[#262C37]">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800 dark:text-[#D5D9E0] select-none">
            <input
              type="checkbox"
              checked={currentInStock}
              onChange={(e) => applyFilters({ inStock: e.target.checked ? "true" : null })}
              className="w-4 h-4 rounded text-[#FF6B00] border-gray-300 focus:ring-[#FF6B00] accent-[#FF6B00]"
            />
            <span>Show In-Stock Only</span>
          </label>
        </div>
      </div>
    </div>
  );
}


