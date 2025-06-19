import PageHeader from "@/app/_Components/PageHeader/PageHeader";
import WatchedShows from "@/app/_Components/WatchedShows/WatchedShows";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{
    locale: "en" | "ar";
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "MetaData" });

  const title = t("Library.WatchedList.Title") ?? t("MainPage.Title");
  const description =
    t("Library.WatchedList.Description") ?? t("MainPage.Description");

  return {
    title,
    description,
  };
}

const WatchedShowsPage = () => {
  return (
    <>
      <PageHeader />
      <WatchedShows />
    </>
  );
};

export default WatchedShowsPage;
