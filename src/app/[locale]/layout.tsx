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
import { WithContext, Organization } from "schema-dts";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Error from "../error";
import ChunkErrorBoundary from "../_Components/ChunkErrorBoundary";

import "swiper/css";

type Props = {
  params: Promise<{ locale: "en" | "ar" }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "MetaData" });
  return {
    title: t("MainPage.Title"),
    description: t("MainPage.Description"),
    keywords: t("Keywords")
      .split(",")
      .map((k) => k.trim()),
    metadataBase: new URL(siteBaseUrl),
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
      images: [`${siteBaseUrl}/logoImg.png`, `${siteBaseUrl}/logo.webp`],
    },
    twitter: {
      card: "summary_large_image",
      title: t("MainPage.Title"),
      description: t("MainPage.Description"),
      images: [`${siteBaseUrl}/logoImg.png`],
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

  const t = await getTranslations({ locale, namespace: "MetaData" });

  const jsonLd: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: t("MainPage.Title"),
    description: t("MainPage.Description"),
    url: siteBaseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteBaseUrl}/logo.webp`,
      width: {
        "@type": "QuantitativeValue",
        value: 512,
        unitText: "PX",
      },
      height: {
        "@type": "QuantitativeValue",
        value: 512,
        unitText: "PX",
      },
      alternateName: "FilmO'Clock",
    },
    knowsLanguage: locale,
    "@id": `${siteBaseUrl}/#organization`,
    keywords: t("Keywords"),
    foundingDate: "2025",
    legalName: "FilmO'Clock",
    image: {
      "@type": "ImageObject",
      url: `${siteBaseUrl}/logoImg.png`,
      width: {
        "@type": "QuantitativeValue",
        value: 512,
        unitText: "PX",
      },
      height: {
        "@type": "QuantitativeValue",
        value: 512,
        unitText: "PX",
      },
      alternateName: "FilmO'Clock",
    },
  };

  const isArabic = locale === "ar";

  return (
    <html lang={locale} dir={isArabic ? "rtl" : "ltr"} className="dark">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />

        {/* Global Chunk Error Handler */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
      window.addEventListener("error", function (e) {
        if (
          e.message?.includes("Failed to fetch dynamically imported module") ||
          e.message?.includes("Failed to load chunk") ||
          e.message?.includes("Importing a module script failed")
        ) {
          const message = ${
            isArabic
              ? `"حدث خطأ أثناء تحميل التطبيق. سيتم إعادة تحميل الصفحة."`
              : `"There is a problem loading the application. The page will reload."`
          };
          alert(message);
          caches.keys().then(function (names) {
            for (let name of names) caches.delete(name);
          }).finally(() => {
            window.location.reload(true);
          });
        }
      });
    `,
          }}
        />
        {/* favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <ErrorBoundary errorComponent={Error}>
        <body
          className={` ${righteous.variable} ${cairo.variable} ${roboto.variable}
            ${isArabic ? "font-cairo" : "font-roboto"} antialiased bg-gray-950 text-gray-50 `}
        >
          <NextIntlClientProvider>
            <ChunkErrorBoundary>
              <NoInternetToast />
              <App locale={locale}>
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
            </ChunkErrorBoundary>
          </NextIntlClientProvider>
        </body>
      </ErrorBoundary>
    </html>
  );
}
