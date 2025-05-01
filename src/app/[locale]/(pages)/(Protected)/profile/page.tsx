import PageHeader from "@/app/_Components/PageHeader/PageHeader";
import ProfileSettings from "@/app/_Components/ProfileSettings/ProfileSettings";
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

  return {
    title: t("Profile.Title"),
    description: t("Profile.Description"),
  };
}

const Profile = async () => {
  const t = await getTranslations("Account");
  return (
    <>
      <PageHeader title={t("PageHeader")} />
      <ProfileSettings />
    </>
  );
};

export default Profile;
