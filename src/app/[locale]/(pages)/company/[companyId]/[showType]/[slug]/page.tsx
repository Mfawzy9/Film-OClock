import CompanyComp from "@/app/_Components/CompanyComp/CompanyComp";
import {
  getCompanyShowsWithNextCache,
  getCompanyDetailsWithNextCache,
} from "@/lib/tmdbRequests";
import dynamic from "next/dynamic";
import { notFound, redirect } from "next/navigation";
import { nameToSlug } from "../../../../../../../../helpers/helpers";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { siteBaseUrl } from "../../../../../../../../helpers/serverHelpers";
import { RTKPreloader } from "@/app/_Components/helpers/RTKPreloader";

const PageHeader = dynamic(
  () => import("@/app/_Components/PageHeader/PageHeader"),
);

interface CompanyPageProps {
  params: Promise<{
    locale: "en" | "ar";
    companyId: string;
    showType: "movie" | "tv";
    slug: string;
  }>;
  searchParams: Promise<{ page: string }>;
}

export const generateMetadata = async ({
  params,
}: CompanyPageProps): Promise<Metadata> => {
  const { companyId, locale, showType } = await params;

  const t = await getTranslations({
    locale,
    namespace: "MetaData.CompanyPage",
  });
  const company = await getCompanyDetailsWithNextCache({ companyId });

  if (!company) return { title: t("NotFoundTitle") };

  const slug = nameToSlug(company.name);

  const title = `${company.name} - ${t("TitleSuffix", { type: t(showType) })}`;
  const description =
    company.description ||
    t("MetaDescriptionFallback", {
      companyName: company.name,
      type: t(showType),
    });

  const canonicalUrl = `${siteBaseUrl}/${locale}/company/${companyId}/${showType}/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${siteBaseUrl}/en/company/${companyId}/${showType}/${slug}`,
        ar: `${siteBaseUrl}/ar/company/${companyId}/${showType}/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "profile",
      siteName: t("siteName"),
      images: company.logo_path
        ? [
            {
              url: `${process.env.NEXT_PUBLIC_BASE_IMG_URL_W500}${company.logo_path}`,
              width: 500,
              height: 500,
              alt: `${company.name} Logo`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: company.logo_path
        ? `${process.env.NEXT_PUBLIC_BASE_IMG_URL_W500}${company.logo_path}`
        : undefined,
    },
  };
};

const CompanyPage = async ({ params, searchParams }: CompanyPageProps) => {
  const { companyId, showType, slug, locale } = await params;
  const { page } = await searchParams;
  const pageInt = Number(page) || 1;

  const companyShows = await getCompanyShowsWithNextCache({
    companyId,
    showType,
  });

  const companyDetails = await getCompanyDetailsWithNextCache({ companyId });

  if (showType !== "movie" && showType !== "tv") return notFound();

  if (companyDetails) {
    const correctSlug = nameToSlug(companyDetails.name);
    const decodedSlug = decodeURIComponent(slug);

    if (decodedSlug !== correctSlug) {
      const encodedSlug = encodeURIComponent(correctSlug);
      redirect(`/${locale}/company/${companyId}/${showType}/${encodedSlug}`);
    }
  }

  return (
    <>
      {companyShows && (
        <RTKPreloader
          preloadedQueries={[
            {
              endpointName: "getMoviesTvShows",
              args: { companies: companyId, showType, page: 1, sortBy: "" },
              data: companyShows,
            },
          ]}
        />
      )}
      {!companyDetails?.logo_path && <PageHeader />}
      <CompanyComp
        companyShows={companyShows}
        companyDetails={companyDetails}
        showType={showType}
        companyId={companyId}
        pageParam={pageInt}
      />
    </>
  );
};

export default CompanyPage;
