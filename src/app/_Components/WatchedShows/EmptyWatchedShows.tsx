import { Link } from "@/i18n/navigation";
import { useTranslations } from "use-intl";
import PageSection from "../PageSection/PageSection";
import { FaEyeSlash } from "@react-icons/all-files/fa/FaEyeSlash";

const EmptyWatchedShows = () => {
  const t = useTranslations("Library.WatchedList");
  return (
    <PageSection className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center justify-start gap-3">
        <FaEyeSlash className="text-8xl" />

        <div className="flex items-center gap-2 text-center">
          <h1 className="text-3xl font-semibold">
            {t("EmptyWatchedList.title")}
          </h1>
        </div>
        <p className="text-gray-400 text-center">
          {t("EmptyWatchedList.description")}
        </p>
        <Link
          className="text-blue-500 hover:underline"
          href={"/shows/explore/movie"}
        >
          {t("EmptyWatchedList.MoviesBtn")}
        </Link>
        <Link
          className="text-blue-500 hover:underline"
          href={"/shows/explore/tv"}
        >
          {t("EmptyWatchedList.TvShowsBtn")}
        </Link>
      </div>
    </PageSection>
  );
};

export default EmptyWatchedShows;
