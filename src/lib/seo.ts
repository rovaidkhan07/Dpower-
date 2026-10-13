export const SITE_URL = "https://kharidly.pk";
export const SITE_TITLE = "Kharidly | Electronics & Tech Gadgets in Pakistan";
export const SITE_DESCRIPTION =
  "Shop tech gadgets and mobile accessories in Pakistan at Kharidly. Browse chargers, cables, power banks and audio accessories with Cash on Delivery.";

export function siteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function isPreviewDeployment(): boolean {
  return process.env.VERCEL_ENV === "preview" || process.env.VERCEL_ENV === "development";
}
