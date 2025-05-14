"use client"; // Error boundaries must be Client Components

import { NextIntlClientProvider } from "next-intl";
import { useEffect } from "react";
import PublicError from "./_Components/PublicError/PublicError";
import { useParams } from "next/navigation";

import enMessages from "../../messages/en.json";
import arMessages from "../../messages/ar.json";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const params = useParams<{ locale: "en" | "ar" }>();
  const { locale } = params;
  useEffect(() => {
    console?.error(error);
  }, [error]);

  const messages = locale === "ar" ? arMessages : enMessages;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <PublicError />
    </NextIntlClientProvider>
  );
}
