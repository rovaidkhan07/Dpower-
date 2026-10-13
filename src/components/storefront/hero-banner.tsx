"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Boxes, Building2 } from "lucide-react";

export function HeroBanner() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="w-full border-b border-border/60 bg-gradient-to-br from-white via-red-50/50 to-white font-sans dark:from-background dark:via-red-950/10 dark:to-background">
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid items-center gap-7 sm:grid-cols-2 lg:gap-12">
          <div className="relative z-20 min-w-0">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-700 shadow-sm dark:border-red-900/60 dark:bg-[#151516] dark:text-red-300">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Wholesale Mobile Accessories
            </div>

            <h1 className="mb-4 text-3xl font-black leading-[1.08] tracking-tight text-[#151515] sm:text-4xl lg:text-6xl dark:text-white">
              Stock Your Store.<br /><span className="text-primary">Power Your Business.</span>
            </h1>

            <p className="mb-6 max-w-xl text-sm leading-relaxed text-zinc-600 sm:text-base lg:text-lg dark:text-zinc-300">
              DK Power supplies chargers, cables, power banks, audio accessories and everyday mobile essentials for retailers, resellers and trade buyers across Pakistan.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/shop" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-accent active:scale-95">
                Browse Wholesale Catalog <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border-2 border-[#151515] bg-white px-5 py-3 text-sm font-bold text-[#151515] transition hover:bg-zinc-100 dark:border-white dark:bg-transparent dark:text-white dark:hover:bg-white/10">
                Bulk Inquiry <Building2 className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              <span className="flex items-center gap-2"><Boxes className="h-4 w-4 text-primary" /> Trade-focused ordering</span>
              <span className="flex items-center gap-2"><Boxes className="h-4 w-4 text-primary" /> Multi-category stock</span>
            </div>
          </div>

          <div className="relative mx-auto flex aspect-[4/3] w-full max-w-[500px] items-center justify-center" aria-label="DK Power wholesale mobile accessories">
            <div aria-hidden="true" className="absolute h-64 w-64 rounded-full bg-primary/15 blur-3xl sm:h-80 sm:w-80" />
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -6, 0, 6, 0], rotate: [-1, 1, -1] }}
              transition={reduceMotion ? undefined : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 h-full w-full"
            >
              <Image src="/images/Hero-Image_bg_removed.png.png" alt="Wholesale mobile accessories available from DK Power" fill sizes="(max-width: 639px) 92vw, (max-width: 1023px) 45vw, 500px" className="object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.16)]" priority />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
