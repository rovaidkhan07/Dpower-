"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Crown, ArrowRight, Check } from "lucide-react";

export function VipBanner() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setEmail("");
      setSubmitted(false);
    }, 4000);
  };

  return (
    <section className="py-6 sm:py-10 bg-background overflow-hidden font-sans">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="rounded-3xl bg-gradient-to-r from-[#FF6B00] via-[#FF7A1A] to-[#FF8C33] text-white p-5 sm:p-8 lg:p-10 relative overflow-hidden shadow-lg"
        >
          {/* Subtle decorative glow circles */}
          <div
            aria-hidden="true"
            className="absolute -top-16 -right-16 h-60 w-60 rounded-full bg-white/10 blur-3xl pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-16 right-1/4 h-48 w-48 rounded-full bg-black/10 blur-2xl pointer-events-none"
          />

          <div className="relative z-10 max-w-xl">
            {/* Tag with Crown icon */}
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-white/95 mb-2">
              <Crown className="w-4 h-4 text-amber-200 fill-amber-200" aria-hidden="true" />
              <span>Kharidly VIP Club</span>
            </div>

            {/* Heading */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight">
              Be the First to<br className="sm:hidden" /> Get Exclusive Deals
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-white/90 mt-1 sm:mt-1.5 leading-relaxed">
              Early access, special offers and more.
            </p>

            {/* Email form pill */}
            <form onSubmit={handleSubmit} className="mt-4 sm:mt-6">
              <div className="bg-white rounded-full flex items-center p-1.5 pl-4 max-w-md w-full shadow-md transition-shadow focus-within:ring-2 focus-within:ring-black/20">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  aria-label="Email address for VIP Club"
                  className="w-full bg-transparent border-0 outline-none text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:ring-0 pr-2"
                />
                <button
                  type="submit"
                  aria-label="Join VIP Club"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black hover:bg-neutral-800 text-white flex items-center justify-center shrink-0 transition-all active:scale-95 shadow-sm"
                >
                  {submitted ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </div>
              {submitted && (
                <p className="text-[11px] text-white/95 mt-1.5 pl-3 font-semibold">
                  ✓ You&apos;re subscribed to exclusive VIP deals!
                </p>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
