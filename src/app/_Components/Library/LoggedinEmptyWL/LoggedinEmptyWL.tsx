import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { PiListPlusFill } from "react-icons/pi";

const LoggedinEmptyWL = () => {
  const t = useTranslations("HomePage");
  return (
    <>
      <div className="flex flex-col items-center justify-start gap-3">
        <PiListPlusFill className="text-8xl" />

        <div className="flex items-center gap-2 text-center">
          <h1 className="text-3xl font-semibold">
            {t("WatchlistSection.LoggedIn.title")}
          </h1>
        </div>
        <p className="text-gray-400 text-center">
          {t("WatchlistSection.LoggedIn.description")}
        </p>
        <Link
          className="px-4 py-2 border border-transparent text-blue-500 bg-black hover:bg-black/50
            hover:border hover:border-blue-500 rounded-full font-semibold transition-colors
            duration-200"
          href={"/shows/explore/movie"}
        >
          {t("WatchlistSection.LoggedIn.button")}
        </Link>
      </div>
    </>
  );
};

export default LoggedinEmptyWL;
