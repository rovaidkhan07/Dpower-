import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { getProducts, getDistinctBrands } from "@/lib/services/productService";
import { getCategories } from "@/lib/services/categoryService";
import { ShopProductGrid } from "@/components/product/shop-product-grid";
import { ProductFilters } from "@/components/product/product-filters";
import { ChevronRight as ChevronRightIcon } from "lucide-react";

export const dynamic = "force-dynamic";

const CORE_CATEGORY_SLUGS = ["chargers", "cables", "power-banks", "earbuds"] as const;
const coreCategorySet = new Set<string>(CORE_CATEGORY_SLUGS);

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    featured?: string;
    sort?: "featured" | "newest" | "price-low-high" | "price-high-low" | "best-selling";
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = new URLSearchParams();
  const allowed = ["category", "brand", "search", "minPrice", "maxPrice", "inStock", "featured", "sort", "page"] as const;
  for (const key of allowed) {
    const value = params[key];
    if (typeof value === "string" && value) query.set(key, value);
  }
  const page = Number(params.page);
  if (Number.isInteger(page) && page > 1) query.set("page", String(page));
  else query.delete("page");
  const path = query.size ? `/shop?${query.toString()}` : "/shop";
  const filtered = allowed.some((key) => key !== "page" && Boolean(params[key]));
  return {
    title: page > 1 ? `Shop Tech Gadgets — Page ${page}` : "Shop Mobile Accessories",
    description: "Browse chargers, charging cables, power banks and earbuds at DK Power in Pakistan.",
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: "DK Power", url: path },
    ...(filtered ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const requestedCategory = params.category;
  const category = requestedCategory && coreCategorySet.has(requestedCategory) ? requestedCategory : undefined;
  const brand = params.brand;
  const search = params.search;
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const inStock = params.inStock === "true";
  const featured = params.featured === "true";
  const sort = params.sort || "featured";
  const page = parseInt(params.page || "1", 10);

  const [productData, allCategories, brands] = await Promise.all([
    getProducts({
      category,
      brand,
      search,
      minPrice,
      maxPrice,
      inStock,
      featured,
      sort,
      page,
      limit: 15,
    }),
    getCategories(),
    getDistinctBrands(),
  ]);

  const categories = allCategories
    .filter((item) => item.isActive && coreCategorySet.has(item.slug))
    .sort(
      (a, b) =>
        CORE_CATEGORY_SLUGS.indexOf(a.slug as (typeof CORE_CATEGORY_SLUGS)[number]) -
        CORE_CATEGORY_SLUGS.indexOf(b.slug as (typeof CORE_CATEGORY_SLUGS)[number]),
    );

  const { products, totalCount, totalPages, currentPage } = productData;
  const selectedCategoryObj = categories.find((c) => c.slug === category);

  return (
    <div className="bg-[#F8F9FA] dark:bg-[#0F1217] min-h-screen pb-16 font-sans">
      {/* Shop Header Banner */}
      <div className="bg-white dark:bg-[#15181E] py-6 sm:py-10 mb-4 sm:mb-6 text-center border-b border-gray-100 dark:border-[#262C37]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
            <ChevronRightIcon className="w-3.5 h-3.5" />
            <Link href="/shop" className={`hover:text-black dark:hover:text-white transition-colors ${!selectedCategoryObj ? "text-foreground font-bold" : ""}`}>Shop</Link>
            {selectedCategoryObj && (
              <>
                <ChevronRightIcon className="w-3.5 h-3.5" />
                <span className="text-primary font-bold">{selectedCategoryObj.name}</span>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
            {selectedCategoryObj ? selectedCategoryObj.name : "Shop All Accessories"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
            {selectedCategoryObj
              ? `Browse premium ${selectedCategoryObj.name.toLowerCase()} with official brand warranty in Pakistan.`
              : "Chargers, cables, power banks and earbuds engineered for everyday performance."}
          </p>

          {/* Quick Category Chips Strip (Horizontal swipe on mobile) */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x max-w-2xl mx-auto -mx-2 px-2">
            <Link
              href="/shop"
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                !category
                  ? "bg-black text-white shadow-xs"
                  : "bg-gray-100 dark:bg-[#1C2028] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#252A36]"
              }`}
            >
              All Accessories
            </Link>
            {categories.map((cat) => {
              const isActive = category === cat.slug;
              return (
                <Link
                  key={cat.id}
                  href={`/shop?category=${encodeURIComponent(cat.slug)}`}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-xs"
                      : "bg-gray-100 dark:bg-[#1C2028] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#252A36]"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {search && (
          <div className="flex items-center justify-between gap-4 bg-white dark:bg-[#15181E] border border-gray-200 dark:border-[#262C37] rounded-xl px-4 py-2 text-xs font-semibold text-gray-800 dark:text-gray-200 shadow-xs">
            <span>Search results for: <strong className="text-foreground">&ldquo;{search}&rdquo;</strong></span>
            <Link href="/shop" className="text-primary hover:underline font-bold">Clear search</Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          <aside className="lg:col-span-1 lg:sticky lg:top-24">
            <ProductFilters categories={categories} brands={brands} />
          </aside>

          <main className="lg:col-span-3">
            <ShopProductGrid
              products={products}
              totalCount={totalCount}
              totalPages={totalPages}
              currentPage={currentPage}
              searchParams={{ ...params, category }}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
