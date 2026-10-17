"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProductWithDetails } from "@/types";
import { useCart } from "@/hooks/use-cart";
import { Spinner } from "@/components/ui/spinner";
import { Check, Package, Star } from "lucide-react";

interface ProductCardProps {
  product: ProductWithDetails;
  onQuickView?: (product: ProductWithDetails) => void;
  variant?: "standard" | "compact";
  showTimer?: boolean;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const rawImage = product.images?.[0]?.imageUrl?.trim();
  const sourceImage = rawImage && rawImage.length > 0 ? rawImage : null;
  const imgSrc = sourceImage && sourceImage !== failedImage ? sourceImage : null;
  const feedbackTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => {
    feedbackTimers.current.forEach(clearTimeout);
  }, []);

  const isOutOfStock = product.stockQuantity <= 0;
  const hasVariants = (product.variants?.length ?? 0) > 0;

  // Calculate discount percentage
  const discountPercent =
    product.salePrice != null && product.price > product.salePrice
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  const currentPrice = product.salePrice ?? product.price;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock || isAdding) return;

    if (hasVariants) {
      router.push(`/products/${product.slug}`);
      return;
    }

    setIsAdding(true);
    addItem(product, null, 1);
    feedbackTimers.current.forEach(clearTimeout);
    feedbackTimers.current = [setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      feedbackTimers.current = [setTimeout(() => setIsAdded(false), 1500)];
    }, 450)];
  };

  return (
    <div className="group relative bg-white dark:bg-[#16181f] rounded-2xl border border-gray-200/90 dark:border-gray-800 p-3.5 sm:p-5 flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-200 h-full w-full">
      {/* Angled Corner Ribbon: SALE UP TO {X}% OFF */}
      <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden pointer-events-none z-10">
        {discountPercent > 0 ? (
          <div className="absolute top-3.5 -left-8 w-28 sm:w-30 bg-[#b51218] text-white text-[8px] sm:text-[9px] font-black tracking-tight text-center py-1 -rotate-45 shadow-xs uppercase leading-tight">
            SALE<br />
            <span className="text-[6.5px] sm:text-[7.5px] font-semibold opacity-95">UP TO {discountPercent}% OFF</span>
          </div>
        ) : (
          <div className="absolute top-3.5 -left-8 w-28 sm:w-30 bg-[#111111] text-white text-[8px] sm:text-[9px] font-black tracking-tight text-center py-1 -rotate-45 shadow-xs uppercase leading-tight">
            TRADE<br />
            <span className="text-[6.5px] sm:text-[7.5px] font-semibold opacity-95">GENUINE</span>
          </div>
        )}
      </div>

      {/* Product Photo on White Background */}
      <Link
        href={`/products/${product.slug}`}
        className="relative w-full aspect-square mb-2.5 sm:mb-3.5 flex items-center justify-center bg-white dark:bg-transparent rounded-xl overflow-hidden cursor-pointer"
      >
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 280px"
            onError={() => {
              if (sourceImage) setFailedImage(sourceImage);
            }}
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground p-3">
            <Package className="w-8 h-8 text-[#b51218]" aria-hidden="true" />
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-1">DK Power</span>
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 dark:bg-black/60 backdrop-blur-xs flex items-center justify-center z-10">
            <span className="bg-gray-900 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-xs">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product Details & Actions */}
      <div className="flex flex-col flex-1 justify-between pt-1">
        {/* Product Title */}
        <h3
          className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 min-h-[2.5rem] mb-2 hover:text-[#b51218] transition-colors"
          title={product.name}
        >
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>

        <div>
          {/* Price Row: Red PKR + Strikethrough Rs. */}
          <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2">
            <span className="text-[#b51218] font-extrabold text-sm sm:text-base lg:text-lg">
              PKR. {currentPrice.toLocaleString()}
            </span>
            {product.salePrice != null && product.salePrice < product.price && (
              <span className="text-gray-400 line-through text-xs font-medium">
                Rs. {product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Black Urgency / Wholesale Pill */}
          <div className="w-full bg-black text-white text-[10px] sm:text-[11.5px] font-bold py-1.5 px-2 rounded-full flex items-center justify-center gap-1 sm:gap-1.5 mb-2 shadow-2xs">
            <span className="text-amber-400">⚡</span>
            <span className="truncate">Wholesale Stock · Genuine</span>
            <span className="text-amber-400">⚡</span>
          </div>

          {/* Rating ★ 5.0 */}
          <div className="flex items-center gap-1 text-xs font-bold text-gray-800 dark:text-gray-200 mb-3">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>5.0</span>
          </div>

          {/* Full-Width Red Button: Add To Cart */}
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isOutOfStock || isAdding}
            className={`w-full py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 ${
              isOutOfStock
                ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                : isAdded
                ? "bg-emerald-600 text-white"
                : "bg-[#b51218] hover:bg-[#9b1117] active:scale-[0.98] text-white"
            }`}
          >
            {isAdding ? (
              <><Spinner className="w-3.5 h-3.5 text-white" /> Adding...</>
            ) : isAdded ? (
              <><Check className="w-3.5 h-3.5 text-white" /> Added To Cart</>
            ) : isOutOfStock ? (
              "Out of Stock"
            ) : hasVariants ? (
              "Select Options"
            ) : (
              "Add To Cart"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
