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
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_1_URL}/${showId}/${season}/${episode}?autoplay=false`,
    },
    {
      id: 2,
      name: tServerNames("server2"),
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_2_URL}/${showId}/${season}/${episode}?autoplay=false`,
    },
    {
      id: 3,
      name: tServerNames("server3"),
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_3_URL}?tmdb=${showId}&season=${season}&episode=${episode}&ds_lang=${isUserInMiddleEast ? "ar" : "en"}`,
    },
    {
      id: 4,
      name: tServerNames("server4"),
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_4_URL}/${showId}/${season}/${episode}?autoPlay=false`,
    },
    {
      id: 5,
      name: tServerNames("server5"),
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_5_URL}/${showId}-${season}-${episode}?autoplay=false`,
    },
    {
      id: 6,
      name: tServerNames("server6"),
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_6_URL}/${showId}/${season}/${episode}?autoplay=false`,
    },
    {
      id: 7,
      name: tServerNames("server7"),
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_7_URL}/?video_id=${showId}&tmdb=1&s=${season}&e=${episode}`,
      multi: true,
    },
    {
      id: 8,
      name: tServerNames("server8"),
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_8_URL}?tmdb=${showId}&sea=${season}&epi=${episode}`,
    },
    {
      id: 9,
      name: tServerNames("server9"),
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_9_URL}/?id=${showId}&s=${season}&e=${episode}&autoplay=false`,
    },
    {
      id: 10,
      name: tServerNames("server10"),
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_10_URL}/${showId}/${season}/${episode}`,
    },
    {
      id: 11,
      name: tServerNames("server11"),
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_11_URL}/${showId}?s=${season}&e=${episode}`,
    },
    {
      id: 12,
      name: tServerNames("server12"),
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_12_URL}?tmdb=${showId}&season=${season}&episode=${episode}&ds_lang=${isUserInMiddleEast ? "ar" : "en"}`,
    },
    {
      id: 13,
      name: tServerNames("server13"),
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_13_URL}/${showId}/${season}/${episode}?autoPlay=false`,
    },
    {
      id: 14,
      name: tServerNames("server14"),
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_14_URL}?tmdb=${showId}&season=${season}&episode=${episode}&autoplay=false`,
      multi: true,
    },
    {
      id: 15,
      name: tServerNames("server15"),
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_15_URL}/${showId}-${season}-${episode}?autoplay=false`,
    },
    {
      id: 16,
      name: tServerNames("server16"),
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_16_URL}/?id=${showId}&s=${season}&e=${episode}&autoplay=false`,
    },
    {
      id: 17,
      name: tServerNames("server17"),
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_17_URL}/?id=${showId}&s=${season}&e=${episode}&autoplay=false`,
      multi: true,
    },
    {
      id: 18,
      name: tServerNames("server18"),
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_18_URL}/?id=${showId}&s=${season}&e=${episode}&autoplay=false`,
    },
    {
      id: 19,
      name: tServerNames("server19"),
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_19_URL}/?id=${showId}&s=${season}&e=${episode}&autoplay=false`,
    },
    {
      id: 20,
      name: tServerNames("server20"),
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_20_URL}/${showId}/${season}/${episode}`,
    },
    {
      id: 21,
      name: tServerNames("server21"),
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_21_URL}?tmdb=${showId}&season=${season}&episode=${episode}`,
    },
    {
      id: 22,
      name: tServerNames("server22"),
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_22_URL}/${showId}/${season}/${episode}?autoplay=false`,
    },
    {
      id: 23,
      name: tServerNames("server23"),
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_23_URL}/${showId}/${season}/${episode}`,
    },
    {
      id: 24,
      name: tServerNames("server24"),
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_24_URL}/${showId}/${season}/${episode}`,
    },
    {
      id: 25,
      name: tServerNames("server25"),
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_25_URL}/${showId}/${season}/${episode}`,
    },
    {
      id: 26,
      name: tServerNames("server26"),
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_26_URL}/${showId}/${season}/${episode}`,
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
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_1_URL}/${showId}?autoplay=false`,
    },
    {
      id: 2,
      name: tServerNames("server2"),
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_2_URL}/${showId}?autoplay=false`,
    },
    {
      id: 3,
      name: tServerNames("server3"),
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_3_URL}?tmdb=${showId}&ds_lang=${isUserInMiddleEast ? "ar" : "en"}`,
    },
    {
      id: 4,
      name: tServerNames("server4"),
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_4_URL}/${showId}?autoPlay=false`,
    },
    {
      id: 5,
      name: tServerNames("server5"),
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_5_URL}/${showId}`,
    },
    {
      id: 6,
      name: tServerNames("server6"),
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_6_URL}/${showId}`,
    },
    {
      id: 7,
      name: tServerNames("server7"),
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_7_URL}/?video_id=${showId}&tmdb=1`,
      multi: true,
    },
    {
      id: 8,
      name: tServerNames("server8"),
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_8_URL}/${showId}`,
    },
    {
      id: 9,
      name: tServerNames("server9"),
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_9_URL}/?id=${showId}&autoplay=false`,
    },
    {
      id: 10,
      name: tServerNames("server10"),
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_10_URL}/${showId}`,
    },
    {
      id: 11,
      name: tServerNames("server11"),
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_11_URL}/${showId}`,
    },
    {
      id: 12,
      name: tServerNames("server12"),
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_12_URL}/${showId}?ds_lang=${isUserInMiddleEast ? "ar" : "en"}`,
    },
    {
      id: 13,
      name: tServerNames("server13"),
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_13_URL}/${showId}?autoPlay=false`,
    },
    {
      id: 14,
      name: tServerNames("server14"),
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_14_URL}?tmdb=${showId}&autoplay=false`,
      multi: true,
    },
    {
      id: 15,
      name: tServerNames("server15"),
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_15_URL}/${showId}?autoplay=false`,
    },
    {
      id: 16,
      name: tServerNames("server16"),
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_16_URL}/?id=${showId}&autoplay=false`,
    },
    {
      id: 17,
      name: tServerNames("server17"),
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_17_URL}/?id=${showId}&autoplay=false`,
      multi: true,
    },
    {
      id: 18,
      name: tServerNames("server18"),
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_18_URL}/?id=${showId}&autoplay=false`,
    },
    {
      id: 19,
      name: tServerNames("server19"),
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_19_URL}/?id=${showId}&autoplay=false`,
    },
    {
      id: 20,
      name: tServerNames("server20"),
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_20_URL}/${showId}`,
    },
    {
      id: 21,
      name: tServerNames("server21"),
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_21_URL}?tmdb=${showId}&i=1`,
    },
    {
      id: 22,
      name: tServerNames("server22"),
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_22_URL}/${showId}`,
    },
    {
      id: 23,
      name: tServerNames("server23"),
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_23_URL}/${showId}`,
    },
    {
      id: 24,
      name: tServerNames("server24"),
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_24_URL}/${showId}`,
    },
    {
      id: 25,
      name: tServerNames("server25"),
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_25_URL}/${showId}?autoPlay=false`,
    },
    {
      id: 26,
      name: tServerNames("server26"),
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_26_URL}/${showId}?autoPlay=false`,
    },
  ];
  return watchServers.find((_server) => _server.name === server);
};
