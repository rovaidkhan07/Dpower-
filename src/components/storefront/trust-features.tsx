import React from "react";
import { Boxes, ClipboardCheck, PackageCheck, Truck } from "lucide-react";

export function TrustFeatures() {
  const features = [
    { icon: Boxes, title: "Browse Wholesale Range", description: "Explore mobile accessories by category, brand and SKU." },
    { icon: ClipboardCheck, title: "Confirm Your Order", description: "Build a bulk order and confirm quantities before checkout." },
    { icon: PackageCheck, title: "Stock & Order Control", description: "Orders use live inventory controls to reduce overselling risk." },
    { icon: Truck, title: "Dispatch & Tracking", description: "Follow confirmed orders through the available tracking flow." },
  ];

  return (
    <section className="bg-secondary py-8 font-sans dark:bg-[#1b1b1d] sm:py-12">
      <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
        <div className="mx-auto mb-7 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-3 py-1 text-xs font-bold text-primary shadow-sm dark:border-red-950 dark:bg-[#151516]">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Wholesale Ordering
          </div>
          <h2 className="mb-3 text-2xl font-black tracking-tight text-foreground md:text-3xl">Built for Repeat Trade Orders</h2>
          <p className="text-sm font-medium leading-relaxed text-muted-foreground sm:text-base">A straightforward catalog and ordering flow for retailers and resellers who need dependable product and inventory visibility.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-primary dark:bg-red-950/30"><Icon className="h-6 w-6" strokeWidth={1.8} /></div>
                <h3 className="mb-1.5 text-sm font-extrabold text-foreground">{feature.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
