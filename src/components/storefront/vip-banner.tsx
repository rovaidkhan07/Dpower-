"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BadgePercent, Building2 } from "lucide-react";

export function VipBanner() {
  return (
    <section className="overflow-hidden bg-background py-7 font-sans sm:py-12">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#9f1117] via-[#d71920] to-[#ef2b32] p-6 text-white shadow-xl sm:p-9 lg:p-11">
          <div aria-hidden="true" className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div aria-hidden="true" className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-black/15 blur-3xl" />

          <div className="relative z-10 grid items-center gap-7 md:grid-cols-[1fr_auto]">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-white/90"><BadgePercent className="h-4 w-4" /> Trade Buyers</div>
              <h2 className="text-2xl font-black leading-tight sm:text-3xl lg:text-4xl">Need stock for your shop or reseller business?</h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base">Send a bulk inquiry and discuss quantity, stock availability and trade requirements with DK Power before placing a larger order.</p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-extrabold text-[#b51218] transition hover:bg-zinc-100"><Building2 className="h-4 w-4" /> Bulk Inquiry</Link>
              <Link href="/shop" className="inline-flex items-center gap-2 rounded-full border border-white/60 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-white/10">View Catalog <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
