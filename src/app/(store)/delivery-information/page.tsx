import Link from "next/link";
import {
  Truck,
  PackageCheck,
  Timer,
  MapPin,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import {
  buildWhatsAppSupportUrl,
  STORE_CONFIG,
} from "@/lib/config/store";

export const metadata = {
  title: "Delivery Information | DK Power",
  description:
    "DK Power delivery information — fast nationwide shipping, live tracking, and dispatch details across Pakistan.",
};

export default function DeliveryInformationPage() {
  const whatsappUrl = buildWhatsAppSupportUrl();
  const freeThreshold = STORE_CONFIG.freeDeliveryThreshold;
  const deliveryFee = STORE_CONFIG.defaultDeliveryFee;

  const cards = [
    {
      icon: Timer,
      title: "Same-Day Dispatch",
      text: "Orders confirmed before 3 PM PKT are dispatched the same working day directly from our central warehouse.",
    },
    {
      icon: Truck,
      title: "Express Nationwide Transit",
      text: "Delivery within 24–48 hours in Karachi, Lahore, Islamabad & Rawalpindi; 2–4 working days in other regions.",
    },
    {
      icon: PackageCheck,
      title: "Real-Time Tracking",
      text: "Every order is assigned a live courier tracking number. Track every shipment milestone on our Track Order portal.",
    },
    {
      icon: MapPin,
      title: "Complete Pakistan Coverage",
      text: "We ship to over 250+ cities, towns, and commercial districts across all provinces.",
    },
  ];

  return (
    <div className="bg-slate-50 dark:bg-[#0F1217] min-h-screen">
      {/* Hero */}
      <div className="bg-[#111111] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4">
            Fast &amp; Tracked
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Delivery <span className="text-primary">Information</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Everything you need to know about courier transit, delivery fees, and order dispatch at DK Power.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
        {/* Charges highlight */}
        <div className="bg-white dark:bg-[#15181E] rounded-3xl border border-slate-200 dark:border-[#262C37] p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-red-50 dark:bg-red-950/20 text-primary flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Delivery Rates
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-5 text-center">
              <p className="text-2xl font-extrabold text-primary">FREE</p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                On all orders above Rs. {freeThreshold.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-[#1C2028] border border-slate-200 dark:border-[#2A2F3A] p-5 text-center">
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Rs. {deliveryFee}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Flat rate on orders below Rs. {freeThreshold.toLocaleString()}
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            The exact delivery fee is automatically calculated at checkout before order confirmation.
          </p>
        </div>

        {/* Info cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white dark:bg-[#15181E] rounded-3xl border border-slate-200 dark:border-[#262C37] p-6 shadow-sm"
            >
              <div className="w-11 h-11 rounded-2xl bg-red-50 dark:bg-red-950/20 text-primary flex items-center justify-center mb-4">
                <card.icon className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-[#8A919C] leading-relaxed">
                {card.text}
              </p>
            </div>
          ))}
        </div>

        {/* Payment note */}
        <div className="bg-white dark:bg-[#15181E] rounded-3xl border border-slate-200 dark:border-[#262C37] p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-3">
            Payment &amp; Dispatch Policy
          </h2>
          <p className="text-sm text-slate-600 dark:text-[#8A919C] leading-relaxed">
            We provide nationwide <strong className="text-slate-900 dark:text-white">Cash on Delivery (COD)</strong>{" "}
            as well as <strong className="text-slate-900 dark:text-white">Direct Bank Transfer</strong> for priority processing.
            For commercial wholesale orders, bank transfer ensures immediate warehouse packing and dispatch.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-primary rounded-3xl p-8 sm:p-10 text-center text-white">
          <h2 className="text-2xl font-extrabold">Have a question about your parcel?</h2>
          <p className="mt-2 text-sm text-red-100">
            Message us on WhatsApp with your Order ID for real-time tracking assistance.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-full text-sm hover:bg-slate-100 transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Ask on WhatsApp
            </a>
            <Link
              href="/track-order"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-white/10 transition-colors"
            >
              Track Your Order <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
