import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import { PixelScripts } from "@/components/analytics/pixel-scripts";
import { NavigationProgress } from "@/components/ui/navigation-progress";
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION, isPreviewDeployment } from "@/lib/seo";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  robots: isPreviewDeployment() ? { index: false, follow: false } : { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Kharidly",
    locale: "en_PK",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: { card: "summary", title: SITE_TITLE, description: SITE_DESCRIPTION },
  title: {
    default: SITE_TITLE,
    template: "%s | Kharidly",
  },
  description:
    SITE_DESCRIPTION,
  icons: {
    icon: "/logo/favicon.png",
  },
  keywords: [
    "mobile accessories pakistan",
    "fast charger karachi",
    "anker charger",
    "baseus 65w gan",
    "type c cable",
    "power bank",
    "wireless earbuds",
    "cash on delivery accessories",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('kharidly-theme');if(t==='dark'){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <Suspense fallback={null}>
          <PixelScripts />
        </Suspense>
        {children}
        <Analytics />
      </body>
    </html>
  );
}


