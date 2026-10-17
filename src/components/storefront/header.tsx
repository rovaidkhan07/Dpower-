"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
  MapPin,
  ChevronDown,
} from "lucide-react";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
import { useCart } from "@/hooks/use-cart";
import { ACTIVE_CATEGORIES } from "@/lib/config/categories";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isBrandMenuOpen, setIsBrandMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { items, openCart } = useCart();
  const router = useRouter();
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) router.push(`/shop?search=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 shadow-sm font-sans">
        {/* 1. Top Announcement Bar (Deep Crimson Red #9b1117) */}
        <div className="bg-[#9b1117] text-white py-1.5 px-4 text-xs font-semibold tracking-wide border-b border-white/10">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between">
            {/* Desktop Left Ticker */}
            <div className="hidden sm:flex items-center gap-3 text-white/95">
              <span>Wholesale Deals !! Check Now</span>
              <span className="text-white/40">|</span>
              <span>Up to 40% OFF Fast Chargers</span>
              <span className="text-white/40">|</span>
              <span>Nationwide Express COD</span>
            </div>

            {/* Mobile Ticker */}
            <div className="sm:hidden w-full text-center truncate">
              <span>Wholesale Deals !! Check Now | 40% OFF</span>
            </div>

            {/* Right Quick Links */}
            <div className="hidden lg:flex items-center gap-5 text-white/90 text-xs font-medium">
              <Link href="/warranty-policy" className="hover:underline">
                Warranty Policy
              </Link>
              <Link href="/delivery-information" className="hover:underline">
                Delivery Information
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Main Middle Row (Logo + Center Search + Cart & Login) */}
        <div className={`bg-white dark:bg-[#151516] transition-all border-b border-gray-200/90 dark:border-border ${isScrolled ? "py-2" : "py-3 sm:py-3.5"}`}>
          <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1 text-gray-800 dark:text-gray-100 hover:text-primary lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center transition-transform hover:scale-[1.02] shrink-0"
              aria-label="DK Power Home"
            >
              <Image
                src="/logo/dk-power.png"
                alt="DK Power"
                width={180}
                height={46}
                className="h-8 sm:h-10 w-auto object-contain drop-shadow-2xs"
                priority
              />
            </Link>

            {/* Center Rounded Search Bar with Red Circular Button (Desktop) */}
            <form
              onSubmit={submitSearch}
              className="hidden lg:flex flex-1 max-w-xl mx-4 relative items-center"
            >
              <div className="relative flex h-11 w-full items-center rounded-full border border-gray-300 dark:border-[#2A2F3A] bg-white dark:bg-[#1C2028] shadow-2xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all pr-1.5 pl-5">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chargers, cables, power banks or SKU..."
                  className="h-full flex-1 bg-transparent text-xs sm:text-sm outline-none text-gray-800 dark:text-white placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="w-8 h-8 rounded-full bg-[#d71920] hover:bg-[#b51218] text-white flex items-center justify-center shrink-0 shadow-xs cursor-pointer transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Right Action Items */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {/* Trade Login / Register (Desktop) */}
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-100 hover:text-[#b51218] transition-colors"
              >
                <User className="w-4 h-4 text-gray-500" />
                <span>Trade Login / Register</span>
              </Link>

              {/* Desktop Cart Pill: "Cart (0)" */}
              <button
                onClick={openCart}
                className="hidden sm:flex items-center gap-2 bg-[#b51218] hover:bg-[#9b1117] text-white px-4 py-2 rounded-full font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
                aria-label="View Cart"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Cart ({cartCount})</span>
              </button>

              {/* Mobile Cart Icon with Red Badge */}
              <button
                onClick={openCart}
                className="sm:hidden relative p-1.5 text-gray-800 dark:text-gray-100 cursor-pointer"
                aria-label="View Cart"
              >
                <div className="relative">
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#b51218] text-white text-[10px] size-4.5 rounded-full flex items-center justify-center font-black shadow-xs">
                      {cartCount}
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Search Bar Row */}
          <div className="px-4 pt-2.5 lg:hidden">
            <form onSubmit={submitSearch} className="relative flex h-10 w-full items-center">
              <div className="relative flex h-full w-full items-center rounded-full border border-gray-300 dark:border-[#2A2F3A] bg-white dark:bg-[#1C2028] shadow-2xs pr-1.5 pl-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chargers, cables, power banks..."
                  className="h-full flex-1 bg-transparent text-xs outline-none text-gray-800 dark:text-white placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="w-7 h-7 rounded-full bg-[#d71920] text-white flex items-center justify-center shrink-0"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 3. DabLew Style Black Mega-Menu Nav Bar (#111111) */}
        <nav className="hidden h-11 bg-[#111111] text-white lg:block border-t border-white/5">
          <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-8">
            <div className="flex h-full items-center">
              {/* Wholesale Categories Dropdown Button */}
              <div
                className="relative h-full"
                onMouseEnter={() => setIsCategoryMenuOpen(true)}
                onMouseLeave={() => setIsCategoryMenuOpen(false)}
              >
                <button className="flex h-full items-center gap-2 bg-[#d71920] hover:bg-[#b51218] px-5 text-xs sm:text-sm font-bold text-white transition-colors cursor-pointer">
                  <Menu className="h-4 w-4" />
                  <span>Wholesale Categories</span>
                  <ChevronDown className="h-3.5 w-3.5 ml-1 opacity-80" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isCategoryMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full z-50 w-64 rounded-b-xl border border-gray-200 bg-white py-2 text-foreground shadow-2xl dark:bg-[#181a20]"
                    >
                      {ACTIVE_CATEGORIES.map((category) => (
                        <Link
                          key={category.slug}
                          href={`/shop?category=${category.slug}`}
                          className="flex items-center justify-between px-5 py-2.5 text-xs font-semibold text-gray-800 dark:text-gray-200 hover:bg-red-50 hover:text-primary dark:hover:bg-red-950/20 transition-colors"
                        >
                          <span>{category.name}</span>
                          <span className="text-[10px] text-gray-400">&rarr;</span>
                        </Link>
                      ))}
                      <div className="mt-1 pt-1 border-t border-gray-100 dark:border-border px-5 py-2 bg-gray-50 dark:bg-[#15181E] rounded-b-xl">
                        <Link
                          href="/categories"
                          className="text-xs font-bold text-primary hover:underline flex items-center justify-between"
                        >
                          <span>All Categories</span>
                          <span>&rarr;</span>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation Menu Links (Matching Mockup Exactly) */}
              <div className="ml-6 flex items-center gap-6 text-xs font-semibold">
                {/* Shop By Brand Dropdown */}
                <div
                  className="relative h-full py-3"
                  onMouseEnter={() => setIsBrandMenuOpen(true)}
                  onMouseLeave={() => setIsBrandMenuOpen(false)}
                >
                  <button className="flex items-center gap-1 hover:text-red-300 transition-colors cursor-pointer">
                    <span>Shop By Brand</span>
                    <ChevronDown className="h-3 w-3 opacity-70" />
                  </button>
                  <AnimatePresence>
                    {isBrandMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full z-50 w-44 rounded-xl border border-gray-200 bg-white py-2 text-foreground shadow-xl dark:bg-[#181a20]"
                      >
                        {["DK Power", "Anker", "Baseus", "Joyroom", "Samsung", "Apple"].map((brand) => (
                          <Link
                            key={brand}
                            href={`/shop?brand=${encodeURIComponent(brand)}`}
                            className="block px-4 py-2 text-xs font-medium text-gray-800 dark:text-gray-200 hover:bg-red-50 hover:text-primary dark:hover:bg-red-950/20"
                          >
                            {brand}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link href="/shop" className="hover:text-red-300 transition-colors">
                  Wholesale Catalog
                </Link>
                <Link href="/shop?sort=best-selling" className="hover:text-red-300 transition-colors">
                  Bulk Deals
                </Link>
                <Link href="/shop?sort=newest" className="hover:text-red-300 transition-colors">
                  New Arrivals
                </Link>
                <Link href="/about" className="hover:text-red-300 transition-colors">
                  Reviews
                </Link>
                <Link href="/about" className="hover:text-red-300 transition-colors">
                  About DK Power
                </Link>
              </div>
            </div>

            {/* Right side social links + Track Your Order */}
            <div className="flex items-center gap-4 text-xs font-semibold text-gray-300">
              <div className="flex items-center gap-2.5 text-gray-400">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-white transition-colors">
                  <FacebookIcon className="w-3.5 h-3.5" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white transition-colors">
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="hover:text-white transition-colors">
                  <TwitterIcon className="w-3.5 h-3.5" />
                </a>
              </div>
              <span className="text-gray-600">|</span>
              <Link href="/track-order" className="hover:text-white flex items-center gap-1.5 transition-colors">
                <span>Track Your Order</span>
                <MapPin className="w-3.5 h-3.5 text-primary" />
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Spacer to prevent layout shift below fixed header */}
      <div className="h-[120px] sm:h-[125px] lg:h-[135px] shrink-0" aria-hidden="true" />

      {/* Mobile Slide-Out Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.button
              aria-label="Close menu overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-xs lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed left-0 top-0 z-[101] h-full w-[85%] max-w-[340px] overflow-y-auto bg-white p-5 shadow-2xl dark:bg-[#151516] lg:hidden flex flex-col justify-between"
            >
              <div>
                <div className="mb-5 flex items-center justify-between border-b border-gray-100 dark:border-border pb-4">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} aria-label="DK Power home">
                    <Image
                      src="/logo/dk-power.png"
                      alt="DK Power"
                      width={150}
                      height={38}
                      className="h-8 w-auto object-contain"
                      priority
                    />
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 text-gray-500 hover:text-black dark:hover:text-white"
                    aria-label="Close menu"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-1">
                  {[
                    ["Wholesale Categories", "/categories"],
                    ["Wholesale Catalog", "/shop"],
                    ["Bulk Deals", "/shop?sort=best-selling"],
                    ["New Arrivals", "/shop?sort=newest"],
                    ["Track Your Order", "/track-order"],
                    ["About DK Power", "/about"],
                    ["Bulk Inquiry", "/contact"],
                    ["Trade Login / Register", "/login"],
                  ].map(([label, href]) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block rounded-lg px-3.5 py-2.5 text-xs font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1C2028] transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
