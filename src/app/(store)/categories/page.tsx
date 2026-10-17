import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/services/categoryService";
import { Layers, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Categories | DK Power",
  description: "Browse all mobile charging and tech categories at DK Power in Pakistan.",
};

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="bg-slate-50 dark:bg-[#0F1217] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/20 text-primary flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore All Categories
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Find the exact mobile accessory tailored to your phone model and charging needs.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {categories.map((category) => {
            const count = category._count?.products ?? 0;
            return (
              <Link
                key={category.id}
                href={`/shop?category=${encodeURIComponent(category.slug)}`}
                className="group bg-white dark:bg-[#15181E] rounded-2xl border border-gray-200/80 dark:border-[#262C37] hover:border-primary/60 p-3 sm:p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square sm:aspect-4/3 w-full rounded-xl bg-slate-100 dark:bg-[#1C2028] overflow-hidden mb-3 sm:mb-4 border border-slate-100 dark:border-[#262C37]">
                    <Image
                      src={
                        category.imageUrl ||
                        "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600"
                      }
                      alt={category.name}
                      fill
                      sizes="(max-width: 639px) 45vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <h2 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-tight">
                    {category.name}
                  </h2>

                  {category.description && (
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed hidden sm:block">
                      {category.description}
                    </p>
                  )}
                </div>

                <div className="pt-2 sm:pt-4 mt-2 sm:mt-4 border-t border-slate-100 dark:border-[#262C37] flex items-center justify-between text-[10px] sm:text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">
                    {count} {count === 1 ? "Product" : "Products"}
                  </span>
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-100 dark:bg-[#262C37] group-hover:bg-primary group-hover:text-white flex items-center justify-center text-slate-600 dark:text-[#8A919C] transition-colors shrink-0">
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
