import Title from "../../Title/Title";
import { useTranslations } from "next-intl";
import WlFClearBtn from "./WlFClearBtn";

interface TitleClearBtnProps {
  handleClearLibrary: (data: {
    libraryType: "watchlist" | "favorites";
  }) => Promise<void>;
  libraryType: "watchlist" | "favorites";
  isClearLoading: boolean;
  watchlistLength?: number;
  favoritesLength?: number;
}

const TitleClearBtn = ({
  handleClearLibrary,
  libraryType,
  isClearLoading,
  watchlistLength,
  favoritesLength,
}: TitleClearBtnProps) => {
  const t = useTranslations("Library");
  const title =
    libraryType === "watchlist"
      ? `${t("Watchlist.title")} (${watchlistLength})`
      : `${t("Favourites.title")} (${favoritesLength})`;
  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mb-10">
      <div
        className="italic animate-pulse w-fit relative after:content-[''] after:animate-bounce
          after:absolute after:-bottom-1 after:start-0 after:w-14 lg:after:h-1
          after:bg-blue-800"
      >
        <Title title={title} />
      </div>
      <WlFClearBtn
        handleClearLibrary={handleClearLibrary}
        libraryType={libraryType}
        isClearLoading={isClearLoading}
      />
    </div>
  );
};

export default TitleClearBtn;
