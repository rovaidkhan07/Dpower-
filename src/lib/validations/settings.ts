import { z } from "zod";

const nonNegativeMoneyString = z
  .string()
  .trim()
  .regex(/^\d+(?:\.\d{1,2})?$/, "Must be a valid non-negative amount")
  .refine((value) => Number.isFinite(Number(value)) && Number(value) >= 0, "Must be a valid non-negative amount");

export const storeSettingsSchema = z.object({
  store_name: z.string().trim().min(1, "Store name is required").max(80),
  store_tagline: z.string().trim().max(160),
  store_phone: z.string().trim().min(7).max(30),
  store_whatsapp: z
    .string()
    .trim()
    .regex(/^\d{10,15}$/, "WhatsApp number must contain 10 to 15 digits including country code"),
  store_email: z.string().trim().email("Enter a valid support email").max(160),
  store_address: z.string().trim().min(5, "Store address is required").max(250),
  currency: z.string().trim().min(1).max(10),
  currency_symbol: z.string().trim().min(1).max(10),
  delivery_fee: nonNegativeMoneyString,
  free_delivery_threshold: nonNegativeMoneyString,
  bank_name: z.string().trim().max(100),
  bank_account_title: z.string().trim().max(120),
  bank_account_number: z.string().trim().max(60),
  bank_iban: z.string().trim().max(50),
});

export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;
