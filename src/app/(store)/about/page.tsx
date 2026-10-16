import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "About Us | DK Power",
  description:
    "Learn about DK Power — Pakistan's premium store for genuine chargers, power banks, cables, and mobile accessories with nationwide delivery.",
};

const badges = [
  {
    icon: ShieldCheck,
    title: "100% Genuine Products",
    text: "Every item is original, lab-tested and quality-checked before dispatch.",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    text: "Fast, tracked delivery across Pakistan with Cash on Delivery support.",
  },
  {
    icon: RotateCcw,
    title: "Official Warranty",
    text: "Hassle-free warranty coverage and direct replacement on eligible items.",
  },
  {
    icon: MessageCircle,
    title: "Trade & Retail Support",
    text: "Direct WhatsApp hotline for retail shoppers and commercial bulk buyers.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-slate-50 dark:bg-[#0F1217] min-h-screen">
      {/* Hero */}
      <div className="bg-[#111111] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4">
            About DK Power
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Pakistan&apos;s High-Performance <span className="text-primary">Power Brand</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Heavy-duty fast chargers, high-capacity power banks, ultra-durable cables, and next-gen audio — built for peak reliability.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-white dark:bg-[#15181E] rounded-3xl border border-slate-200 dark:border-[#262C37] p-6 sm:p-10 shadow-xs space-y-5">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Our Story
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            DK Power was founded to solve a major problem in Pakistan&apos;s tech accessories market: finding{" "}
            <strong className="text-slate-900 dark:text-white">genuine, durable, high-wattage charging gear</strong> that won&apos;t fail after a few weeks.
          </p>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Every DK Power product is engineered to international safety standards, featuring GaN semiconductor tech, multi-stage over-current protection, and rugged braided construction. Whether you are an individual power user or a reseller purchasing bulk stock, DK Power delivers uncompromised performance.
          </p>
        </div>
      </div>

      {/* Why Shop With Us */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white text-center mb-8">
          Why Choose DK Power?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="bg-white dark:bg-[#15181E] rounded-2xl border border-slate-200 dark:border-[#262C37] p-6 text-center shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/20 text-primary flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1.5">
                  {b.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{b.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-14 sm:pb-20">
        <div className="bg-primary rounded-3xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Ready to upgrade your charging setup?
          </h2>
          <p className="mt-2 text-white/90 text-sm sm:text-base">
            Explore our complete lineup of fast chargers, power banks, and cables.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 mt-6 bg-white text-primary font-bold text-sm px-8 py-3.5 rounded-full hover:bg-slate-100 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Browse Catalog
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
