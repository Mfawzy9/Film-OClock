"use client";
import { usePathname, useRouter as useNextIntlRouter } from "@/i18n/navigation";
import { useRouter } from "@bprogress/next";
import { FaGlobeAmericas } from "@react-icons/all-files/fa/FaGlobeAmericas";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale: "en" | "ar" = useLocale();
  const router = useRouter({ customRouter: useNextIntlRouter });

  const handleChange = (newLocale: "en" | "ar") => {
    const queryString = searchParams.toString();
    const fullPath = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(fullPath, { locale: newLocale });
  };

  return (
    <button
      onClick={() => handleChange(locale === "en" ? "ar" : "en")}
      className="flex items-center gap-1 bg-gray-800 shadow shadow-gray-500
        lg:hover:shadow-blueGlow transition-all rounded-full px-2 py-1 text-white
        font-semibold"
    >
      <FaGlobeAmericas className="text-lg" />{" "}
      <span>{locale === "en" ? "ع" : "EN"}</span>
    </button>
  );
}
