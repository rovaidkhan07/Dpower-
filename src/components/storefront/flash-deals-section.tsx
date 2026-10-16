"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Flame, Zap, Clock, ShieldCheck } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { ProductWithDetails } from "@/types";

interface FlashDealsProps {
  products: ProductWithDetails[];
}

export function FlashDealsSection({ products }: FlashDealsProps) {
  // 6 hour 45 min rolling countdown
  const [timeLeft, setTimeLeft] = useState({
    hours: 6,
    minutes: 42,
    seconds: 18,
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
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatUnit = (val: number) => String(val).padStart(2, "0");

  const displayProducts = products.slice(0, 4);
  if (!displayProducts || displayProducts.length === 0) return null;

  return (
    <section className="w-full bg-[#f8f9fa] dark:bg-[#111317] py-8 sm:py-12 font-sans border-b border-gray-200/80 dark:border-[#262C37]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* DabLew High-Energy Deals Header Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#111111] via-[#1a1a1a] to-[#b51218] p-4 sm:p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border border-red-900/30">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-red-600/40 shrink-0">
              <Flame className="w-6 h-6 fill-white text-white animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-[10px] font-black uppercase tracking-widest bg-amber-400 text-black px-2 py-0.5 rounded-full">
                  Limited Time
                </span>
                <span className="text-xs font-bold text-red-200 uppercase tracking-wider">
                  Nationwide Express Dispatch
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mt-0.5">
                ⚡ Flash Deals Of The Day ⚡
              </h2>
            </div>
          </div>

          {/* Live Countdown Urgency Timer Box */}
          <div className="flex items-center gap-2 sm:gap-3 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 shadow-inner">
            <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: "8s" }} />
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider hidden sm:inline">
              ⚡ Deal Ending In:
            </span>
            <div className="flex items-center gap-1.5 font-mono">
              <div className="flex flex-col items-center">
                <span className="bg-primary text-white text-sm sm:text-base font-black px-2 py-1 rounded-md shadow-xs min-w-8 text-center">
                  {formatUnit(timeLeft.hours)}
                </span>
                <span className="text-[8px] text-gray-400 uppercase font-sans mt-0.5">Hours</span>
              </div>
              <span className="text-primary font-black text-sm pb-3">:</span>
              <div className="flex flex-col items-center">
                <span className="bg-primary text-white text-sm sm:text-base font-black px-2 py-1 rounded-md shadow-xs min-w-8 text-center">
                  {formatUnit(timeLeft.minutes)}
                </span>
                <span className="text-[8px] text-gray-400 uppercase font-sans mt-0.5">Mins</span>
              </div>
              <span className="text-primary font-black text-sm pb-3">:</span>
              <div className="flex flex-col items-center">
                <span className="bg-primary text-white text-sm sm:text-base font-black px-2 py-1 rounded-md shadow-xs min-w-8 text-center">
                  {formatUnit(timeLeft.seconds)}
                </span>
                <span className="text-[8px] text-gray-400 uppercase font-sans mt-0.5">Secs</span>
              </div>
            </div>
          </div>

          <Link
            href="/shop?sort=best-selling"
            className="hidden lg:inline-flex items-center gap-1.5 text-xs font-bold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-xl transition-all shrink-0"
          >
            <span>View All Flash Deals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4-Column Product Grid Shelf */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {displayProducts.map((product) => (
            <div key={product.id} className="flex flex-col h-full">
              <ProductCard product={product} variant="standard" />
              {/* DabLew stock urgency bar below product */}
              <div className="mt-2 bg-white dark:bg-[#15181E] border border-gray-100 dark:border-[#262C37] rounded-xl p-2 shadow-2xs">
                <div className="flex justify-between text-[10px] font-bold text-gray-600 dark:text-gray-300 mb-1">
                  <span className="flex items-center gap-1 text-primary">
                    <Zap className="w-3 h-3 fill-primary" /> Almost Sold Out
                  </span>
                  <span>92% Claimed</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-[#20242D] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full w-[92%]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
