"use client";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const ComingSoon = () => {
  const t = useTranslations("ComingSoon");
  return (
    <div
      className="h-screen flex flex-col items-center justify-center gap-4 bg-gray-950 fixed
        inset-0 z-50"
    >
      <span className="text-4xl">⏳</span>
      <h2 className="text-xl font-bold text-blue-500">{t("title")}</h2>
      <p className="text-lg font-medium text-gray-300">{t("description")}</p>

      <Link
        href="/"
        className="px-6 py-2 bg-blue-500/20 rounded-lg hover:bg-blue-500/30 transition-colors
          text-blue-400"
      >
        {t("continue")}
      </Link>
    </div>
  );
};

export default ComingSoon;
