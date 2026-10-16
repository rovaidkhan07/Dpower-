"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  Moon,
  Search,
  ShoppingCart,
  Sun,
  User,
  X,
  Zap,
  MapPin,
  ChevronDown,
  PhoneCall,
  ShieldCheck,
  Flame,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { ACTIVE_CATEGORIES, STORE_CATEGORIES } from "@/lib/config/categories";
import { STORE_CONFIG } from "@/lib/config/store";

const TICKER_MESSAGES = [
  "⚡ FLASH DEALS: UP TO 40% OFF FAST CHARGERS & POWER BANKS ⚡",
  "🚚 NATIONWIDE CASH ON DELIVERY ACROSS ALL CITIES IN PAKISTAN 🚚",
  "🛡️ 100% ORIGINAL PRODUCTS WITH OFFICIAL REPLACEMENT WARRANTY 🛡️",
  "📦 SAME-DAY DISPATCH ON ALL ORDERS CONFIRMED BEFORE 3 PM 📦",
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [tickerIndex, setTickerIndex] = useState(0);
  const { items, openCart } = useCart();
  const router = useRouter();
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  // Ticker rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % TICKER_MESSAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dk-power-theme");
      const initial = saved === "dark" ? "dark" : "light";
      setTheme(initial);
      document.documentElement.classList.toggle("dark", initial === "dark");
    } catch {}
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("dk-power-theme", next);
    } catch {}
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) router.push(`/shop?search=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 shadow-md">
        {/* Top Announcement Bar — DabLew Red Ticker */}
        <div className="bg-[#b51218] text-white overflow-hidden py-1.5 px-4 text-[11px] sm:text-xs font-bold tracking-wide border-b border-white/10">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden flex-1 justify-center sm:justify-start">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={tickerIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="truncate text-center sm:text-left text-white/95"
                >
                  {TICKER_MESSAGES[tickerIndex]}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="hidden lg:flex items-center gap-5 text-white/90 shrink-0 font-medium">
              <Link href="/delivery-information" className="hover:text-white transition-colors">
                Delivery Info
              </Link>
              <Link href="/warranty-policy" className="hover:text-white transition-colors">
                Warranty Policy
              </Link>
              <Link href="/faq" className="hover:text-white transition-colors">
                Help &amp; FAQs
              </Link>
              <a
                href={`tel:${STORE_CONFIG.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-1 font-bold text-amber-300 hover:text-white transition-colors"
              >
                <PhoneCall className="w-3 h-3" />
                <span>{STORE_CONFIG.phone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Middle Row (Logo + Search + Icons) */}
        <div className={`bg-white dark:bg-[#151516] transition-colors ${isScrolled ? "py-2" : "py-3 sm:py-4"} border-b border-border`}>
          <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 lg:hidden text-gray-800 dark:text-gray-100 hover:text-primary focus:outline-none"
              aria-label="Open navigation menu"
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
                width={190}
                height={48}
                className="h-8 sm:h-10 w-auto object-contain drop-shadow-xs"
                priority
              />
            </Link>

            {/* Center High-Contrast Search Bar (Desktop) */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-6 flex-col">
              <form
                onSubmit={submitSearch}
                className="relative flex h-11 w-full items-center rounded-full border-2 border-primary bg-gray-50 dark:bg-[#1C2028] overflow-hidden shadow-xs focus-within:ring-2 focus-within:ring-primary/20 transition-all"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search fast chargers, power banks, cables, audio..."
                  className="h-full flex-1 bg-transparent px-5 text-xs sm:text-sm outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="flex h-full items-center gap-1.5 bg-primary hover:bg-accent px-6 text-xs sm:text-sm font-black text-white transition-colors cursor-pointer uppercase tracking-wider"
                >
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </button>
              </form>

              {/* Quick Suggestion Pills */}
              <div className="flex items-center gap-2 mt-1.5 px-3 text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                <span className="font-bold text-gray-700 dark:text-gray-300">Popular:</span>
                <Link href="/shop?search=65W" className="hover:text-primary transition-colors">65W GaN</Link>
                <span>•</span>
                <Link href="/shop?search=20000mAh" className="hover:text-primary transition-colors">20,000mAh</Link>
                <span>•</span>
                <Link href="/shop?category=cables" className="hover:text-primary transition-colors">Fast Cables</Link>
                <span>•</span>
                <Link href="/shop?category=earbuds" className="hover:text-primary transition-colors">Earbuds</Link>
              </div>
            </div>

            {/* Right Action Icons & Badges */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-border bg-gray-50 dark:bg-[#1C2028] text-gray-700 dark:text-gray-200 hover:text-primary transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4 text-gray-700" />}
              </button>

              {/* Track Order Direct Link (Desktop) */}
              <Link
                href="/track-order"
                className="hidden xl:flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-200 hover:text-primary transition-colors px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1C2028]"
              >
                <MapPin className="h-4 w-4 text-primary" />
                <span>Track Order</span>
              </Link>

              {/* Trade Login */}
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 text-xs font-bold text-gray-800 dark:text-gray-100 hover:text-primary transition-colors border border-border rounded-full px-3 py-1.5 hover:border-primary"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-3.5 w-3.5" />
                </span>
                <span>Trade Login</span>
              </Link>

              {/* Cart Button / Trigger Drawer */}
              <button
                onClick={openCart}
                className="relative flex h-10 items-center gap-2 rounded-full bg-primary hover:bg-accent px-3.5 sm:px-4 text-white text-xs sm:text-sm font-black shadow-md shadow-red-600/20 active:scale-95 transition-all cursor-pointer"
                aria-label="View Cart"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline uppercase tracking-wider">Cart</span>
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white text-primary text-[11px] font-black px-1 shadow-xs">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Search Input */}
          <div className="px-4 pt-2.5 lg:hidden">
            <form
              onSubmit={submitSearch}
              className="flex h-10 items-center rounded-full border-2 border-primary bg-gray-50 dark:bg-[#1C2028] px-3.5 overflow-hidden"
            >
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fast chargers, power banks, cables..."
                className="h-full flex-1 bg-transparent text-xs outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
              />
              <button type="submit" aria-label="Search" className="text-primary pr-1">
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* DabLew Style Black Mega-Menu Bar (`#111111`) */}
        <nav className="hidden h-12 bg-[#111111] text-white lg:block border-t border-white/5">
          <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-8">
            <div className="flex h-full items-center">
              {/* Category Dropdown Button */}
              <div
                className="relative h-full"
                onMouseEnter={() => setIsCategoryMenuOpen(true)}
                onMouseLeave={() => setIsCategoryMenuOpen(false)}
              >
                <button className="flex h-full items-center gap-2.5 bg-primary hover:bg-accent px-6 text-xs sm:text-sm font-black uppercase tracking-wider text-white transition-colors cursor-pointer">
                  <Menu className="h-4 w-4" />
                  <span>Wholesale Categories</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-80" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isCategoryMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full z-50 w-72 rounded-b-xl border border-border bg-white py-2 text-foreground shadow-2xl dark:bg-[#181a20]"
                    >
                      <div className="px-4 py-2 border-b border-border/80">
                        <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                          Primary Product Lines
                        </span>
                      </div>
                      {ACTIVE_CATEGORIES.map((category) => (
                        <Link
                          key={category.slug}
                          href={`/shop?category=${category.slug}`}
                          className="flex items-center justify-between px-5 py-2.5 text-xs font-bold hover:bg-red-50 hover:text-primary dark:hover:bg-red-950/20 transition-colors"
                        >
                          <span>{category.name}</span>
                          <span className="text-[10px] text-gray-400 font-normal">Explore &rarr;</span>
                        </Link>
                      ))}
                      <div className="mt-2 pt-2 border-t border-border px-4 py-1.5 bg-gray-50 dark:bg-[#15181E] rounded-b-xl">
                        <Link
                          href="/categories"
                          className="text-xs font-black text-primary hover:underline flex items-center justify-between"
                        >
                          <span>View All Categories</span>
                          <span>&rarr;</span>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation Menu Links */}
              <div className="ml-6 flex items-center gap-6 text-xs font-bold tracking-wide">
                <Link
                  href="/shop?sort=best-selling"
                  className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors uppercase font-black"
                >
                  <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-pulse" />
                  <span>Flash Deals</span>
                </Link>
                <Link href="/shop" className="hover:text-red-300 transition-colors uppercase">
                  Wholesale Catalog
                </Link>
                <Link href="/shop?sort=newest" className="hover:text-red-300 transition-colors uppercase">
                  New Arrivals
                </Link>
                <Link href="/categories" className="hover:text-red-300 transition-colors uppercase">
                  All Categories
                </Link>
                <Link href="/about" className="hover:text-red-300 transition-colors uppercase">
                  About DK Power
                </Link>
                <Link href="/contact" className="hover:text-red-300 transition-colors uppercase">
                  Bulk Inquiry
                </Link>
              </div>
            </div>

            {/* Right side helper link */}
            <div className="flex items-center gap-4 text-xs font-semibold text-gray-300">
              <Link href="/track-order" className="hover:text-white flex items-center gap-1.5 transition-colors">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Track Your Order</span>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Spacer to prevent layout shift below fixed header */}
      <div className="h-[130px] sm:h-[142px] lg:h-[150px] shrink-0" aria-hidden="true" />

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
                {/* Header */}
                <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} aria-label="DK Power home">
                    <Image
                      src="/logo/dk-power.png"
                      alt="DK Power"
                      width={160}
                      height={40}
                      className="h-8 w-auto object-contain drop-shadow-xs"
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

                {/* Wholesale badge */}
                <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-950/30 p-3 border border-red-200 dark:border-red-900/30 text-xs font-bold text-primary flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>100% Genuine Tech Gear &amp; Wholesale Supply</span>
                </div>

                {/* Primary Nav Links */}
                <div className="space-y-1">
                  <Link
                    href="/shop?sort=best-selling"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-black bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400"
                  >
                    <span className="flex items-center gap-2">
                      <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                      Flash Deals &amp; Hot Sales
                    </span>
                    <span className="text-[10px] bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 px-2 py-0.5 rounded-full font-black">HOT</span>
                  </Link>
                  {[
                    ["Wholesale Catalog", "/shop"],
                    ["All Categories", "/categories"],
                    ["Track Your Order", "/track-order"],
                    ["About DK Power", "/about"],
                    ["Bulk Inquiry / Trade Support", "/contact"],
                    ["Trade Login", "/login"],
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

                {/* Categories Breakdown */}
                <div className="mt-5 border-t border-border pt-4">
                  <p className="mb-2.5 text-[11px] font-black uppercase tracking-wider text-primary">
                    Shop By Category
                  </p>
                  <div className="space-y-1">
                    {ACTIVE_CATEGORIES.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/shop?category=${category.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between py-2 px-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                      >
                        <span>{category.name}</span>
                        <span className="text-[10px] text-gray-400">&rarr;</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Support Pill */}
              <div className="mt-6 pt-4 border-t border-border space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>Display Mode</span>
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-border text-xs font-bold"
                  >
                    {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                    <span>{theme === "dark" ? "Light" : "Dark"}</span>
                  </button>
                </div>
                <a
                  href={`tel:${STORE_CONFIG.phone.replace(/\s/g, "")}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-xs font-bold"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Trade Hotline: {STORE_CONFIG.phone}</span>
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
