"use client";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { GrLanguage } from "react-icons/gr";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale: "en" | "ar" = useLocale();

  const handleChange = (newLocale: "en" | "ar") => {
    const queryString = searchParams.toString();
    const fullPath = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(fullPath, { locale: newLocale });
  };

  return (
    <button
      onClick={() => handleChange(locale === "en" ? "ar" : "en")}
      className="flex items-center gap-1 font-roboto bg-gray-800 shadow shadow-gray-500
        hover:shadow-gray-500/50 hover:scale-95 transition-all rounded-full px-2 py-1
        text-white"
    >
      <GrLanguage /> <span>{locale === "en" ? "ع" : "EN"}</span>
    </button>
  );
}
