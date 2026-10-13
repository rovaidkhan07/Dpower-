"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DepthCard } from "./depth-card";

export function TechFeaturesSection() {
  return (
    <section className="w-full font-sans bg-background pb-10 md:pb-16">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <DepthCard className="bg-[#1C1F22] text-white rounded-xl p-6 lg:p-8 grid grid-cols-[minmax(0,1fr)_100px] sm:grid-cols-[minmax(0,1fr)_140px] md:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_160px] items-center gap-5">
          <div className="min-w-0">
            <span className="inline-flex px-3 py-1 bg-white/10 border border-white/10 rounded-full text-[10px] font-bold mb-4">Everyday essentials</span>
            <h3 className="text-2xl lg:text-[28px] font-bold tracking-tight leading-tight mb-3">Power up your everyday</h3>
            <p className="text-sm text-white/70 mb-5 leading-relaxed">Explore chargers and adapters for home, work and travel.</p>
            <Link href="/shop?category=chargers" className="inline-flex items-center gap-2 bg-white text-[#111418] px-4 py-3 rounded-full font-semibold text-xs transition-transform motion-safe:hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
              Shop Chargers <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="relative w-full aspect-square md:max-w-[200px] md:mx-auto xl:max-w-none bg-white rounded-xl">
            <Image src="/images/categories/chargers.jpg" alt="Charging accessories" fill sizes="(max-width: 639px) 100px, 200px" className="object-contain p-3 rounded-xl" />
          </div>
        </DepthCard>

        <DepthCard className="bg-secondary text-foreground border border-border rounded-xl p-6 lg:p-8 grid grid-cols-[minmax(0,1fr)_100px] sm:grid-cols-[minmax(0,1fr)_140px] md:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_160px] items-center gap-5">
          <div className="min-w-0">
            <span className="inline-flex px-3 py-1 bg-background border border-border rounded-full text-[10px] font-bold mb-4">Earbuds & Audio</span>
            <h3 className="text-2xl lg:text-[28px] font-bold tracking-tight leading-tight mb-3">Find your everyday sound</h3>
            <p className="text-sm text-secondary-foreground mb-5 leading-relaxed">Browse audio accessories for your music, calls and commute.</p>
            <Link href="/shop?category=earbuds" className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-3 rounded-full font-semibold text-xs transition-transform motion-safe:hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
              Shop Audio <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="relative w-full aspect-square md:max-w-[200px] md:mx-auto xl:max-w-none">
            <Image src="/images/categories/audio.jpg" alt="Audio accessories" fill sizes="(max-width: 639px) 100px, 200px" className="object-contain rounded-xl mix-blend-multiply dark:mix-blend-normal" />
          </div>
        </DepthCard>
      </div>
    </section>
  );
}
