import { useEffect, useMemo, useState } from "react";
import SelectComp from "../SelectComp/SelectComp";
import {
  getTvWatchServers,
  serversNames,
} from "../../../../helpers/watchServers";
import { TvDetailsResponse } from "@/app/interfaces/apiInterfaces/detailsInterfaces";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/Redux/store";

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
  const tServerNames = useTranslations("serversNames");
  const [activeServer, setActiveServer] = useState(() => {
    if (typeof window === "undefined") return serversNames({ tServerNames })[2];

    try {
      const stored = JSON.parse(
        sessionStorage.getItem("activeServer") || "null",
      );
      const currentServers = serversNames({ tServerNames });

      const isValid = currentServers.some(
        (server) => server.query === stored?.query,
      );
      return isValid ? stored : currentServers[2];
    } catch {
      return serversNames({ tServerNames })[2];
    }
  });

  const { isUserInMiddleEast } = useSelector(
    (state: RootState) => state.authReducer,
  );

  //save active server in session storage
  useEffect(() => {
    if (typeof window !== "undefined")
      sessionStorage.setItem("activeServer", JSON.stringify(activeServer));
  }, [activeServer]);

  // Memoize server options to prevent unnecessary re-renders
  const serverOptions = useMemo(
    () => serversNames({ tServerNames }),
    [tServerNames],
  );
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
        loading="eager"
        src={
          getTvWatchServers({
            server: activeServer.name,
            showId,
            season,
            episode,
            isUserInMiddleEast,
            tServerNames,
          })?.url
        }
        allowFullScreen
        width="100%"
        className="aspect-video shadow-blueGlow rounded-md bg-gray-500"
        title={`${tvShow?.name || tvShow?.original_name || "Show"} - Season ${season} Episode ${episode}`}
      />
    </>
  );
};

export default WatchTvPlayer;
