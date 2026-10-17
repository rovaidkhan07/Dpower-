"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BatteryCharging,
  Cable,
  Headphones,
  PlugZap,
  Search,
  ShoppingBag,
  Smartphone,
  UserRound,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";

const navItems = [
  { label: "Earbuds", href: "/shop?category=earbuds", icon: Headphones },
  { label: "Chargers", href: "/shop?category=chargers", icon: PlugZap },
  { label: "Cables", href: "/shop?category=cables", icon: Cable },
  { label: "Power Banks", href: "/shop?category=power-banks", icon: BatteryCharging },
  { label: "Cases", href: "/shop?category=phone-covers", icon: Smartphone },
];

export function KharidlyDesktopHeader() {
  const router = useRouter();
  const { items, openCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (query) router.push(`/shop?search=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#f5f6f8]/95 px-4 pt-4 backdrop-blur-xl">
      <div className="mx-auto flex h-[82px] max-w-[1440px] items-center gap-6 rounded-[28px] border border-black/[0.04] bg-white px-7 shadow-[0_16px_45px_rgba(17,24,39,0.06)]">
        <Link href="/" aria-label="Kharidly home" className="shrink-0">
          <Image
            src="/logo/logo-wordmark.svg"
            alt="Kharidly"
            width={176}
            height={44}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <form onSubmit={submitSearch} className="w-[410px] shrink-0">
          <div className="flex h-12 items-center gap-3 rounded-full border border-black/10 bg-[#fafafa] px-4 transition focus-within:border-[#ff6b00]/40 focus-within:ring-4 focus-within:ring-[#ff6b00]/5">
            <Search className="h-4.5 w-4.5 text-[#20242a]" aria-hidden="true" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search for products, brands, categories..."
              className="min-w-0 flex-1 bg-transparent text-sm text-[#24262b] outline-none placeholder:text-[#8a8f98]"
            />
          </div>
        </form>

        <nav className="flex min-w-0 flex-1 items-center justify-center gap-5" aria-label="Product categories">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="group flex min-w-[58px] flex-col items-center gap-1 text-[11px] font-medium text-[#17191d] transition hover:text-[#ff6b00]"
            >
              <Icon className="h-5.5 w-5.5 stroke-[1.75] transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
              <span className="whitespace-nowrap">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/shop")}
            aria-label="Search products"
            className="flex h-11 w-11 items-center justify-center rounded-full text-[#111318] transition hover:bg-[#f4f4f4]"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            href="/login"
            aria-label="Account"
            className="flex h-11 w-11 items-center justify-center rounded-full text-[#111318] transition hover:bg-[#f4f4f4]"
          >
            <UserRound className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={openCart}
            aria-label={`Cart with ${cartCount} items`}
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-[#111318] transition hover:bg-[#f4f4f4]"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff6b00] px-1 text-[10px] font-bold text-white">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
