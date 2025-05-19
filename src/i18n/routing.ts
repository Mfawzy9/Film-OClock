import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"],

  // Used when no locale matches
  defaultLocale: "en",
  localePrefix: "always",
});

export const locales = routing.locales;
