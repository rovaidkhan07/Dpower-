"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Grid3X3,
  Package,
  ShoppingCart,
  Smartphone,
} from "lucide-react";
import { ProductWithDetails } from "@/types";
import { useCart } from "@/hooks/use-cart";
import { Spinner } from "@/components/ui/spinner";

interface KharidlyDesktopHomeProps {
  products: ProductWithDetails[];
}

const categoryTiles = [
  { label: "Earbuds", href: "/shop?category=earbuds", image: "/icons/categories/earbuds.png" },
  { label: "Chargers", href: "/shop?category=chargers", image: "/icons/categories/chargers.png" },
  { label: "Cables", href: "/shop?category=cables", image: "/icons/categories/cables.png" },
  { label: "Power Banks", href: "/shop?category=power-banks", image: "/icons/categories/power-banks.png" },
  { label: "Cases", href: "/shop?category=phone-covers", icon: Smartphone },
  { label: "Shop All", href: "/shop", icon: Grid3X3 },
];

function DesktopProductCard({ product }: { product: ProductWithDetails }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const imageUrl = product.images?.[0]?.imageUrl?.trim() || null;
  const hasVariants = (product.variants?.length ?? 0) > 0;
  const isOutOfStock = product.stockQuantity <= 0;
  const currentPrice = product.salePrice ?? product.price;
  const discountPercent =
    product.salePrice != null && product.salePrice < product.price
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  const handleAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (isOutOfStock || isAdding) return;
    if (hasVariants) {
      router.push(`/products/${product.slug}`);
      return;
    }

    setIsAdding(true);
    addItem(product, null, 1);
    window.setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      window.setTimeout(() => setIsAdded(false), 1300);
    }, 350);
  };

  return (
    <article className="group relative overflow-hidden rounded-[22px] border border-black/[0.06] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.09)]">
      <div className="absolute left-0 top-0 z-10 bg-[#ff6b00] px-2 py-3 text-[9px] font-extrabold uppercase tracking-[0.12em] text-white [writing-mode:vertical-rl] rotate-180">
        Kharidly Pick
      </div>

      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative mx-4 mt-4 aspect-[1.18/1] overflow-hidden rounded-[18px] bg-[#fbfbfb]">
          {imageUrl && !imageFailed ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="320px"
              onError={() => setImageFailed(true)}
              className="object-contain p-5 transition duration-300 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-[#8b9098]">
              <Package className="h-9 w-9 text-[#ff6b00]" aria-hidden="true" />
              <span className="text-xs font-semibold">Kharidly</span>
            </div>
          )}
        </div>
      </Link>

      <div className="px-4 pb-4 pt-3">
        {product.brand && (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a8f98]">
            {product.brand}
          </p>
        )}
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-[44px] text-[15px] font-semibold leading-[1.45] text-[#181a1f] transition group-hover:text-[#ff6b00]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-[18px] font-extrabold tracking-[-0.02em] text-[#111318]">
                Rs. {currentPrice.toLocaleString()}
              </span>
              {product.salePrice != null && product.salePrice < product.price && (
                <span className="text-xs text-[#9aa0a9] line-through">
                  Rs. {product.price.toLocaleString()}
                </span>
              )}
            </div>
            <div className="mt-1 flex min-h-5 items-center gap-2">
              {discountPercent > 0 && (
                <span className="rounded-full bg-[#fff0e6] px-2 py-0.5 text-[10px] font-bold text-[#ff6b00]">
                  {discountPercent}% OFF
                </span>
              )}
              {isOutOfStock && (
                <span className="text-[10px] font-bold uppercase tracking-wide text-[#9aa0a9]">Out of stock</span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={isOutOfStock || isAdding}
            aria-label={hasVariants ? `Select options for ${product.name}` : `Add ${product.name} to cart`}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] text-white shadow-[0_8px_20px_rgba(255,107,0,0.28)] transition active:scale-95 ${
              isOutOfStock
                ? "cursor-not-allowed bg-[#c9ccd1] shadow-none"
                : isAdded
                  ? "bg-emerald-600"
                  : "bg-[#ff6b00] hover:bg-[#ed6200]"
            }`}
          >
            {isAdding ? (
              <Spinner className="h-4 w-4 text-white" />
            ) : isAdded ? (
              <Check className="h-5 w-5" />
            ) : (
              <ShoppingCart className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export function KharidlyDesktopHome({ products }: KharidlyDesktopHomeProps) {
  const displayedProducts = products.slice(0, 4);

  return (
    <div className="bg-[#f5f6f8] pb-14 pt-4 text-[#111318]">
      <div className="mx-auto max-w-[1440px] px-4">
        <section className="relative min-h-[390px] overflow-hidden rounded-[30px] border border-black/[0.03] bg-gradient-to-r from-[#fffaf6] via-[#fff5ec] to-[#ff7600] shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
          <div className="absolute -right-12 -top-28 h-[520px] w-[760px] rotate-[-8deg] rounded-[90px] bg-gradient-to-br from-white/10 via-[#ff9b45]/50 to-[#ff6500]/80" />
          <div className="absolute bottom-[-145px] right-[40px] h-[280px] w-[650px] rounded-[50%] border-[32px] border-white/45 bg-[#ff7a16]/50" />

          <div className="relative z-10 grid min-h-[390px] grid-cols-[0.95fr_1.05fr] items-center gap-5 px-16 py-10">
            <div className="max-w-[620px]">
              <div className="mb-5 inline-flex items-center rounded-full bg-white/80 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#ff6b00] shadow-sm">
                Tech you need. Made easy.
              </div>
              <h1 className="text-[47px] font-black uppercase leading-[0.98] tracking-[-0.045em] text-[#111318]">
                Kharidly — Pakistan&apos;s
                <span className="mt-2 block text-[#ff6b00]">Tech Store</span>
              </h1>
              <p className="mt-5 max-w-[520px] text-[18px] leading-7 text-[#4e545d]">
                Chargers, cables, audio and power accessories with simple online ordering and Cash on Delivery.
              </p>
              <Link
                href="/shop"
                className="mt-7 inline-flex h-14 items-center gap-3 rounded-full bg-[#ff6b00] px-8 text-sm font-extrabold uppercase tracking-[0.04em] text-white shadow-[0_12px_25px_rgba(255,107,0,0.28)] transition hover:-translate-y-0.5 hover:bg-[#ed6200]"
              >
                Shop now
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <div className="mt-6 flex items-center gap-2" aria-hidden="true">
                <span className="h-2 w-5 rounded-full bg-[#ff6b00]" />
                <span className="h-2 w-2 rounded-full bg-[#d8dadd]" />
                <span className="h-2 w-2 rounded-full bg-[#d8dadd]" />
                <span className="h-2 w-2 rounded-full bg-[#d8dadd]" />
              </div>
            </div>

            <div className="relative h-[330px] w-full self-end">
              <Image
                src="/images/Hero-Image_bg_removed.png.png"
                alt="Kharidly mobile accessories"
                fill
                priority
                sizes="760px"
                className="object-contain object-bottom drop-shadow-[0_24px_34px_rgba(56,29,6,0.24)]"
              />
            </div>
          </div>
        </section>

        <section aria-label="Shop by category" className="mt-4 grid grid-cols-6 gap-3">
          {categoryTiles.map(({ label, href, image, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="group flex h-[92px] items-center justify-center gap-4 rounded-[20px] border border-black/[0.04] bg-white px-4 shadow-[0_7px_22px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
            >
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f6f6f6]">
                {image ? (
                  <Image src={image} alt="" width={48} height={48} className="h-11 w-11 object-contain" />
                ) : Icon ? (
                  <Icon className="h-7 w-7 stroke-[1.7] text-[#1c1f24]" aria-hidden="true" />
                ) : null}
              </div>
              <span className="text-[15px] font-semibold text-[#17191d] transition group-hover:text-[#ff6b00]">{label}</span>
            </Link>
          ))}
        </section>

        <section className="relative mt-4 flex h-[68px] items-center overflow-hidden rounded-[22px] bg-[#0d0f12] px-8 text-white shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
          <div className="absolute inset-y-0 left-[38%] w-[34%] skew-x-[-26deg] bg-gradient-to-r from-transparent via-[#ff6b00]/70 to-transparent blur-xl" />
          <div className="relative z-10 flex w-full items-center justify-between">
            <p className="text-[21px] font-extrabold uppercase tracking-[-0.02em]">
              Tech you need — <span className="text-[#ff6b00]">made easy</span>
            </p>
            <Link
              href="/shop"
              className="inline-flex h-11 items-center gap-3 rounded-full bg-white px-6 text-xs font-extrabold uppercase tracking-[0.06em] text-[#111318] transition hover:bg-[#fff4eb]"
            >
              Explore now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {displayedProducts.length > 0 && (
          <section className="pt-7">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[29px] font-black uppercase tracking-[-0.035em] text-[#121419]">New Arrivals</h2>
              <Link href="/shop?sort=newest" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#ff6b00] hover:underline">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-5">
              {displayedProducts.map((product) => (
                <DesktopProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
