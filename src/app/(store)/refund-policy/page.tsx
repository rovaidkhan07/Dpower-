import Link from "next/link";
import {
  RotateCcw,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { buildWhatsAppSupportUrl } from "@/lib/config/store";

export const metadata = {
  title: "Refund & Return Policy | DK Power",
  description:
    "DK Power refund and return policy — 7-day hassle-free returns on eligible tech accessories across Pakistan.",
};

const steps = [
  {
    title: "Contact us on WhatsApp",
    text: "Message our team with your order number and a quick photo/video of the issue.",
  },
  {
    title: "Instant Verification",
    text: "Our customer success team reviews your claim promptly within 24 hours.",
  },
  {
    title: "Replacement or Bank Refund",
    text: "Once approved, we arrange a swift replacement or process an instant refund directly to your bank account.",
  },
];

const eligible = [
  "Product arrived damaged or defective during transit",
  "Wrong model, color, or cable length delivered",
  "Product fails to perform according to listed technical specifications",
];

const notEligible = [
  "Physical drops, burned ports due to improper electrical sockets, or water immersion",
  "Items returned without their original retail box and included accessories",
  "Items damaged through unauthorized repair or modifications",
];

export default function RefundPolicyPage() {
  const whatsappUrl = buildWhatsAppSupportUrl();
  return (
    <div className="bg-slate-50 dark:bg-[#0F1217] min-h-screen">
      {/* Hero */}
      <div className="bg-[#111111] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4">
            Our Promise
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Refund &amp; <span className="text-primary">Return Policy</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Transparent, customer-first returns. Here is how returns and refunds work at DK Power.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
        {/* Intro card */}
        <div className="bg-white dark:bg-[#15181E] rounded-3xl border border-slate-200 dark:border-[#262C37] p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-red-50 dark:bg-red-950/20 text-primary flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              7-Day Easy Returns
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-[#8A919C] leading-relaxed">
            We provide hassle-free returns on eligible items within{" "}
            <strong className="text-slate-900 dark:text-white">7 days of courier delivery</strong>. If
            your product arrives damaged, defective, or incorrect, our team will make it right immediately with a replacement or a bank refund.
          </p>
        </div>

        {/* Eligible / not eligible */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#15181E] rounded-3xl border border-slate-200 dark:border-[#262C37] p-6 shadow-sm">
            <h3 className="font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> Eligible for
              return
            </h3>
            <ul className="space-y-3">
              {eligible.map((item) => (
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
            <h3 className="font-extrabold text-slate-900 dark:text-white mb-4">Not covered</h3>
            <ul className="space-y-3">
              {notEligible.map((item) => (
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

        {/* Process */}
        <div className="bg-white dark:bg-[#15181E] rounded-3xl border border-slate-200 dark:border-[#262C37] p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6">
            How to request a return
          </h2>
          <div className="space-y-5">
            {steps.map((step, i) => (
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
        </div>

        {/* Refund method */}
        <div className="bg-white dark:bg-[#15181E] rounded-3xl border border-slate-200 dark:border-[#262C37] p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-3">
            How refunds are processed
          </h2>
          <p className="text-sm text-slate-600 dark:text-[#8A919C] leading-relaxed">
            Approved refunds are remitted directly via online bank transfer within 2-4 working days. For Cash on Delivery orders, our representative will request your IBAN or account details over official WhatsApp to process the reimbursement.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-primary rounded-3xl p-8 sm:p-10 text-center text-white">
          <h2 className="text-2xl font-extrabold">Need to initiate a return?</h2>
          <p className="mt-2 text-sm text-red-100">
            Send us a message on WhatsApp with your order number — our team will assist you immediately.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-full text-sm hover:bg-slate-100 transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
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
