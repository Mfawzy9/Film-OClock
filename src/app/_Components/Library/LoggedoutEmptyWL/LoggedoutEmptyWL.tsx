import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { PiListPlusFill } from "react-icons/pi";

const LoggedoutEmptyWL = () => {
  const t = useTranslations("HomePage");
  return (
    <>
      <div className="flex flex-col items-center justify-start gap-3 px-1">
        <PiListPlusFill className="text-8xl" />

        <div className="flex items-center gap-2 text-center">
          <h1 className="text-xl sm:text-3xl font-semibold">
            {t("WatchlistSection.LoggedOut.title")}
          </h1>
        </div>
        <p className="text-gray-400 text-sm sm:text-base text-center">
          {t("WatchlistSection.LoggedOut.description")}
        </p>
        <Link
          className="px-4 py-2 border border-transparent text-blue-500 bg-black hover:bg-black/50
            hover:border hover:border-blue-500 rounded-full font-semibold transition-colors
            duration-200"
          href={"/auth/login"}
        >
          {t("WatchlistSection.LoggedOut.button")}
        </Link>
      </div>
    </>
  );
};

export default LoggedoutEmptyWL;
