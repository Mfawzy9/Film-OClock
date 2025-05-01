"use client";
import { useLocale } from "next-intl";

const useIsArabic = () => {
  const locale = useLocale();
  const isArabic = locale === "ar";

  return { isArabic };
};

export default useIsArabic;
