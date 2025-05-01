import { BsClipboardPlus } from "react-icons/bs";
import PageSection from "../../PageSection/PageSection";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "use-intl";

const EmptyWl = () => {
  const t = useTranslations("Library.Watchlist");
  return (
    <PageSection>
      <div className="flex flex-col items-center justify-start gap-3">
        <BsClipboardPlus className="text-8xl" />

        <div className="flex items-center gap-2 text-center">
          <h1 className="text-3xl font-semibold">
            {t("EmptyWatchlist.title")}
          </h1>
        </div>
        <p className="text-gray-400 text-center">
          {t("EmptyWatchlist.description")}
        </p>
        <Link
          className="text-blue-500 hover:underline"
          href={"/shows/explore/movie"}
        >
          {t("EmptyWatchlist.MoviesBtn")}
        </Link>
        <Link
          className="text-blue-500 hover:underline"
          href={"/shows/explore/tv"}
        >
          {t("EmptyWatchlist.TvShowsBtn")}
        </Link>
      </div>
    </PageSection>
  );
};

export default EmptyWl;
