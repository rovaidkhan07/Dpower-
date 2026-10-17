"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface Slide {
  id: string;
  image: string;
  alt: string;
  href: string;
  ariaLabel: string;
}

const SLIDES: Slide[] = [
  {
    id: "fast-chargers",
    image: "/banners/dk-power-fast-chargers-banner.jpg",
    alt: "DK Power Fast Chargers – Wholesale Prices, Genuine Stock. 65W GaN Technology, Multi-Port, Bulk Available.",
    href: "/shop?category=chargers",
    ariaLabel: "Shop wholesale fast chargers at DK Power",
  },
  {
    id: "cables",
    image: "/banners/dk-power-cables-banner.jpg",
    alt: "DK Power Charging Cables – Fast Data & Charging, Bulk Stock Ready. USB-C & Lightning, 120W Fast Charge.",
    href: "/shop?category=cables",
    ariaLabel: "Shop wholesale charging cables at DK Power",
  },
  {
    id: "earbuds",
    image: "/banners/dk-power-earbuds-banner.jpg",
    alt: "DK Power Wireless Earbuds – True Wireless Sound, Wholesale Ready. Active Noise Cancelling, 40H Battery Life.",
    href: "/shop?category=earbuds-audio",
    ariaLabel: "Shop wholesale wireless earbuds at DK Power",
  },
  {
    id: "power-banks",
    image: "/banners/dk-power-power-banks-banner.jpg",
    alt: "DK Power Power Banks – Never Run Out, Wholesale Stock. 20,000mAh Capacity, 65W Output, Reseller Deals.",
    href: "/shop?category=power-banks",
    ariaLabel: "Shop wholesale power banks at DK Power",
  },
];

const AUTO_PLAY_INTERVAL = 5500;

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const goNext = useCallback(() => {
    goTo((current + 1) % SLIDES.length);
  }, [current, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + SLIDES.length) % SLIDES.length);
  }, [current, goTo]);

  // Auto-play
  useEffect(() => {
    if (prefersReducedMotion || isHovered || isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(goNext, AUTO_PLAY_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [goNext, isHovered, isPaused, prefersReducedMotion]);

  // Keyboard support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  // Swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const delta = touchStart - touchEnd;
    if (Math.abs(delta) > 50) {
      if (delta > 0) {
        goNext();
      } else {
        goPrev();
      }
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const slide = SLIDES[current];

  return (
    <section
      className="relative w-full bg-black font-sans"
      aria-label="Promotional hero carousel"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Main Slide — Exact 1376x768 aspect ratio matching the DK Power branded banners */}
      <div className="relative w-full overflow-hidden mx-auto max-w-[1280px] px-0 sm:px-4 lg:px-8 py-0 sm:py-3">
        <div className="overflow-hidden bg-[#111111] sm:rounded-2xl shadow-xl">
          <Link
            href={slide.href}
            aria-label={slide.ariaLabel}
            tabIndex={0}
            className="block w-full cursor-pointer focus:outline-none"
          >
            <div className="relative w-full aspect-[1376/768] overflow-hidden">
              {SLIDES.map((s, idx) => (
                <div
                  key={s.id}
                  className="absolute inset-0 transition-opacity duration-500 ease-in-out"
                  style={{ opacity: idx === current ? 1 : 0, pointerEvents: idx === current ? "auto" : "none" }}
                >
                  <img
                    src={s.image}
                    alt={s.alt}
                    className="w-full h-full object-cover object-center"
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>
          </Link>
        </div>
      </div>

      {/* Desktop Nav Arrows */}
      <div className="hidden sm:block">
        <button
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          aria-label="Previous slide"
          className="absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-black/60 hover:bg-[#b51218] text-white border border-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer shadow-lg"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          aria-label="Next slide"
          className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-black/60 hover:bg-[#b51218] text-white border border-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer shadow-lg"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Slide Indicators */}
      <div
        role="tablist"
        aria-label="Slide indicators"
        className="flex items-center justify-center gap-1.5 pt-1 pb-3"
      >
        {SLIDES.map((s, idx) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={idx === current}
            aria-label={`Go to slide ${idx + 1}: ${s.id}`}
            onClick={() => goTo(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer ${
              idx === current
                ? "w-6 bg-[#b51218]"
                : "w-1.5 bg-gray-600 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
