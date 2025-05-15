import PageSection from "../../PageSection/PageSection";
import { Link } from "@/i18n/navigation";
import { BsBookmarkPlus } from "@react-icons/all-files/bs/BsBookmarkPlus";
import { useTranslations } from "next-intl";

const EmptyFav = () => {
  const t = useTranslations("Library.Favourites");
  return (
    <PageSection className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center justify-start gap-3">
        <BsBookmarkPlus className="text-8xl" />

        <div className="flex items-center gap-2 text-center">
          <h1 className="text-3xl font-semibold">
            {t("EmptyFavourites.title")}
          </h1>
        </div>
        <p className="text-gray-400 text-center">
          {t("EmptyFavourites.description")}
        </p>
        <Link
          className="text-blue-500 hover:underline"
          href={"/shows/explore/movie"}
        >
          {t("EmptyFavourites.MoviesBtn")}
        </Link>
        <Link
          className="text-blue-500 hover:underline"
          href={"/shows/explore/tv"}
        >
          {t("EmptyFavourites.TvShowsBtn")}
        </Link>
      </div>
    </PageSection>
  );
};

export default EmptyFav;
