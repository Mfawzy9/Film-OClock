import { CompanyDetailsResponse } from "@/app/interfaces/apiInterfaces/CompanyDetailsInterfaces";
import { Link } from "@/i18n/navigation";
import { FaExternalLinkAlt } from "@react-icons/all-files/fa/FaExternalLinkAlt";
import Image from "next/image";
import React from "react";
import { nameToSlug } from "../../../../helpers/helpers";

const CompanyDetails = ({
  companyDetails,
  showType,
  t,
}: {
  companyDetails: CompanyDetailsResponse;
  showType: "movie" | "tv";
  t: any;
}) => {
  return (
    <div className="bg-gray-900 rounded-xl p-3 mb-10 shadow-lg border border-gray-800">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        {/* Logo Container */}
        <div
          className="flex-shrink-0 w-40 h-40 rounded-lg bg-gray-800 flex items-center justify-center
            overflow-hidden border border-gray-700 p-1"
        >
          {companyDetails.logo_path ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W500}${companyDetails.logo_path}`}
              alt={`${companyDetails.name} logo`}
              width={160}
              height={160}
              className="object-contain w-full h-full"
            />
          ) : (
            <span className="text-gray-500 text-lg font-medium">
              {t("CompanyDetails.NoLogo")}
            </span>
          )}
        </div>

        {/* Details Container */}
        <div className="flex-1 text-gray-200">
          <h1 className="text-3xl font-bold text-white mb-2">
            {companyDetails.name}
          </h1>

          {companyDetails.headquarters && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                {t("CompanyDetails.Headquarters")}
              </h3>
              <p className="text-lg">{companyDetails.headquarters}</p>
            </div>
          )}

          {companyDetails.origin_country && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                {t("CompanyDetails.Country")}
              </h3>
              <p className="text-lg">{companyDetails.origin_country}</p>
            </div>
          )}

          {companyDetails.description && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                {t("CompanyDetails.About")}
              </h3>
              <p className="text-lg leading-relaxed tracking-wide">
                {companyDetails.description}
              </p>
            </div>
          )}

          {companyDetails.homepage && (
            <div className="mt-6">
              <Link
                href={companyDetails.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white
                  rounded-lg transition-colors duration-200"
              >
                <span>{t("CompanyDetails.VisitWebsite")}</span>
                <FaExternalLinkAlt className="h-5 w-5 ms-2" />
              </Link>
            </div>
          )}

          {companyDetails.parent_company && (
            <Link
              href={`/company/${companyDetails.parent_company.id}/${showType}/${nameToSlug(companyDetails.parent_company.name)}?page=1`}
              className="mt-4 block border-t border-gray-800 hover:bg-gray-800 p-4"
            >
              <h3 className="text-lg font-semibold mb-2">
                {t("CompanyDetails.ParentCompany")}
              </h3>
              <div className="flex items-center gap-4">
                {companyDetails.parent_company.logo_path ? (
                  <div className="relative w-24 h-12 rounded">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W200}${companyDetails.parent_company.logo_path}`}
                      alt={companyDetails.parent_company.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div
                    className="w-24 h-12 bg-gray-800 rounded flex items-center justify-center text-gray-400
                      text-xs"
                  >
                    {t("CompanyDetails.NoLogo")}
                  </div>
                )}
                <p className="text-white">
                  {companyDetails.parent_company.name}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
