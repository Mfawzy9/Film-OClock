import { useState, useMemo, useEffect, useCallback } from "react";
import SelectComp from "../SelectComp/SelectComp";
import { useGetTvSeasonDetailsQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import {
  Episode,
  TvSeasonDetailsResponse,
} from "@/app/interfaces/apiInterfaces/tvSeasonsDetailsInterfaces";
import EpisodeModal from "./EpisodeModal";
import EpisodeCard from "../EpisodeCard/EpisodeCard";
import { useTranslations } from "next-intl";
import { TVShow } from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import dynamic from "next/dynamic";

const EpisodesSkeletons = dynamic(() => import("./EpisodesSkeletons"));

interface TvEpisodesProps {
  seasonsCount: number;
  tvShowId: number;
  onWatchClick?: () => void;
  tvShowName: string;
  tvShow: TVShow;
}

const EPISODES_PER_PAGE = 4;

const TvEpisodes = ({
  seasonsCount,
  tvShowId,
  onWatchClick,
  tvShowName,
  tvShow,
}: TvEpisodesProps) => {
  const t = useTranslations("TvDetails");
  const [seasonNumber, setSeasonNumber] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode>(
    {} as Episode,
  );
  const [visibleEpisodes, setVisibleEpisodes] = useState(EPISODES_PER_PAGE);

  const {
    data: tvSeasonDetails,
    isLoading,
    isFetching,
  } = useGetTvSeasonDetailsQuery(
    { seasonNumber, tvShowId },
    { skip: !tvShowId },
  ) as {
    data: TvSeasonDetailsResponse;
    isLoading: boolean;
    isFetching: boolean;
  };

  // Reset visible episodes when season changes
  useEffect(() => {
    setVisibleEpisodes(EPISODES_PER_PAGE);
  }, [seasonNumber]);

  const items = useMemo(() => {
    return seasonsCount
      ? Array.from({ length: seasonsCount }, (_, index) => ({
          query: `${t("Tabs.TheSeason")} ${index + 1}`,
          name: `${t("Tabs.TheSeason")} ${index + 1}`,
        }))
      : [];
  }, [seasonsCount, t]);

  const [activeSelect, setActiveSelect] = useState({
    query: `${t("Tabs.TheSeason")} 1`,
    name: `${t("Tabs.TheSeason")} 1`,
  });

  useEffect(() => {
    if (items.length > 0) {
      setActiveSelect({ query: items[0].query, name: items[0].name });
    }
  }, [items]);

  const openModal = useCallback((episode: Episode) => {
    setSelectedEpisode(episode);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const loadMoreEpisodes = () => {
    setVisibleEpisodes((prev) => prev + EPISODES_PER_PAGE);
  };

  if (isLoading || !tvSeasonDetails || isFetching) {
    return <EpisodesSkeletons />;
  }

  const episodesToShow =
    tvSeasonDetails?.episodes?.slice(0, visibleEpisodes) || [];
  const canLoadMore = tvSeasonDetails?.episodes?.length > visibleEpisodes;

  return (
    <>
      <SelectComp
        setSeasonNumber={setSeasonNumber}
        activeSelect={activeSelect}
        setActiveSelect={setActiveSelect}
        items={items}
        label={`${tvSeasonDetails?.episodes.length || 0} ${t("Tabs.Episodes")}`}
      />

      <main className="pt-8">
        {tvSeasonDetails?.episodes.length === 0 ? (
          <p className="text-center text-2xl font-bold">No Episodes Found</p>
        ) : (
          <>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-y-20 gap-x-4
                mt-8 place-items-center"
            >
              {episodesToShow.map((episode) => {
                return (
                  <EpisodeCard
                    tvShow={tvShow}
                    tvShowName={tvShowName}
                    episodeId={episode.id}
                    showId={tvShowId}
                    seasonNumber={seasonNumber}
                    key={episode.id}
                    img={
                      episode.still_path
                        ? `${process.env.NEXT_PUBLIC_BASE_IMG_URL_W500}/${episode.still_path}`
                        : ""
                    }
                    title={episode.name}
                    description={episode.overview}
                    episodeNumber={episode.episode_number}
                    onReadMore={() => openModal(episode)}
                    onWatchClick={onWatchClick}
                  />
                );
              })}
            </div>

            {canLoadMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={loadMoreEpisodes}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  {t("Tabs.LoadMoreEpisodes")}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal for episode details */}
      <EpisodeModal
        tvShow={tvShow}
        tvShowName={tvShowName}
        episodeId={selectedEpisode?.id || 0}
        showId={tvShowId}
        seasonNumber={seasonNumber}
        episodeNumber={selectedEpisode?.episode_number || 1}
        isOpen={isModalOpen}
        onClose={closeModal}
        episode={selectedEpisode}
        onWatchClick={onWatchClick}
      />
    </>
  );
};

export default TvEpisodes;
