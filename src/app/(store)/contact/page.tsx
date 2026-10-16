import {
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import {
  buildWhatsAppSupportUrl,
  STORE_CONFIG,
} from "@/lib/config/store";

export const metadata = {
  title: "Contact Us | DK Power",
  description:
    "Contact DK Power — Pakistan's high-performance tech brand. Reach us on WhatsApp, email, or phone for orders, bulk wholesale, and support.",
};

export default function ContactPage() {
  const whatsappUrl = buildWhatsAppSupportUrl();

  const channels = [
    {
      icon: MessageCircle,
      title: "WhatsApp Trade & Support",
      text: "Fastest response — dedicated technical and sales advisors.",
      value: STORE_CONFIG.phone,
      href: whatsappUrl,
      cta: "Chat on WhatsApp",
      external: true,
    },
    {
      icon: Mail,
      title: "Official Email",
      text: "For bulk distributor quotes, warranty claims, and corporate inquiries.",
      value: STORE_CONFIG.email,
      href: `mailto:${STORE_CONFIG.email}`,
      cta: "Send Email",
      external: false,
    },
    {
      icon: Phone,
      title: "Phone Support",
      text: "Direct line during business hours.",
      value: STORE_CONFIG.phone,
      href: `tel:${STORE_CONFIG.phone.replace(/\s/g, "")}`,
      cta: "Call Now",
      external: false,
    },
  ];

  return (
    <div className="bg-slate-50 dark:bg-[#0F1217] min-h-screen">
      {/* Hero */}
      <div className="bg-[#111111] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4">
            We&apos;re Here To Help
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Contact <span className="text-primary">DK Power</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Questions about an order, wholesale pricing, or warranty replacement? Reach out to our team.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
        {/* Channels */}
        <div className="grid sm:grid-cols-3 gap-4">
          {channels.map((ch) => (
            <div
              key={ch.title}
              className="bg-white dark:bg-[#15181E] rounded-3xl border border-slate-200 dark:border-[#262C37] p-6 shadow-sm flex flex-col"
            >
              <div className="w-11 h-11 rounded-2xl bg-red-50 dark:bg-red-950/20 text-primary flex items-center justify-center mb-4">
                <ch.icon className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white">{ch.title}</h3>
              <p className="text-xs text-slate-500 dark:text-[#8A919C] mt-1 flex-1">{ch.text}</p>
              <p className="text-sm font-bold text-slate-900 dark:text-[#D5D9E0] mt-3 break-all">
                {ch.value}
              </p>
              <a
                href={ch.href}
                {...(ch.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="mt-4 inline-flex items-center justify-center gap-2 bg-primary hover:bg-accent text-white font-bold px-5 py-2.5 rounded-full text-xs transition-colors"
              >
                {ch.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Hours + address */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#15181E] rounded-3xl border border-slate-200 dark:border-[#262C37] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/20 text-primary flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white">Business Hours</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-[#8A919C] leading-relaxed">
              Monday – Saturday, 10:00 AM – 8:00 PM (PKT).
              <br />
              WhatsApp inquiries are answered within 1-2 hours.
            </p>
          </div>
          <div className="bg-white dark:bg-[#15181E] rounded-3xl border border-slate-200 dark:border-[#262C37] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/20 text-primary flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white">Central Hub</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-[#8A919C] leading-relaxed">
              {STORE_CONFIG.address}
            </p>
          </div>
        </div>

        {/* Big WhatsApp CTA */}
        <div className="bg-primary rounded-3xl p-8 sm:p-10 text-center text-white">
          <h2 className="text-2xl font-extrabold">
            Quick Inquiries &amp; Bulk Orders
          </h2>
          <p className="mt-2 text-sm text-red-100">
            One tap — chat directly with our trade team on WhatsApp.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-8 py-3 rounded-full text-sm hover:bg-slate-100 transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> Open WhatsApp Chat
          </a>
        </div>
      </div>
    </div>
  );
}
