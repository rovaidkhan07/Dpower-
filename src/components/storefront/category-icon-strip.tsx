"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface CategoryIconItem {
  name: string;
  slug: string;
  iconPath: string;
}

const CATEGORIES: CategoryIconItem[] = [
  {
    name: "Chargers",
    slug: "chargers",
    iconPath: "/icons/categories/chargers.png",
  },
  {
    name: "Cables",
    slug: "cables",
    iconPath: "/icons/categories/cables.png",
  },
  {
    name: "Power Banks",
    slug: "power-banks",
    iconPath: "/icons/categories/power-banks.png",
  },
  {
    name: "Earbuds",
    slug: "earbuds",
    iconPath: "/icons/categories/earbuds.png",
  },
  {
    name: "Car Mounts",
    slug: "car-accessories",
    iconPath: "/icons/categories/car-mounts.png",
  },
  {
    name: "Smart Watch",
    slug: "smart-watch",
    iconPath: "/icons/categories/smart-watch.png",
  },
  {
    name: "Power Hubs",
    slug: "chargers",
    iconPath: "/icons/categories/power-hubs.png",
  },
];

export function CategoryIconStrip() {
  return (
    <section className="w-full bg-white dark:bg-[#111215] border-b border-gray-100 dark:border-white/5 py-4 sm:py-6 font-sans">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Horizontal scroll on mobile, perfectly centered on desktop */}
        <div className="flex items-center justify-start sm:justify-center gap-5 sm:gap-8 lg:gap-11 overflow-x-auto pb-2 scrollbar-none snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((cat) => {
            const href = cat.slug ? `/shop?category=${cat.slug}` : "/shop";
            return (
              <Link
                key={cat.name}
                href={href}
                className="group flex flex-col items-center shrink-0 snap-start cursor-pointer transition-transform duration-200 hover:-translate-y-1"
              >
                {/* Clean circular icon disc */}
                <div className="relative w-15 h-15 sm:w-17 sm:h-17 rounded-full bg-[#f1f3f6] dark:bg-[#1c1f26] flex items-center justify-center p-2 transition-all duration-200 group-hover:scale-105 group-hover:bg-[#e8ecf1] dark:group-hover:bg-[#252a35] group-hover:shadow-sm">
                  <Image
                    src={cat.iconPath}
                    alt={cat.name}
                    width={48}
                    height={48}
                    className="w-9 h-9 sm:w-10 sm:h-10 object-contain transition-transform group-hover:scale-110"
                  />
                </div>

                {/* Clean bold label */}
                <span className="mt-2 text-xs sm:text-[13px] font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors text-center tracking-tight">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
