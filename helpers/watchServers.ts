import { TFunction } from "../global";

export const serversNames = ({ tServerNames }: { tServerNames: TFunction }) => [
  {
    query: tServerNames("server1"),
    name: tServerNames("server1"),
  },
  {
    query: tServerNames("server2"),
    name: tServerNames("server2"),
  },
  {
    query: tServerNames("server3"),
    name: tServerNames("server3"),
  },
  {
    query: tServerNames("server4"),
    name: tServerNames("server4"),
  },
  {
    query: tServerNames("server5"),
    name: tServerNames("server5"),
  },
  { query: tServerNames("server6"), name: tServerNames("server6") },
  { query: tServerNames("server7"), name: tServerNames("server7") },
  { query: tServerNames("server8"), name: tServerNames("server8") },
  {
    query: tServerNames("server9"),
    name: tServerNames("server9"),
  },
  { query: tServerNames("server10"), name: tServerNames("server10") },
  { query: tServerNames("server11"), name: tServerNames("server11") },
  { query: tServerNames("server12"), name: tServerNames("server12") },
  {
    query: tServerNames("server13"),
    name: tServerNames("server13"),
  },
  { query: tServerNames("server14"), name: tServerNames("server14") },
  { query: tServerNames("server15"), name: tServerNames("server15") },
  { query: tServerNames("server16"), name: tServerNames("server16") },
  { query: tServerNames("server17"), name: tServerNames("server17") },
  { query: tServerNames("server18"), name: tServerNames("server18") },
  { query: tServerNames("server19"), name: tServerNames("server19") },
  { query: tServerNames("server20"), name: tServerNames("server20") },
  { query: tServerNames("server21"), name: tServerNames("server21") },
  {
    query: tServerNames("server22"),
    name: tServerNames("server22"),
  },
  {
    query: tServerNames("server23"),
    name: tServerNames("server23"),
  },
  {
    query: tServerNames("server24"),
    name: tServerNames("server24"),
  },
  {
    query: tServerNames("server25"),
    name: tServerNames("server25"),
  },
  {
    query: tServerNames("server26"),
    name: tServerNames("server26"),
  },
];

interface TvWatchServers {
  server: string;
  showId: number;
  season: number;
  episode: number;
  isUserInMiddleEast: boolean;
  tServerNames: any;
}

// tvShow watch servers
export const getTvWatchServers = ({
  server,
  showId,
  season,
  episode,
  isUserInMiddleEast,
  tServerNames,
}: TvWatchServers) => {
  const watchServers = [
    {
      id: 1,
      name: tServerNames("server1"),
      url: `https://vidlink.pro/tv/${showId}/${season}/${episode}?autoplay=false`,
    },
    {
      id: 2,
      name: tServerNames("server2"),
      url: `https://embed.su/embed/tv/${showId}/${season}/${episode}?autoplay=false`,
    },
    {
      id: 3,
      name: tServerNames("server3"),
      url: `https://vidsrc.xyz/embed/tv?tmdb=${showId}&season=${season}&episode=${episode}&ds_lang=${isUserInMiddleEast ? "ar" : "en"}`,
    },
    {
      id: 4,
      name: tServerNames("server4"),
      url: `https://vidsrc.cc/v3/embed/tv/${showId}/${season}/${episode}?autoPlay=false`,
    },
    {
      id: 5,
      name: tServerNames("server5"),
      url: `https://moviesapi.club/tv/${showId}-${season}-${episode}?autoplay=false`,
    },
    {
      id: 6,
      name: tServerNames("server6"),
      url: `https://player.autoembed.cc/embed/tv/${showId}/${season}/${episode}?autoplay=false`,
    },
    {
      id: 7,
      name: tServerNames("server7"),
      url: `https://multiembed.mov/?video_id=${showId}&tmdb=1&s=${season}&e=${episode}`,
      multi: true,
    },
    {
      id: 8,
      name: tServerNames("server8"),
      url: `https://filmku.stream/embed/series?tmdb=${showId}&sea=${season}&epi=${episode}`,
    },
    {
      id: 9,
      name: tServerNames("server9"),
      url: `https://vidsrc.wtf/api/1/tv/?id=${showId}&s=${season}&e=${episode}&autoplay=false`,
    },
    {
      id: 10,
      name: tServerNames("server10"),
      url: `https://111movies.com/tv/${showId}/${season}/${episode}`,
    },
    {
      id: 11,
      name: tServerNames("server11"),
      url: `https://player.smashy.stream/tv/${showId}?s=${season}&e=${episode}`,
    },
    {
      id: 12,
      name: tServerNames("server12"),
      url: `https://vidsrc.me/embed/tv?tmdb=${showId}&season=${season}&episode=${episode}&ds_lang=${isUserInMiddleEast ? "ar" : "en"}`,
    },
    {
      id: 13,
      name: tServerNames("server13"),
      url: `https://vidsrc.cc/v2/embed/tv/${showId}/${season}/${episode}?autoPlay=false`,
    },
    {
      id: 14,
      name: tServerNames("server14"),
      url: `https://www.primewire.tf/embed/tv?tmdb=${showId}&season=${season}&episode=${episode}&autoplay=false`,
      multi: true,
    },
    {
      id: 15,
      name: tServerNames("server15"),
      url: `https://autoembed.co/tv/tmdb/${showId}-${season}-${episode}?autoplay=false`,
    },
    {
      id: 16,
      name: tServerNames("server16"),
      url: `https://vidsrc.wtf/api/2/tv/?id=${showId}&s=${season}&e=${episode}&autoplay=false`,
    },
    {
      id: 17,
      name: tServerNames("server17"),
      url: `https://vidsrc.wtf/api/3/tv/?id=${showId}&s=${season}&e=${episode}&autoplay=false`,
      multi: true,
    },
    {
      id: 18,
      name: tServerNames("server18"),
      url: `https://vidsrc.wtf/api/4/tv/?id=${showId}&s=${season}&e=${episode}&autoplay=false`,
    },
    {
      id: 19,
      name: tServerNames("server19"),
      url: `https://vidsrc.wtf/api/5/tv/?id=${showId}&s=${season}&e=${episode}&autoplay=false`,
    },
    {
      id: 20,
      name: tServerNames("server20"),
      url: `https://anyembed.xyz/tv/${showId}/${season}/${episode}`,
    },
    {
      id: 21,
      name: tServerNames("server21"),
      url: `https://tommy0412.great-site.net/embed1/embed_tv.php?tmdb=${showId}&season=${season}&episode=${episode}`,
    },
    {
      id: 22,
      name: tServerNames("server22"),
      url: `https://vidjoy.pro/embed/tv/${showId}/${season}/${episode}?autoplay=false`,
    },
    {
      id: 23,
      name: tServerNames("server23"),
      url: `https://player.videasy.net/tv/${showId}/${season}/${episode}`,
    },
    {
      id: 24,
      name: tServerNames("server24"),
      url: `https://www.NontonGo.win/embed/tv/${showId}/${season}/${episode}`,
    },
    {
      id: 25,
      name: tServerNames("server25"),
      url: `https://vidfast.pro/tv/${showId}/${season}/${episode}`,
    },
    {
      id: 26,
      name: tServerNames("server26"),
      url: `https://vidsrc.vip/embed/tv/${showId}/${season}/${episode}`,
    },
  ];
  return watchServers.find((_server) => _server.name === server);
};

interface MovieWatchServers {
  server: string;
  showId: number;
  isUserInMiddleEast: boolean;
  tServerNames: any;
}

// movies watch servers-------------------------------------------------------------------------------------------------
export const getMovieWatchServers = ({
  server,
  showId,
  isUserInMiddleEast,
  tServerNames,
}: MovieWatchServers) => {
  const watchServers = [
    {
      id: 1,
      name: tServerNames("server1"),
      url: `https://vidlink.pro/movie/${showId}?autoplay=false`,
    },
    {
      id: 2,
      name: tServerNames("server2"),
      url: `https://embed.su/embed/movie/${showId}?autoplay=false`,
    },
    {
      id: 3,
      name: tServerNames("server3"),
      url: `https://vidsrc.xyz/embed/movie?tmdb=${showId}&ds_lang=${isUserInMiddleEast ? "ar" : "en"}`,
    },
    {
      id: 4,
      name: tServerNames("server4"),
      url: `https://vidsrc.cc/v3/embed/movie/${showId}?autoPlay=false`,
    },
    {
      id: 5,
      name: tServerNames("server5"),
      url: `https://moviesapi.club/movie/${showId}`,
    },
    {
      id: 6,
      name: tServerNames("server6"),
      url: `https://player.autoembed.cc/embed/movie/${showId}`,
    },
    {
      id: 7,
      name: tServerNames("server7"),
      url: `https://multiembed.mov/?video_id=${showId}&tmdb=1`,
      multi: true,
    },
    {
      id: 8,
      name: tServerNames("server8"),
      url: `https://filmku.stream/embed/${showId}`,
    },
    {
      id: 9,
      name: tServerNames("server9"),
      url: `https://vidsrc.wtf/api/1/movie/?id=${showId}&autoplay=false`,
    },
    {
      id: 10,
      name: tServerNames("server10"),
      url: `https://111movies.com/movie/${showId}`,
    },
    {
      id: 11,
      name: tServerNames("server11"),
      url: `https://player.smashy.stream/movie/${showId}`,
    },
    {
      id: 12,
      name: tServerNames("server12"),
      url: `https://vidsrc.me/embed/movie/${showId}?ds_lang=${isUserInMiddleEast ? "ar" : "en"}`,
    },
    {
      id: 13,
      name: tServerNames("server13"),
      url: `https://vidsrc.cc/v2/embed/movie/${showId}?autoPlay=false`,
    },
    {
      id: 14,
      name: tServerNames("server14"),
      url: `https://www.primewire.tf/embed/movie?tmdb=${showId}&autoplay=false`,
      multi: true,
    },
    {
      id: 15,
      name: tServerNames("server15"),
      url: `https://autoembed.co/movie/tmdb/${showId}?autoplay=false`,
    },
    {
      id: 16,
      name: tServerNames("server16"),
      url: `https://vidsrc.wtf/api/2/movie/?id=${showId}&autoplay=false`,
    },
    {
      id: 17,
      name: tServerNames("server17"),
      url: `https://vidsrc.wtf/api/3/movie/?id=${showId}&autoplay=false`,
      multi: true,
    },
    {
      id: 18,
      name: tServerNames("server18"),
      url: `https://vidsrc.wtf/api/4/movie/?id=${showId}&autoplay=false`,
    },
    {
      id: 19,
      name: tServerNames("server19"),
      url: `https://vidsrc.wtf/api/5/movie/?id=${showId}&autoplay=false`,
    },
    {
      id: 20,
      name: tServerNames("server20"),
      url: `https://anyembed.xyz/movie/${showId}`,
    },
    {
      id: 21,
      name: tServerNames("server21"),
      url: `https://tommy0412.great-site.net/embed1/embed_movie.php?tmdb=${showId}&i=1`,
    },
    {
      id: 22,
      name: tServerNames("server22"),
      url: `https://vidjoy.pro/embed/movie/${showId}`,
    },
    {
      id: 23,
      name: tServerNames("server23"),
      url: `https://player.videasy.net/movie/${showId}`,
    },
    {
      id: 24,
      name: tServerNames("server24"),
      url: `https://www.NontonGo.win/embed/movie/${showId}`,
    },
    {
      id: 25,
      name: tServerNames("server25"),
      url: `https://vidfast.pro/movie/${showId}?autoPlay=false`,
    },
    {
      id: 26,
      name: tServerNames("server26"),
      url: `https://vidsrc.vip/embed/movie/${showId}?autoPlay=false`,
    },
  ];
  return watchServers.find((_server) => _server.name === server);
};
