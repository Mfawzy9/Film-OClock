import { routing } from "@/i18n/routing";
import messages from "./messages/en.json";
import { useTranslations } from "next-intl";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export type TFunction = ReturnType<typeof useTranslations>;
