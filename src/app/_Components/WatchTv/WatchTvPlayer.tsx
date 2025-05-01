import { useMemo, useState } from "react";
import SelectComp from "../SelectComp/SelectComp";
import {
  getTvWatchServers,
  serversNames,
} from "../../../../helpers/watchServers";
import { TvDetailsResponse } from "@/app/interfaces/apiInterfaces/detailsInterfaces";
import { useTranslations } from "next-intl";

interface WatchTvPlayerProps {
  showId: number;
  tvShow: TvDetailsResponse;
  season: number;
  episode: number;
  disableButtons: boolean;
  totalEpisodes: number;
}

const WatchTvPlayer = ({
  showId,
  tvShow,
  season,
  episode,
}: WatchTvPlayerProps) => {
  const t = useTranslations("WatchTv");
  const [activeServer, setActiveServer] = useState(serversNames[0]);

  // Memoize server options to prevent unnecessary re-renders
  const serverOptions = useMemo(() => serversNames, []);
  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-yellow-300 text-lg underline font-sans">
          {t("ServersWarning")}
        </p>
        <SelectComp
          items={serverOptions}
          setActiveSelect={setActiveServer}
          activeSelect={activeServer}
          label={t("Servers")}
        />
      </div>

      <iframe
        loading="lazy"
        src={
          getTvWatchServers({
            server: activeServer.name,
            showId,
            season,
            episode,
          })?.url
        }
        allowFullScreen
        width="100%"
        className="aspect-video shadow-blueGlow rounded-md bg-gray-500"
        title={`${tvShow?.original_name || "Show"} - Season ${season} Episode ${episode}`}
      />
    </>
  );
};

export default WatchTvPlayer;
