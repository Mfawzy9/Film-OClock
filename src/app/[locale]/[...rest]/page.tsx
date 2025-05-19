import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "en" | "ar" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "MetaData" });
  return {
    title: t("NotFound.Title"),
    description: t("NotFound.description"),
  };
}

export default function CatchAllPage() {
  notFound();
}
