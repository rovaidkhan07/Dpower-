export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const SITE_TITLE = "DK Power | Wholesale Mobile Accessories in Pakistan";
export const SITE_DESCRIPTION =
  "DK Power supplies wholesale mobile accessories and power products for retailers and resellers in Pakistan, including chargers, cables, power banks and audio accessories.";

export function siteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function isPreviewDeployment(): boolean {
  return process.env.VERCEL_ENV === "preview" || process.env.VERCEL_ENV === "development";
}
