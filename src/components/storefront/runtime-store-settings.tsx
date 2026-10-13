"use client";

import React, { useEffect } from "react";
import { STORE_CONFIG } from "@/lib/config/store";

interface RuntimeStoreSettingsProps {
  settings: Record<string, string>;
  children: React.ReactNode;
}

function asFiniteNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export function RuntimeStoreSettings({ settings, children }: RuntimeStoreSettingsProps) {
  useEffect(() => {
    STORE_CONFIG.name = settings.store_name || STORE_CONFIG.name;
    STORE_CONFIG.tagline = settings.store_tagline || STORE_CONFIG.tagline;
    STORE_CONFIG.phone = settings.store_phone || STORE_CONFIG.phone;
    STORE_CONFIG.whatsapp = settings.store_whatsapp || STORE_CONFIG.whatsapp;
    STORE_CONFIG.email = settings.store_email || STORE_CONFIG.email;
    STORE_CONFIG.address = settings.store_address || STORE_CONFIG.address;
    STORE_CONFIG.currency = settings.currency || STORE_CONFIG.currency;
    STORE_CONFIG.currencySymbol = settings.currency_symbol || STORE_CONFIG.currencySymbol;
    STORE_CONFIG.defaultDeliveryFee = asFiniteNumber(
      settings.delivery_fee,
      STORE_CONFIG.defaultDeliveryFee
    );
    STORE_CONFIG.freeDeliveryThreshold = asFiniteNumber(
      settings.free_delivery_threshold,
      STORE_CONFIG.freeDeliveryThreshold
    );
    STORE_CONFIG.bankDetails.bankName = settings.bank_name || STORE_CONFIG.bankDetails.bankName;
    STORE_CONFIG.bankDetails.accountTitle =
      settings.bank_account_title || STORE_CONFIG.bankDetails.accountTitle;
    STORE_CONFIG.bankDetails.accountNumber =
      settings.bank_account_number || STORE_CONFIG.bankDetails.accountNumber;
    STORE_CONFIG.bankDetails.iban = settings.bank_iban || STORE_CONFIG.bankDetails.iban;
  }, [settings]);

  return <>{children}</>;
}
