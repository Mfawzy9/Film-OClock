import { Link } from "@/i18n/navigation";
import { BsBookmarksFill } from "@react-icons/all-files/bs/BsBookmarksFill";
import { useTranslations } from "next-intl";

const LoggedinEmptyWL = () => {
  const t = useTranslations("HomePage");
  return (
    <>
      <div className="flex flex-col items-center justify-start gap-3 md:gap-6 px-2">
        <BsBookmarksFill className="text-8xl" />

        <div className="flex items-center gap-2 text-center">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
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
