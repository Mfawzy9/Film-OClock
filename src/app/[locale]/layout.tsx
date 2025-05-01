import type { Metadata } from "next";

import App from "./App";
import { Toaster } from "sonner";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { cairo, righteous, roboto } from "@/lib/fonts";
import { getTranslations } from "next-intl/server";
import { siteBaseUrl } from "../../../helpers/serverBaseUrl";
import NoInternetToast from "../_Components/NoInternetToast/NoInternetToast";

type Props = {
  params: Promise<{ locale: "en" | "ar" }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "MetaData" });

  return {
    title: {
      default: t("MainPage.Title"),
      template: `%s | ${t("MainPage.Title")}`,
    },
    description: t("MainPage.Description"),
    keywords: t("Keywords")
      .split(",")
      .map((k) => k.trim()),
    metadataBase: new URL("https://filmoclock.vercel.app/"),
    alternates: {
      canonical: `${siteBaseUrl}/${locale}/`,
      languages: {
        "en-US": `${siteBaseUrl}/en`,
        "ar-EG": `${siteBaseUrl}/ar`,
      },
    },
    openGraph: {
      title: t("MainPage.Title"),
      description: t("MainPage.Description"),
      url: `${siteBaseUrl}/${locale}`,
      siteName: t("MainPage.Title"),
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("MainPage.Title"),
      description: t("MainPage.Description"),
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "4fxUEEpS5EPAOcFpt1p5J6eTAUm04ByRFl4q3b0EaGY",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const isArabic = locale === "ar";

  return (
    <html lang={locale} dir={isArabic ? "rtl" : "ltr"} className="dark">
      {/* favicon */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body
        className={` ${righteous.variable} ${cairo.variable} ${roboto.variable}
          ${isArabic ? "font-cairo" : "font-roboto"} antialiased bg-gray-50 text-gray-950
          dark:bg-gray-950 dark:text-gray-50 `}
      >
        <NextIntlClientProvider>
          <NoInternetToast />
          <App>
            {children}
            <Toaster
              theme="dark"
              toastOptions={{
                classNames: {
                  error: "!border !border-red-500 !text-red-500",
                  success: "!border !border-green-500 !text-green-500",
                },
              }}
            />
          </App>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
