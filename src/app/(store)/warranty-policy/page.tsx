import Link from "next/link";
import {
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  XCircle,
  FileCheck,
} from "lucide-react";
import { buildWhatsAppSupportUrl } from "@/lib/config/store";

export const metadata = {
  title: "Warranty Policy | DK Power",
  description:
    "DK Power official warranty policy — genuine chargers, power banks, and cables backed by direct replacement warranty across Pakistan.",
};

const covered = [
  "Manufacturing defects out of the box",
  "Faulty charging, multi-port failure, or connectivity issues within warranty period",
  "Internal battery failure or power bank output loss under normal use",
  "Fast charge protocol handshaking failures (PD / QC / GaN)",
];

const notCovered = [
  "Physical damage from drops, severe impacts, or excessive pressure",
  "Water, moisture, or liquid submersion damage",
  "Damage from unauthorized dismantling, tampering, or modifications",
  "Intentional cable cutting or extreme outer tear beyond normal use",
];

export default function WarrantyPolicyPage() {
  const whatsappUrl = buildWhatsAppSupportUrl();
  return (
    <div className="bg-slate-50 dark:bg-[#0F1217] min-h-screen">
      {/* Hero */}
      <div className="bg-[#111111] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4">
            Buy With Confidence
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            DK Power <span className="text-primary">Warranty Policy</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            High-performance hardware backed by hassle-free brand protection.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
        {/* Intro card */}
        <div className="bg-white dark:bg-[#15181E] rounded-3xl border border-slate-200 dark:border-[#262C37] p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-red-50 dark:bg-red-950/20 text-primary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Official Brand Warranty
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-[#8A919C] leading-relaxed">
            All DK Power products come with our official brand warranty as stated on the product packaging and detail page. Because every device is{" "}
            <strong className="text-slate-900 dark:text-white">100% original and lab-inspected</strong>,
            warranty claims are quick and straightforward: message us on WhatsApp with your order number and we resolve it promptly.
          </p>
        </div>

        {/* Covered / not covered */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#15181E] rounded-3xl border border-slate-200 dark:border-[#262C37] p-6 shadow-sm">
            <h3 className="font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-primary" /> What&apos;s
              covered
            </h3>
            <ul className="space-y-3">
              {covered.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-[#8A919C]"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white dark:bg-[#15181E] rounded-3xl border border-slate-200 dark:border-[#262C37] p-6 shadow-sm">
            <h3 className="font-extrabold text-slate-900 dark:text-white mb-4">
              What&apos;s not covered
            </h3>
            <ul className="space-y-3">
              {notCovered.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-[#8A919C]"
                >
                  <XCircle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Claim process */}
        <div className="bg-white dark:bg-[#15181E] rounded-3xl border border-slate-200 dark:border-[#262C37] p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6">
            How to claim warranty
          </h2>
          <div className="space-y-5">
            {[
              {
                title: "Message us on WhatsApp",
                text: "Send your order number along with a short 10-second video demonstrating the charging issue.",
              },
              {
                title: "Rapid Verification",
                text: "Our technical support team verifies the serial code and issue — usually within 12-24 hours.",
              },
              {
                title: "Direct Replacement",
                text: "Covered hardware receives an immediate replacement unit dispatched via courier.",
              },
            ].map((step, i) => (
              <div key={step.title} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">
                    {step.title}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-[#8A919C] mt-1">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-slate-500 leading-relaxed">
            Your DK Power invoice / order number serves as your digital warranty card.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-primary rounded-3xl p-8 sm:p-10 text-center text-white">
          <h2 className="text-2xl font-extrabold">Need warranty assistance?</h2>
          <p className="mt-2 text-sm text-red-100">
            Reach out on WhatsApp with your order number — our team will resolve it quickly.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-full text-sm hover:bg-slate-100 transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Claim Warranty on WhatsApp
            </a>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-white/10 transition-colors"
            >
              Browse Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
