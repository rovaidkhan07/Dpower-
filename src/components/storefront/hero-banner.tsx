"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";


export function HeroBanner() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="w-full font-sans bg-secondary/30 dark:bg-background/40 border-b border-border/50">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 lg:py-12">
        <div className="grid grid-cols-[1.1fr_0.9fr] sm:grid-cols-2 items-center gap-2 sm:gap-6 lg:gap-10">
          {/* Text Content */}
          <div className="relative z-20 min-w-0 pr-1 sm:pr-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-white dark:bg-[#15181E] text-slate-800 dark:text-slate-200 rounded-full text-[10px] sm:text-xs font-semibold border border-slate-200/80 dark:border-[#262C37] shadow-2xs mb-2 sm:mb-3">
              <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
              Mobile Accessories
            </div>

            <h1 className="text-lg sm:text-3xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.12] mb-1.5 sm:mb-3">
              Smart Accessories<br />For Everyday Tech
            </h1>

            <p className="text-[11px] sm:text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed mb-3 sm:mb-5 line-clamp-2 sm:line-clamp-none">
              Chargers, cables, earbuds and power banks for a connected lifestyle.
            </p>

            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 bg-black hover:bg-slate-800 text-white text-[11px] sm:text-xs lg:text-sm font-bold px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-sm transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Shop All Products <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          {/* Hero Visual */}
          <div
            className="relative w-full aspect-[4/3] max-w-[240px] sm:max-w-[380px] lg:max-w-[460px] mx-auto flex items-center justify-center"
            aria-label="Featured mobile accessories"
          >
            <div
              aria-hidden="true"
              className="absolute w-32 h-32 sm:w-60 sm:h-60 rounded-full bg-orange-500/15 blur-2xl pointer-events-none"
            />

            <motion.div
              animate={
                reduceMotion
                  ? undefined
                  : {
                      y: [0, -5, 0, 5, 0],
                      rotate: [-1, 1, -1],
                    }
              }
              transition={reduceMotion ? undefined : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 w-full h-full"
            >
              <Image
                src="/images/Hero-Image_bg_removed.png.png"
                alt="Kharidly mobile accessories including charger, wireless earbuds, USB-C cables and power bank"
                fill
                sizes="(max-width: 639px) 240px, (max-width: 1023px) 45vw, 460px"
                className="object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.12)]"
                priority
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
