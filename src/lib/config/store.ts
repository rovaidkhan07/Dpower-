export const STORE_CONFIG = {
  name: process.env.NEXT_PUBLIC_STORE_NAME || "DK Power",
  tagline: process.env.NEXT_PUBLIC_STORE_TAGLINE || "Wholesale Mobile Accessories & Power Solutions",
  phone: process.env.NEXT_PUBLIC_STORE_PHONE || "",
  whatsapp: process.env.NEXT_PUBLIC_STORE_WHATSAPP || "",
  email: process.env.NEXT_PUBLIC_STORE_EMAIL || "",
  address: process.env.NEXT_PUBLIC_STORE_ADDRESS || "",
  currency: process.env.NEXT_PUBLIC_CURRENCY || "PKR",
  currencySymbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "Rs.",
  defaultDeliveryFee: Number(process.env.NEXT_PUBLIC_DEFAULT_DELIVERY_FEE || 200),
  freeDeliveryThreshold: Number(process.env.NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD || 0),
  dealOfTheDayEndDate: process.env.NEXT_PUBLIC_DEAL_END_DATE || "",

  bankDetails: {
    bankName: process.env.NEXT_PUBLIC_BANK_NAME || "",
    accountTitle: process.env.NEXT_PUBLIC_BANK_ACCOUNT_TITLE || "",
    accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER || "",
    iban: process.env.NEXT_PUBLIC_BANK_IBAN || "",
  },
};

function whatsappUrl(message: string): string {
  const cleanNumber = STORE_CONFIG.whatsapp.replace(/\D/g, "");
  if (!cleanNumber) return "/contact";
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppInquiryUrl(productName: string, sku: string): string {
  return whatsappUrl(
    `Hello ${STORE_CONFIG.name}, I would like wholesale availability and pricing for:\n\n*Product:* ${productName}\n*SKU:* ${sku}\n\nPlease share current stock, MOQ and trade price.`
  );
}

export function buildWhatsAppSupportUrl(): string {
  return whatsappUrl(`Hello ${STORE_CONFIG.name}, I need help with a wholesale order or product inquiry.`);
}

export function buildWhatsAppOrderSupportUrl(orderNumber: string): string {
  return whatsappUrl(`Hello ${STORE_CONFIG.name}, I would like to inquire about order *${orderNumber}*.`);
}

export const buildWhatsAppProductInquiryUrl = buildWhatsAppInquiryUrl;
export const buildWhatsAppGeneralSupportUrl = buildWhatsAppSupportUrl;
