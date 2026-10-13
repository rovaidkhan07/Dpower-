import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Boxes, ShieldCheck, Truck, Warehouse } from "lucide-react";

export function Footer() {
  const features = [
    { icon: Warehouse, title: "Wholesale Focus", text: "Built for retailers and resellers" },
    { icon: Boxes, title: "Bulk Ordering", text: "Order multiple products in one flow" },
    { icon: ShieldCheck, title: "Secure Checkout", text: "Protected account and order flows" },
    { icon: Truck, title: "Order Tracking", text: "Track confirmed orders online" },
  ];

  return (
    <footer className="w-full font-sans">
      <div className="border-b border-white/10 bg-[#1a1a1c] py-8 text-white">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 px-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary"><Icon className="h-6 w-6" /></div>
              <div><div className="font-extrabold">{title}</div><div className="mt-1 text-xs text-zinc-400">{text}</div></div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#0d0d0e] pb-8 pt-14 text-white">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link href="/" className="inline-flex rounded-xl bg-white p-2"><Image src="/logo/dk-power.svg" alt="DK Power" width={180} height={48} className="h-11 w-auto" /></Link>
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-zinc-400">Wholesale mobile accessories and power products for retailers, resellers and trade buyers in Pakistan.</p>
            </div>

            <div>
              <h4 className="mb-5 font-extrabold">Wholesale</h4>
              <nav className="flex flex-col gap-3 text-sm text-zinc-400">
                <Link href="/shop" className="hover:text-white">Wholesale Catalog</Link>
                <Link href="/categories" className="hover:text-white">Categories</Link>
                <Link href="/contact" className="hover:text-white">Bulk Inquiry</Link>
                <Link href="/track-order" className="hover:text-white">Track Order</Link>
              </nav>
            </div>

            <div>
              <h4 className="mb-5 font-extrabold">Customer Support</h4>
              <nav className="flex flex-col gap-3 text-sm text-zinc-400">
                <Link href="/about" className="hover:text-white">About DK Power</Link>
                <Link href="/delivery-information" className="hover:text-white">Dispatch Information</Link>
                <Link href="/refund-policy" className="hover:text-white">Refund & Return Policy</Link>
                <Link href="/faq" className="hover:text-white">FAQs</Link>
              </nav>
            </div>

            <div>
              <h4 className="mb-5 font-extrabold">Trade Account</h4>
              <p className="mb-4 text-sm leading-relaxed text-zinc-400">Use the account area to manage orders, or contact DK Power for larger quantity requirements.</p>
              <div className="flex flex-wrap gap-2">
                <Link href="/login" className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-accent">Trade Login</Link>
                <Link href="/contact" className="rounded-full border border-white/25 px-4 py-2 text-sm font-bold text-white hover:bg-white/10">Contact</Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-zinc-500 md:flex-row">
            <p>© {new Date().getFullYear()} DK Power. All rights reserved.</p>
            <div className="flex gap-2"><span className="rounded bg-white px-2 py-1 text-[10px] font-black text-black">CASH ON DELIVERY</span><span className="rounded bg-white px-2 py-1 text-[10px] font-black text-black">BANK TRANSFER</span></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
