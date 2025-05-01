import PopularPpl from "@/app/_Components/PopularPpl/PopularPpl";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ locale: "ar" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "MetaData" });

  return {
    title: t("PopularPeople.Title"),
    description: t("PopularPeople.Description"),
  };
}

const PopularPplPage = () => {
  return <PopularPpl />;
};

export default PopularPplPage;
