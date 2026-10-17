"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { ProductWithDetails } from "@/types";

interface FlashDealsProps {
  products?: ProductWithDetails[];
}

interface DealItem {
  id: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: string;
  rating: number;
}

const DEFAULT_FLASH_DEALS: DealItem[] = [
  {
    id: "flash-deal-1",
    slug: "65w-gan-fast-charger-white",
    title: "DK Power 65W GaN Fast Charger + 100W Cable (White)",
    image: "/products/flash/flash-1-white-gan.png",
    price: 2490,
    originalPrice: 3500,
    discount: "UP TO 40% OFF",
    rating: 5.0,
  },
  {
    id: "flash-deal-2",
    slug: "65w-gan-fast-charger-black",
    title: "DK Power 65W GaN Fast Charger + 100W Cable (Black)",
    image: "/products/flash/flash-2-black-gan.png",
    price: 2490,
    originalPrice: 3500,
    discount: "UP TO 40% OFF",
    rating: 5.0,
  },
  {
    id: "flash-deal-3",
    slug: "65w-dual-port-fast-charger",
    title: "DK Power 65W GaN Dual Port Charger + Braided Cable",
    image: "/products/flash/flash-3-dual-gan.png",
    price: 2690,
    originalPrice: 3500,
    discount: "UP TO 40% OFF",
    rating: 5.0,
  },
  {
    id: "flash-deal-4",
    slug: "100w-gan-pro-fast-charger",
    title: "DK Power 100W GaN Pro Ultra Charger + 100W Cable",
    image: "/products/flash/flash-4-pro-gan.png",
    price: 2990,
    originalPrice: 3500,
    discount: "UP TO 40% OFF",
    rating: 5.0,
  },
];

export function FlashDealsSection({ products }: FlashDealsProps) {
  const { addItem, openCart } = useCart();

  // 6 hour 35 min rolling countdown matching mockup
  const [timeLeft, setTimeLeft] = useState({
    hours: 6,
    minutes: 35,
    seconds: 12,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 6, minutes: 35, seconds: 12 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatUnit = (val: number) => String(val).padStart(2, "0");

  const handleAddToCart = (deal: DealItem) => {
    // If a matching database product exists, use its id, otherwise fallback to deal item
    const matchedProduct = products?.find((p) => p.slug === deal.slug || p.id === deal.id);
    if (matchedProduct) {
      addItem(matchedProduct, null, 1);
    } else {
      addItem({
        id: deal.id,
        productId: deal.id,
        name: deal.title,
        price: deal.price,
        image: deal.image,
        quantity: 1,
        slug: deal.slug,
      });
    }
    openCart();
  };

  return (
    <section className="w-full bg-white dark:bg-[#111215] py-7 sm:py-10 font-sans border-b border-gray-100 dark:border-white/5">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title with subtle divider accents */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1 max-w-[80px] sm:max-w-[140px]" />
          <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-gray-900 dark:text-white text-center">
            FLASH WHOLESALE DEALS
          </h2>
          <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1 max-w-[80px] sm:max-w-[140px]" />
        </div>

        {/* 4 Mockup Cards Shelf */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {DEFAULT_FLASH_DEALS.map((deal) => (
            <div
              key={deal.id}
              className="group relative bg-white dark:bg-[#16181f] rounded-2xl border border-gray-200/90 dark:border-gray-800 p-3.5 sm:p-5 flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-200"
            >
              {/* Angled Corner Ribbon: SALE UP TO 40% OFF */}
              <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden pointer-events-none z-10">
                <div className="absolute top-3.5 -left-8 w-28 sm:w-30 bg-[#b51218] text-white text-[8px] sm:text-[9px] font-black tracking-tight text-center py-1 -rotate-45 shadow-xs uppercase leading-tight">
                  SALE<br />
                  <span className="text-[6.5px] sm:text-[7.5px] font-semibold opacity-95">UP TO 40% OFF</span>
                </div>
              </div>

              {/* Product Photo on White Background */}
              <Link
                href={`/products/${deal.slug}`}
                className="relative w-full aspect-square mb-2 sm:mb-3 flex items-center justify-center bg-white dark:bg-transparent rounded-xl overflow-hidden cursor-pointer"
              >
                <Image
                  src={deal.image}
                  alt={deal.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 280px"
                  className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                />
              </Link>

              {/* Price Row: Red PKR + Strikethrough Rs. */}
              <div className="pt-1">
                <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2">
                  <span className="text-[#b51218] font-extrabold text-sm sm:text-base lg:text-lg">
                    PKR. {deal.price.toLocaleString()}
                  </span>
                  <span className="text-gray-400 line-through text-xs font-medium">
                    Rs. {deal.originalPrice.toLocaleString()}
                  </span>
                </div>

                {/* Black Urgency Timer Pill: ⚡ Deal Ending In: 06h 35m 12s ⚡ */}
                <div className="w-full bg-black text-white text-[10px] sm:text-[11.5px] font-bold py-1.5 px-2 rounded-full flex items-center justify-center gap-1 sm:gap-1.5 mb-2 shadow-2xs">
                  <span className="text-amber-400">⚡</span>
                  <span className="hidden sm:inline">Deal Ending In:</span>
                  <span className="font-mono tracking-tight">
                    {formatUnit(timeLeft.hours)}h {formatUnit(timeLeft.minutes)}m {formatUnit(timeLeft.seconds)}s
                  </span>
                  <span className="text-amber-400">⚡</span>
                </div>

                {/* Rating ★ 5.0 */}
                <div className="flex items-center gap-1 text-xs font-bold text-gray-800 dark:text-gray-200 mb-3">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{deal.rating.toFixed(1)}</span>
                </div>

                {/* Full-Width Red Button: Add To Cart */}
                <button
                  type="button"
                  onClick={() => handleAddToCart(deal)}
                  className="w-full bg-[#b51218] hover:bg-[#9b1117] active:scale-[0.98] text-white py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all shadow-xs cursor-pointer flex items-center justify-center"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
