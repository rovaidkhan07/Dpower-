"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, Cable, BatteryCharging, Headphones, Car, Watch, ShieldAlert } from "lucide-react";

interface CategoryIconItem {
  name: string;
  slug: string;
  image?: string;
  icon?: React.ReactNode;
  badge?: string;
}

const CATEGORIES: CategoryIconItem[] = [
  {
    name: "Fast Chargers",
    slug: "chargers",
    image: "/images/categories/chargers.jpg",
    badge: "GaN 65W",
  },
  {
    name: "Charging Cables",
    slug: "cables",
    image: "/images/categories/cables.jpg",
    badge: "100W PD",
  },
  {
    name: "Power Banks",
    slug: "power-banks",
    image: "/images/categories/power-banks.jpg",
    badge: "20,000mAh",
  },
  {
    name: "Wireless Audio",
    slug: "earbuds",
    image: "/images/categories/audio.jpg",
    badge: "ANC Sound",
  },
  {
    name: "Car Mounts",
    slug: "car-accessories",
    icon: <Car className="w-8 h-8 text-primary" />,
    badge: "Fast Mag",
  },
  {
    name: "Power Hubs",
    slug: "chargers",
    icon: <Zap className="w-8 h-8 text-primary" />,
    badge: "Multi-Port",
  },
  {
    name: "All Tech Gear",
    slug: "",
    icon: <BatteryCharging className="w-8 h-8 text-primary" />,
    badge: "Catalog",
  },
];

export function CategoryIconStrip() {
  return (
    <section className="w-full bg-white dark:bg-[#15181E] border-b border-gray-100 dark:border-[#262C37] py-4 sm:py-6 font-sans">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Horizontal scroll on mobile, flex-wrap centered on desktop */}
        <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-6 lg:gap-8 overflow-x-auto pb-2 scrollbar-none snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((cat) => {
            const href = cat.slug ? `/shop?category=${cat.slug}` : "/shop";
            return (
              <Link
                key={cat.name}
                href={href}
                className="group flex flex-col items-center shrink-0 snap-start transition-transform hover:-translate-y-1 cursor-pointer"
              >
                {/* Circular Icon Circle */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-50 dark:bg-[#1C2028] border-2 border-gray-200 dark:border-[#2A2F3A] group-hover:border-primary group-hover:shadow-lg group-hover:shadow-red-600/20 flex items-center justify-center p-2.5 transition-all overflow-hidden">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="80px"
                      className="object-contain p-2 mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center group-hover:scale-110 transition-transform">
                      {cat.icon}
                    </div>
                  )}

                  {/* Micro badge */}
                  {cat.badge && (
                    <span className="absolute bottom-0 inset-x-0 bg-primary/95 text-white text-[8px] font-black text-center uppercase tracking-tight py-0.5">
                      {cat.badge}
                    </span>
                  )}
                </div>

                {/* Title */}
                <span className="mt-2 text-xs sm:text-[13px] font-bold text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors text-center truncate max-w-[85px] sm:max-w-[100px]">
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
