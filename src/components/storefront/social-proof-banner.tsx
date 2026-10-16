"use client";

import React, { useState } from "react";
import { Star, ShieldCheck, CheckCircle2, ChevronLeft, ChevronRight, Users, Award, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const REVIEWS = [
  {
    id: 1,
    name: "Muhammad Usman",
    city: "Karachi (Gulshan-e-Iqbal)",
    verified: true,
    rating: 5,
    product: "DK Power 65W GaN Multi-Port Fast Charger",
    date: "2 days ago",
    comment:
      "Ordered the 65W GaN charger for my MacBook Pro and Galaxy S24 Ultra. Reached Karachi in 24 hours via COD. Charges my laptop at full 65W without getting hot. Solid build quality, genuine packaging!",
  },
  {
    id: 2,
    name: "Hamza Shafiq",
    city: "Lahore (DHA Phase 5)",
    verified: true,
    rating: 5,
    product: "DK Power 20,000mAh 65W Fast Power Bank",
    date: "3 days ago",
    comment:
      "I run an online mobile accessories shop in Hafeez Centre and ordered bulk stock. Customers love the heavy-duty finish and digital display. DK Power wholesale rates and dispatch speed are unbeatable.",
  },
  {
    id: 3,
    name: "Sarah Tariq",
    city: "Islamabad (F-10)",
    verified: true,
    rating: 5,
    product: "DK Power 100W Zinc Alloy Braided Type-C Cable",
    date: "5 days ago",
    comment:
      "The cable thickness and zinc alloy connectors are ultra durable. Super fast charging handshaking works instantly on iPhone 16 Pro Max and iPad. Best tech store in Pakistan!",
  },
  {
    id: 4,
    name: "Asad Raza",
    city: "Rawalpindi (Saddar)",
    verified: true,
    rating: 5,
    product: "DK Power ANC Pro Wireless Earbuds",
    date: "1 week ago",
    comment:
      "Active Noise Cancellation is shockingly good for this price point. Clean bass, long battery life, and crystal clear call quality even on the highway. 10/10 recommended.",
  },
];

export function SocialProofBanner() {
  const [activeIndex, setActiveIndex] = useState(0);

  const prevReview = () => setActiveIndex((prev) => (prev === 0 ? REVIEWS.length - 1 : prev - 1));
  const nextReview = () => setActiveIndex((prev) => (prev === REVIEWS.length - 1 ? 0 : prev + 1));

  return (
    <section className="w-full bg-white dark:bg-[#15181E] py-10 sm:py-16 font-sans border-t border-gray-100 dark:border-[#262C37]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Trust Numbers Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-gray-50 dark:bg-[#1C2028] border border-gray-200/80 dark:border-[#2A2F3A] rounded-2xl p-4 sm:p-5 text-center">
            <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/20 text-primary flex items-center justify-center mx-auto mb-2.5">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">50,000+</p>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">Satisfied Buyers</p>
          </div>

          <div className="bg-gray-50 dark:bg-[#1C2028] border border-gray-200/80 dark:border-[#2A2F3A] rounded-2xl p-4 sm:p-5 text-center">
            <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center mx-auto mb-2.5">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">4.9 / 5.0</p>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">Average Rating</p>
          </div>

          <div className="bg-gray-50 dark:bg-[#1C2028] border border-gray-200/80 dark:border-[#2A2F3A] rounded-2xl p-4 sm:p-5 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center mx-auto mb-2.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">100% Genuine</p>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">Official Warranty</p>
          </div>

          <div className="bg-gray-50 dark:bg-[#1C2028] border border-gray-200/80 dark:border-[#2A2F3A] rounded-2xl p-4 sm:p-5 text-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-600 flex items-center justify-center mx-auto mb-2.5">
              <Truck className="w-5 h-5" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">250+ Cities</p>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">Nationwide Express COD</p>
          </div>
        </div>

        {/* Testimonials Showcase with Live Carousel */}
        <div className="bg-gradient-to-br from-[#111111] via-[#161616] to-[#1c1c1c] rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-white/5 relative overflow-hidden">
          {/* Decorative ambient red glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 relative z-10">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                <Award className="w-4 h-4 text-primary" /> Verified Customer Trust
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
                Customer Voices on DK Power
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
                Real feedback from wholesale resellers, tech power users, and smartphone owners across Pakistan.
              </p>
            </div>

            {/* Nav Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevReview}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextReview}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Next review"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Review Card */}
          <div className="relative min-h-[170px] z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[...Array(REVIEWS[activeIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-gray-300">
                      5.0 • {REVIEWS[activeIndex].date}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Buyer</span>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-gray-200 italic leading-relaxed mb-4">
                  &ldquo;{REVIEWS[activeIndex].comment}&rdquo;
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-white/10 pt-4 text-xs">
                  <div>
                    <strong className="text-white font-bold">{REVIEWS[activeIndex].name}</strong>
                    <span className="text-gray-400 ml-1.5">• {REVIEWS[activeIndex].city}</span>
                  </div>
                  <span className="text-primary font-semibold">
                    Product: {REVIEWS[activeIndex].product}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
