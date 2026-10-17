"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/generated/prisma/client";
import { ArrowRight } from "lucide-react";

const CORE_CATEGORY_META: Record<
  string,
  { name: string; subtitle: string; cta: string; image: string }
> = {
  chargers: {
    name: "Chargers",
    subtitle: "Power up, always.",
    cta: "Shop Chargers",
    image: "/images/categories/chargers.jpg",
  },
  cables: {
    name: "Cables",
    subtitle: "Fast. Durable. Reliable.",
    cta: "Shop Cables",
    image: "/images/categories/cables.jpg",
  },
  earbuds: {
    name: "Earbuds",
    subtitle: "Pure sound, anywhere.",
    cta: "Shop Earbuds",
    image: "/images/categories/audio.jpg",
  },
  "power-banks": {
    name: "Power Banks",
    subtitle: "More power, more you.",
    cta: "Shop Power Banks",
    image: "/images/categories/power-banks.jpg",
  },
};

const ORDERED_SLUGS = ["chargers", "cables", "earbuds", "power-banks"] as const;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CategoryGrid({ categories }: { categories?: Category[] }) {
  return (
    <section className="bg-background py-3 sm:py-5 font-sans">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {ORDERED_SLUGS.map((slug) => {
            const meta = CORE_CATEGORY_META[slug];
            return (
              <Link
                key={slug}
                href={`/shop?category=${encodeURIComponent(slug)}`}
                className="group relative flex items-center justify-between p-3 sm:p-4 rounded-xl bg-white dark:bg-[#15181E] border border-gray-200/80 dark:border-[#262C37] shadow-sm hover:shadow-md hover:border-[#d71920]/40 dark:hover:border-[#d71920]/40 transition-all duration-200 overflow-hidden"
                aria-label={`Browse ${meta.name} category`}
              >
                {/* Red accent line on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-0.5 bg-[#d71920] scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-top rounded-r"
                />

                <div className="flex flex-col justify-between z-10 min-w-0 pr-1">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-tight truncate group-hover:text-[#d71920] transition-colors duration-200">
                      {meta.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug line-clamp-1">
                      {meta.subtitle}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 bg-black text-white text-[9px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full mt-2 sm:mt-2.5 group-hover:bg-[#d71920] transition-colors duration-200 w-fit shrink-0">
                    {meta.cta} <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" aria-hidden="true" />
                  </span>
                </div>

                <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 shrink-0 ml-1">
                  <Image
                    src={meta.image}
                    alt={meta.name}
                    fill
                    sizes="(max-width: 639px) 48px, (max-width: 1023px) 64px, 80px"
                    className="object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
