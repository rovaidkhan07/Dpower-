"use client";

import React, { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import { buildWhatsAppSupportUrl } from "@/lib/config/store";

const faqs = [
  {
    q: "Are your products 100% genuine?",
    a: "Yes. Every product on DK Power is 100% original, lab-tested and quality-checked before dispatch. We never sell copies or replicas.",
  },
  {
    q: "How long does delivery take across Pakistan?",
    a: "Orders are dispatched within 24 hours. Delivery takes 1-3 working days in major cities (Karachi, Lahore, Islamabad, Rawalpindi) and 2-4 working days in other regions. Live courier tracking is provided.",
  },
  {
    q: "What are the delivery charges?",
    a: "Delivery is FREE on all orders above PKR 3,000. For orders below PKR 3,000, a nominal delivery charge is calculated at checkout.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Cash on Delivery (COD) nationwide and Direct Bank Transfer for instant dispatch.",
  },
  {
    q: "What is your warranty and return policy?",
    a: "All DK Power chargers, cables, and power banks carry our official brand warranty. If you experience any manufacturing defect or transit damage, message us on WhatsApp with your order number for an immediate replacement.",
  },
  {
    q: "Do you offer wholesale and bulk discounts for retailers?",
    a: "Yes! DK Power is Pakistan's leading wholesale manufacturer and distributor. We offer volume tiers and exclusive wholesale rates for phone shop owners and reseller businesses.",
  },
  {
    q: "How do I track my order status?",
    a: "After placing an order you receive an Order Number and secure Tracking Token. Enter them on our 'Track Your Order' page to monitor live courier milestone updates.",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-slate-50 dark:bg-[#0F1217] min-h-screen">
      {/* Hero */}
      <div className="bg-[#111111] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4">
            Help Center
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Everything you need to know about shopping, wholesale ordering, and warranties at DK Power.
          </p>
        </div>
      </div>

      {/* Accordion */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="bg-white dark:bg-[#15181E] rounded-2xl border border-slate-200 dark:border-[#262C37] shadow-xs overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {f.q}
                  </span>
                  <span
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isOpen
                        ? "bg-primary text-white"
                        : "bg-slate-100 dark:bg-[#262C37] text-slate-500 dark:text-[#8A919C]"
                    }`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                    <p className="text-sm text-slate-600 dark:text-[#8A919C] leading-relaxed border-t border-slate-100 dark:border-[#262C37] pt-4">
                      {f.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support CTA */}
        <div className="mt-10 bg-white dark:bg-[#15181E] rounded-2xl border border-slate-200 dark:border-[#262C37] p-6 sm:p-8 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/20 text-primary flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Still have a question?
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Reach out to our customer care team on WhatsApp — we respond promptly.
          </p>
          <a
            href={buildWhatsAppSupportUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 bg-primary hover:bg-accent text-white font-bold text-sm px-8 py-3 rounded-full transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
