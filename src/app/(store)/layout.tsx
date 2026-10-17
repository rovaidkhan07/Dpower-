import React from "react";
import { Header } from "@/components/storefront/header";
import { KharidlyDesktopHeader } from "@/components/storefront/kharidly-desktop-header";
import { MobileBottomNav } from "@/components/storefront/mobile-bottom-nav";
import { Footer } from "@/components/storefront/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { WhatsAppFloatingButton } from "@/components/storefront/whatsapp-button";
import { RuntimeStoreSettings } from "@/components/storefront/runtime-store-settings";
import { CartProvider } from "@/hooks/use-cart";
import { getStoreSettings } from "@/lib/services/settingsService";

export const dynamic = "force-dynamic";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getStoreSettings();

  return (
    <RuntimeStoreSettings settings={settings}>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0F1115] text-slate-900 dark:text-[#D5D9E0] font-sans antialiased">
          <div className="hidden lg:block">
            <KharidlyDesktopHeader />
          </div>
          <div className="lg:hidden">
            <Header />
          </div>
          <main className="flex-1 pb-20 lg:pb-0">{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppFloatingButton />
          <MobileBottomNav />
        </div>
      </CartProvider>
    </RuntimeStoreSettings>
  );
}
