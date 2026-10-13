"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Search, ShoppingCart, Sun, User, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { ACTIVE_CATEGORIES } from "@/lib/config/categories";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { items } = useCart();
  const router = useRouter();
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dk-power-theme");
      const initial = saved === "dark" ? "dark" : "light";
      setTheme(initial);
      document.documentElement.classList.toggle("dark", initial === "dark");
    } catch {}
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try { localStorage.setItem("dk-power-theme", next); } catch {}
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) router.push(`/shop?search=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="hidden lg:block bg-primary text-white">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between px-8 py-2 text-xs font-semibold">
            <span>Wholesale supply for retailers & resellers</span>
            <div className="flex items-center gap-5">
              <Link href="/delivery-information" className="hover:underline">Dispatch Information</Link>
              <Link href="/contact" className="hover:underline">Trade Support</Link>
              <Link href="/faq" className="hover:underline">FAQs</Link>
            </div>
          </div>
        </div>

        <div className={`bg-white dark:bg-[#151516] ${isScrolled ? "shadow-md" : "border-b border-border"}`}>
          <div className="mx-auto grid h-16 max-w-[1280px] grid-cols-3 items-center gap-3 px-4 lg:flex lg:h-[84px] lg:gap-8 lg:px-8">
            <button onClick={() => setIsMobileMenuOpen(true)} className="justify-self-start p-2 lg:hidden" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </button>

            <Link href="/" className="flex justify-center lg:justify-start lg:shrink-0" aria-label="DK Power home">
              <Image src="/logo/dk-power.svg" alt="DK Power" width={180} height={48} className="h-9 w-auto" priority />
            </Link>

            <form onSubmit={submitSearch} className="hidden h-12 flex-1 items-center rounded-full border border-border bg-secondary pl-5 lg:flex">
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search wholesale products, SKU or brand..." className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
              <button type="submit" className="mr-1 flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white hover:bg-accent"><Search className="h-4 w-4" /> Search</button>
            </form>

            <div className="flex items-center justify-end gap-2 lg:gap-4">
              <button onClick={toggleTheme} className="hidden h-10 w-10 items-center justify-center rounded-full border border-border lg:flex" aria-label="Toggle theme">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <Link href="/login" className="hidden items-center gap-2 text-sm font-bold lg:flex"><span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary text-primary"><User className="h-4 w-4" /></span>Trade Login</Link>
              <Link href="/cart" className="relative flex h-10 items-center gap-2 rounded-full text-foreground sm:bg-primary sm:px-4 sm:text-white">
                <ShoppingCart className="h-6 w-6 sm:h-5 sm:w-5" />
                <span className="hidden text-sm font-bold sm:block">Order List</span>
                {cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-bold text-white">{cartCount}</span>}
              </Link>
            </div>
          </div>

          <div className="px-4 pb-3 lg:hidden">
            <form onSubmit={submitSearch} className="flex h-11 items-center rounded-xl border border-border bg-secondary px-4">
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search wholesale catalog..." className="h-full flex-1 bg-transparent text-sm outline-none" />
              <button type="submit" aria-label="Search"><Search className="h-4 w-4 text-muted-foreground" /></button>
            </form>
          </div>
        </div>

        <nav className="hidden h-[54px] bg-[#151515] text-white lg:block">
          <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-8">
            <div className="flex h-full items-center">
              <div className="relative h-full" onMouseEnter={() => setIsCategoryMenuOpen(true)} onMouseLeave={() => setIsCategoryMenuOpen(false)}>
                <button className="flex h-full items-center gap-2 bg-primary px-6 text-sm font-bold"><Menu className="h-5 w-5" /> Wholesale Categories</button>
                {isCategoryMenuOpen && <div className="absolute left-0 top-full z-50 w-64 border border-border bg-white py-2 text-foreground shadow-xl dark:bg-[#151516]">{ACTIVE_CATEGORIES.map((category) => <Link key={category.slug} href={`/shop?category=${category.slug}`} className="block px-5 py-3 text-sm font-medium hover:bg-secondary">{category.name}</Link>)}</div>}
              </div>
              <div className="ml-8 flex items-center gap-8 text-sm font-semibold">
                <Link href="/shop" className="hover:text-red-300">Wholesale Catalog</Link>
                <Link href="/categories" className="hover:text-red-300">Categories</Link>
                <Link href="/about" className="hover:text-red-300">About DK Power</Link>
                <Link href="/contact" className="hover:text-red-300">Bulk Inquiry</Link>
              </div>
            </div>
            <Link href="/track-order" className="text-sm font-semibold hover:text-red-300">Track Order</Link>
          </div>
        </nav>
      </header>

      <div className="h-[135px] shrink-0 lg:h-[168px]" aria-hidden="true" />

      <AnimatePresence>
        {isMobileMenuOpen && <>
          <motion.button aria-label="Close menu overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 z-[100] bg-black/60 lg:hidden" />
          <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 26, stiffness: 220 }} className="fixed left-0 top-0 z-[101] h-full w-[86%] max-w-[340px] overflow-y-auto bg-white p-5 shadow-2xl dark:bg-[#151516] lg:hidden">
            <div className="mb-6 flex items-center justify-between"><Image src="/logo/dk-power.svg" alt="DK Power" width={160} height={43} className="h-10 w-auto" /><button onClick={() => setIsMobileMenuOpen(false)} className="p-2" aria-label="Close menu"><X className="h-6 w-6" /></button></div>
            <p className="mb-5 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-800 dark:bg-red-950/30 dark:text-red-200">Wholesale ordering for retailers, resellers and trade buyers.</p>
            <div className="space-y-1">{[["Wholesale Catalog", "/shop"],["Categories", "/categories"],["Bulk Inquiry", "/contact"],["Track Order", "/track-order"],["About DK Power", "/about"],["Trade Login", "/login"]].map(([label, href]) => <Link key={href} href={href} onClick={() => setIsMobileMenuOpen(false)} className="block rounded-lg px-3 py-3 text-sm font-bold hover:bg-secondary">{label}</Link>)}</div>
            <div className="mt-6 border-t border-border pt-5"><p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Browse categories</p>{ACTIVE_CATEGORIES.map((category) => <Link key={category.slug} href={`/shop?category=${category.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm">{category.name}</Link>)}</div>
          </motion.aside>
        </>}
      </AnimatePresence>
    </>
  );
}
