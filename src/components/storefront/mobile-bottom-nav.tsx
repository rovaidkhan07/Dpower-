"use client";

import React from "react";
import Link from "next/link";
import { Home, Grid, ShoppingCart, User } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { useCart } from "@/hooks/use-cart";
import { usePathname } from "next/navigation";
import { buildWhatsAppGeneralSupportUrl } from "@/lib/config/store";

export function MobileBottomNav() {
  const { items } = useCart();
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 z-50 pb-[env(safe-area-inset-bottom)] shadow-xs"
    >
      <div className="flex justify-around items-center h-14">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-3 ${
            pathname === "/"
              ? "text-[#b51218] font-bold"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Home className="size-4.5" />
          <span className="text-[10px] mt-1 font-semibold">Home</span>
        </Link>

        <Link
          href="/categories"
          className={`flex flex-col items-center justify-center py-1 px-3 ${
            pathname === "/categories" || pathname === "/shop"
              ? "text-[#b51218] font-bold"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Grid className="size-4.5" />
          <span className="text-[10px] mt-1 font-semibold">Categories</span>
        </Link>

        <Link
          href="/cart"
          className={`flex flex-col items-center justify-center py-1 px-3 relative ${
            pathname === "/cart"
              ? "text-[#b51218] font-bold"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <div className="relative">
            <ShoppingCart className="size-4.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#b51218] text-white text-[9px] size-4 rounded-full flex items-center justify-center font-black shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-semibold">Cart</span>
        </Link>

        <Link
          href="/account"
          className={`flex flex-col items-center justify-center py-1 px-3 ${
            pathname === "/account"
              ? "text-[#b51218] font-bold"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <User className="size-4.5" />
          <span className="text-[10px] mt-1 font-semibold">Account</span>
        </Link>

        <a
          href={buildWhatsAppGeneralSupportUrl()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="flex flex-col items-center justify-center py-1 px-3 text-[#25D366] hover:text-[#1ebd59]"
        >
          <WhatsAppIcon className="size-4.5" aria-hidden="true" />
          <span className="text-[10px] mt-1 font-semibold">WhatsApp</span>
        </a>
      </div>
    </nav>
  );
}
