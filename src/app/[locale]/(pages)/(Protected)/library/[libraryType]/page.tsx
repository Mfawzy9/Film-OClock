import LibraryClient from "@/app/_Components/Library/LibraryClient/LibraryClient";
import PageHeader from "@/app/_Components/PageHeader/PageHeader";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{
    locale: "en" | "ar";
    libraryType: "watchlist" | "favorites";
  }>;
};

type MetaDataKey = "Library.watchlist" | "Library.favorites";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, libraryType } = await params;
  const t = await getTranslations({ locale, namespace: "MetaData" });

  const metaKey: MetaDataKey = `Library.${libraryType}`;
  const title = t(`${metaKey}.Title`) ?? t("MainPage.Title");
  const description = t(`${metaKey}.Description`) ?? t("MainPage.Description");

  return {
    title,
    description,
  };
}

const page = async () => {
  return (
    <>
      <PageHeader />
      <LibraryClient />
    </>
  );
};

export default page;
