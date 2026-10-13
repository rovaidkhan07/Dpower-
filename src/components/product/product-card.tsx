"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProductWithDetails } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { Spinner } from "@/components/ui/spinner";
import { DepthCard } from "@/components/storefront/depth-card";
import { ShoppingCart, Check, Package } from "lucide-react";

interface ProductCardProps {
  product: ProductWithDetails;
  onQuickView?: (product: ProductWithDetails) => void;
  variant?: "standard" | "compact";
}

export function ProductCard({ product, variant = "standard" }: ProductCardProps) {
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

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock || isAdding) return;

    // Variant products must be configured by the customer instead of silently
    // adding whichever variant happens to be first in the API response.
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

  if (variant === "compact") {
    return (
      <div className="w-full h-full min-w-0 bg-white dark:bg-[#15181E] border border-gray-100 dark:border-[#262C37] rounded-2xl p-2.5 sm:p-3.5 flex flex-col justify-between group shadow-xs hover:shadow-md transition-all font-sans relative">
        {/* Sale Tag */}
        {product.salePrice != null && product.salePrice < product.price && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-[#EF4444] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wide">
            Sale
          </div>
        )}

        {/* Product Image */}
        <Link
          href={`/products/${product.slug}`}
          className="relative w-full aspect-square bg-[#F8F9FA] dark:bg-[#1C2028] rounded-xl flex items-center justify-center p-2 mb-2 overflow-hidden block"
        >
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={product.name}
              fill
              sizes="(max-width: 639px) 150px, (max-width: 1023px) 190px, 240px"
              onError={() => {
                if (sourceImage) setFailedImage(sourceImage);
              }}
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-300 mix-blend-multiply dark:mix-blend-normal"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Package className="w-6 h-6 text-accent" />
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/70 dark:bg-black/60 backdrop-blur-xs flex items-center justify-center">
              <span className="bg-gray-900 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                Out of Stock
              </span>
            </div>
          )}
        </Link>

        {/* Product Title */}
        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] mb-1" title={product.name}>
          <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </h3>

        {/* Bottom Row: Price + Orange Cart Button */}
        <div className="flex items-end justify-between mt-auto pt-1">
          <div className="min-w-0 pr-1">
            <div className="flex items-baseline gap-1">
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                {formatPrice(product.salePrice ?? product.price)}
              </span>
              {product.salePrice != null && product.salePrice < product.price && (
                <span className="text-[10px] text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock || isAdding}
            aria-label={
              isOutOfStock
                ? "Out of stock"
                : hasVariants
                ? `Choose options for ${product.name}`
                : `Add ${product.name} to cart`
            }
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-all active:scale-95 shadow-xs ${
              isOutOfStock
                ? "bg-gray-100 dark:bg-[#1C2028] text-gray-400 cursor-not-allowed"
                : isAdded
                ? "bg-emerald-600 text-white"
                : "bg-[#FF6B00] hover:bg-[#E05E00] text-white"
            }`}
          >
            {isAdding ? (
              <Spinner className="w-3.5 h-3.5 text-white" />
            ) : isAdded ? (
              <Check className="w-3.5 h-3.5 text-white" />
            ) : (
              <ShoppingCart className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <DepthCard className="min-w-0 rounded-xl bg-white dark:bg-[#15181E] border border-gray-100 dark:border-[#262C37] overflow-hidden flex flex-col group h-full transition-shadow hover:shadow-lg font-sans relative">

      {/* Image Container (Light Grey) */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[4/3] w-full overflow-hidden bg-secondary dark:bg-[#1C2028] block group-hover:opacity-90 transition-opacity"
      >
        {/* Red Sale Tag */}
        {product.salePrice != null && product.salePrice < product.price && (
          <div className="absolute top-0 left-0 z-10 bg-[#FF4747] text-white text-xs font-bold px-3 py-1 rounded-br-md shadow-sm uppercase tracking-wide">
            Sale
          </div>
        )}
        
        {imgSrc ? <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="(max-width: 1023px) 50vw, 25vw"
          onError={() => {
            if (sourceImage) setFailedImage(sourceImage);
          }}
          className="object-contain p-3 sm:p-4 motion-safe:group-hover:scale-105 transition-transform motion-reduce:transition-none duration-500 mix-blend-multiply dark:mix-blend-normal"
        /> : <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground p-3"><Package className="w-8 h-8 text-accent" aria-hidden="true" /><span className="text-xs font-semibold">Kharidly</span><span className="text-[10px]">Image coming soon</span></div>}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-sm shadow-md">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Content Area (White) */}
      <div className="p-3 sm:p-4 min-w-0 flex flex-col flex-1 bg-white dark:bg-[#15181E]">
        {/* Product Title */}
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-3 min-h-[60px] break-words mb-2 group-hover:text-black dark:group-hover:text-primary transition-colors" title={product.name}>
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Pricing */}
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-3">
          <span className="text-sm sm:text-[16px] font-bold text-gray-900 dark:text-[#E9EBEF]">
            {formatPrice(product.salePrice ?? product.price)}
          </span>
          {product.salePrice != null && product.salePrice < product.price && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Premium Add To Cart Button */}
        <button
          onClick={handleQuickAdd}
          disabled={isOutOfStock || isAdding}
          aria-label={
            isOutOfStock
              ? `${product.name} is unavailable`
              : hasVariants
              ? `Choose options for ${product.name}`
              : `Add ${product.name} to cart`
          }
          className={`w-full min-h-11 px-2 py-2.5 text-[11px] sm:text-sm font-bold transition-all duration-300 mt-auto flex items-center justify-center gap-1.5 rounded-lg
            ${isOutOfStock
              ? "bg-gray-100 dark:bg-[#1C2028] text-gray-400 cursor-not-allowed"
              : isAdded
              ? "bg-green-600 text-white shadow-lg shadow-green-600/25"
              : "bg-gradient-to-r from-brand to-accent text-white hover:from-accent hover:to-[#c2410c] hover:shadow-lg hover:shadow-orange-500/25 motion-safe:active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            }`}
        >
          {isAdding ? (
            <><Spinner /> Adding...</>
          ) : isAdded ? (
            <><Check className="w-4 h-4" /> Added</>
          ) : isOutOfStock ? (
            "Unavailable"
          ) : hasVariants ? (
            "Choose Options"
          ) : (
            <><ShoppingCart className="w-4 h-4" /> Add To Cart</>
          )}
        </button>
      </div>

    </DepthCard>
  );
}
