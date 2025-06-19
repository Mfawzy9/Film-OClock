import PageHeader from "@/app/_Components/PageHeader/PageHeader";
import PageSection from "@/app/_Components/PageSection/PageSection";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import TermsPage from "@/app/_Components/LegalComps/Terms/Terms";
import PrivacyPage from "@/app/_Components/LegalComps/Privacy/Privacy";
import DmcaPage from "@/app/_Components/LegalComps/Dmca/Dmca";
import ContentRemovalPage from "@/app/_Components/LegalComps/ContentRemoval/ContentRemoval";
import { notFound } from "next/navigation";

const pageComponents = {
  terms: TermsPage,
  privacy: PrivacyPage,
  dmca: DmcaPage,
  "content-removal": ContentRemovalPage,
} as const;

type Slug = keyof typeof pageComponents;

interface LegalPageProps {
  params: Promise<{
    locale: "en" | "ar";
    slug: Slug;
  }>;
}

export const generateMetadata = async ({
  params,
}: LegalPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const t = await getTranslations(`MetaData.${slug}`);

  return {
    title: t("Title"),
    description: t("Description"),
  };
};

const LegalPage = async ({ params }: LegalPageProps) => {
  const { slug } = await params;

  const PageComponent = pageComponents[slug];
  if (!PageComponent) return notFound();

  const t = await getTranslations("Legal");

  return (
    <>
      <PageHeader title={t(slug)} />
      <PageSection className="!py-10">
        <PageComponent />
      </PageSection>
    </>
  );
};

export default LegalPage;
