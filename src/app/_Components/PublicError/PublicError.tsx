"use client";
import { useTranslations } from "next-intl";

const PublicError = () => {
  const t = useTranslations("ErrorPage");
  return (
    <div
      className="h-screen flex flex-col items-center justify-center gap-4 bg-gray-950 fixed
        inset-0 z-50"
    >
      <span className="text-4xl">⚠️</span>
      <h2 className="text-xl font-bold text-red-500">
        {t("SomethingWentWrong")}
      </h2>
      <p className="text-lg font-medium text-gray-300">
        {t("FailedToLoadTheData")}
      </p>

      <button
        onClick={() =>
          caches
            .keys()
            .then((keys) => {
              return Promise.all(keys.map((key) => caches.delete(key)));
            })
            .finally(() => window.location.reload())
        }
        className="px-6 py-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors
          text-red-400"
      >
        {t("TryAgain")}
      </button>
    </div>
  );
};

export default PublicError;
