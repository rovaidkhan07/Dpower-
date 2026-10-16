"use client";

import React from "react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { buildWhatsAppGeneralSupportUrl } from "@/lib/config/store";

export function WhatsAppFloatingButton() {
  const url = buildWhatsAppGeneralSupportUrl();

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with DK Power on WhatsApp for wholesale inquiries"
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 z-40 group flex items-center gap-2 bg-gradient-to-r from-[#25D366] to-[#1EBE5D] hover:from-[#20BA59] hover:to-[#1AA852] text-white px-3 py-2.5 sm:px-3.5 sm:py-2.5 rounded-full shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/50 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 backdrop-blur-xs cursor-pointer select-none"
    >
      <div className="relative flex items-center justify-center shrink-0">
        <WhatsAppIcon className="size-5 text-white drop-shadow-xs" />
        <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-white animate-ping" />
        <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-emerald-200" />
      </div>

      <div className="flex flex-col text-left">
        <span className="hidden sm:block text-[9px] font-semibold text-emerald-100 uppercase tracking-wider leading-none">
          Need Help?
        </span>
        <span className="text-xs font-bold text-white tracking-wide leading-tight sm:mt-0.5">
          Chat on WhatsApp
        </span>
      </div>
    </a>
  );
}
