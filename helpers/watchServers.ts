export const serversNames = [
  {
    query: "server 1 (Continuity feature)",
    name: "server 1 (Continuity feature)",
  },
  {
    query: "server 2 (Continuity feature)",
    name: "server 2 (Continuity feature)",
  },
  {
    query: "server 3 (Continuity feature)",
    name: "server 3 (Continuity feature)",
  },
  {
    query: "server 4 (Continuity feature)",
    name: "server 4 (Continuity feature)",
  },
  {
    query: "server 5 (Continuity feature)",
    name: "server 5 (Continuity feature)",
  },
  { query: "server 6", name: "server 6" },
  { query: "server 7 (Multi)", name: "server 7 (Multi)" },
  { query: "server 8", name: "server 8" },
  {
    query: "server 9 (Continuity feature)",
    name: "server 9 (Continuity feature)",
  },
  { query: "server 10", name: "server 10" },
  { query: "server 11", name: "server 11" },
  { query: "server 12", name: "server 12" },
  {
    query: "server 13 (Continuity feature)",
    name: "server 13 (Continuity feature)",
  },
  { query: "server 14 (Multi)", name: "server 14 (Multi)" },
  { query: "server 15 (Multi)", name: "server 15 (Multi)" },
  { query: "server 16", name: "server 16" },
  { query: "server 17", name: "server 17" },
  { query: "server 18 (Multi)", name: "server 18 (Multi)" },
  { query: "server 19", name: "server 19" },
  { query: "server 20", name: "server 20" },
  { query: "server 21", name: "server 21" },
  { query: "server 22", name: "server 22" },
  {
    query: "server 23 (Continuity feature)",
    name: "server 23 (Continuity feature)",
  },
  {
    query: "server 24 (Continuity feature)",
    name: "server 24 (Continuity feature)",
  },
  {
    query: "server 25 (Multi)",
    name: "server 25 (Multi)",
  },
  {
    query: "server 26 (Continuity feature)",
    name: "server 26 (Continuity feature)",
  },
  {
    query: "server 27 (Continuity feature)",
    name: "server 27 (Continuity feature)",
  },
];

interface TvWatchServers {
  server: string;
  showId: number;
  season: number;
  episode: number;
}

// tvShow watch servers
export const getTvWatchServers = ({
  server,
  showId,
  season,
  episode,
}: TvWatchServers) => {
  const watchServers = [
    {
      id: 1,
      name: "server 1 (Continuity feature)",
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_1_URL}/${showId}/${season}/${episode}?autoplay=false`,
    },
    {
      id: 2,
      name: "server 2 (Continuity feature)",
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_2_URL}/${showId}/${season}/${episode}?autoplay=false`,
    },
    {
      id: 3,
      name: "server 3 (Continuity feature)",
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_3_URL}?tmdb=${showId}&season=${season}&episode=${episode}`,
    },
    {
      id: 4,
      name: "server 4 (Continuity feature)",
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_4_URL}/${showId}/${season}/${episode}?autoPlay=false`,
    },
    {
      id: 5,
      name: "server 5 (Continuity feature)",
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_5_URL}/${showId}-${season}-${episode}?autoplay=false`,
    },
    {
      id: 6,
      name: "server 6",
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_6_URL}/${showId}/${season}/${episode}?autoplay=false`,
    },
    {
      id: 7,
      name: "server 7 (Multi)",
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_7_URL}/?video_id=${showId}&tmdb=1&s=${season}&e=${episode}`,
      multi: true,
    },
    {
      id: 8,
      name: "server 8",
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_8_URL}?tmdb=${showId}&sea=${season}&epi=${episode}`,
    },
    {
      id: 9,
      name: "server 9 (Continuity feature)",
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_9_URL}/?id=${showId}&s=${season}&e=${episode}&autoplay=false`,
    },
    {
      id: 10,
      name: "server 10",
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_10_URL}/${showId}/${season}/${episode}`,
    },
    {
      id: 11,
      name: "server 11",
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_11_URL}/${showId}?s=${season}&e=${episode}`,
    },
    {
      id: 12,
      name: "server 12",
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_12_URL}?tmdb=${showId}&season=${season}&episode=${episode}`,
    },
    {
      id: 13,
      name: "server 13 (Continuity feature)",
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_13_URL}/${showId}/${season}/${episode}?autoPlay=false`,
    },
    {
      id: 14,
      name: "server 14 (Multi)",
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_14_URL}/${showId}?s=${season}&e=${episode}`,
      multi: true,
    },
    {
      id: 15,
      name: "server 15 (Multi)",
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_15_URL}?tmdb=${showId}&season=${season}&episode=${episode}&autoplay=false`,
      multi: true,
    },
    {
      id: 16,
      name: "server 16",
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_16_URL}/${showId}-${season}-${episode}?autoplay=false`,
    },
    {
      id: 17,
      name: "server 17",
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_17_URL}/?id=${showId}&s=${season}&e=${episode}&autoplay=false`,
    },
    {
      id: 18,
      name: "server 18 (Multi)",
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_18_URL}/?id=${showId}&s=${season}&e=${episode}&autoplay=false`,
      multi: true,
    },
    {
      id: 19,
      name: "server 19",
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_19_URL}/?id=${showId}&s=${season}&e=${episode}&autoplay=false`,
    },
    {
      id: 20,
      name: "server 20",
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_20_URL}/?id=${showId}&s=${season}&e=${episode}&autoplay=false`,
    },
    {
      id: 21,
      name: "server 21",
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_21_URL}/${showId}/${season}/${episode}`,
    },
    {
      id: 22,
      name: "server 22",
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_22_URL}?tmdb=${showId}&season=${season}&episode=${episode}`,
    },
    {
      id: 23,
      name: "server 23 (Continuity feature)",
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_23_URL}/${showId}/${season}/${episode}?autoplay=false`,
    },
    {
      id: 24,
      name: "server 24 (Continuity feature)",
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_24_URL}/${showId}/${season}/${episode}`,
    },
    {
      id: 25,
      name: "server 25 (Multi)",
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_25_URL}/${showId}/${season}/${episode}`,
    },
    {
      id: 26,
      name: "server 26 (Continuity feature)",
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_26_URL}/${showId}/${season}/${episode}`,
    },
    {
      id: 27,
      name: "server 27 (Continuity feature)",
      url: `${process.env.NEXT_PUBLIC_TV_SERVER_27_URL}/${showId}/${season}/${episode}`,
    },
  ];
  return watchServers.find((_server) => _server.name === server);
};

interface MovieWatchServers {
  server: string;
  showId: number;
}

// movies watch servers-------------------------------------------------------------------------------------------------
export const getMovieWatchServers = ({ server, showId }: MovieWatchServers) => {
  const watchServers = [
    {
      id: 1,
      name: "server 1 (Continuity feature)",
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_1_URL}/${showId}?autoplay=false`,
    },
    {
      id: 2,
      name: "server 2 (Continuity feature)",
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_2_URL}/${showId}?autoplay=false`,
    },
    {
      id: 3,
      name: "server 3 (Continuity feature)",
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_3_URL}?tmdb=${showId}`,
    },
    {
      id: 4,
      name: "server 4 (Continuity feature)",
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_4_URL}/${showId}?autoPlay=false`,
    },
    {
      id: 5,
      name: "server 5 (Continuity feature)",
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_5_URL}/${showId}`,
    },
    {
      id: 6,
      name: "server 6",
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_6_URL}/${showId}`,
    },
    {
      id: 7,
      name: "server 7 (Multi)",
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_7_URL}/?video_id=${showId}&tmdb=1`,
      multi: true,
    },
    {
      id: 8,
      name: "server 8",
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_8_URL}/${showId}`,
    },
    {
      id: 9,
      name: "server 9 (Continuity feature)",
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_9_URL}/?id=${showId}&autoplay=false`,
    },
    {
      id: 10,
      name: "server 10",
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_10_URL}/${showId}`,
    },
    {
      id: 11,
      name: "server 11",
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_11_URL}/${showId}`,
    },
    {
      id: 12,
      name: "server 12",
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_12_URL}/${showId}`,
    },
    {
      id: 13,
      name: "server 13 (Continuity feature)",
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_13_URL}/${showId}?autoPlay=false`,
    },
    {
      id: 14,
      name: "server 14 (Multi)",
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_14_URL}/${showId}`,
      multi: true,
    },
    {
      id: 15,
      name: "server 15 (Multi)",
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_15_URL}?tmdb=${showId}&autoplay=false`,
      multi: true,
    },
    {
      id: 16,
      name: "server 16",
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_16_URL}/${showId}?autoplay=false`,
    },
    {
      id: 17,
      name: "server 17",
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_17_URL}/?id=${showId}&autoplay=false`,
    },
    {
      id: 18,
      name: "server 18 (Multi)",
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_18_URL}/?id=${showId}&autoplay=false`,
      multi: true,
    },
    {
      id: 19,
      name: "server 19",
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_19_URL}/?id=${showId}&autoplay=false`,
    },
    {
      id: 20,
      name: "server 20",
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_20_URL}/?id=${showId}&autoplay=false`,
    },
    {
      id: 21,
      name: "server 21",
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_21_URL}/${showId}`,
    },
    {
      id: 22,
      name: "server 22",
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_22_URL}?tmdb=${showId}&i=1`,
    },
    {
      id: 23,
      name: "server 23 (Continuity feature)",
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_23_URL}/${showId}`,
    },
    {
      id: 24,
      name: "server 24 (Continuity feature)",
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_24_URL}/${showId}`,
    },
    {
      id: 25,
      name: "server 25 (Multi)",
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_25_URL}/${showId}`,
    },
    {
      id: 26,
      name: "server 26 (Continuity feature)",
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_26_URL}/${showId}?autoPlay=false`,
    },
    {
      id: 27,
      name: "server 27 (Continuity feature)",
      url: `${process.env.NEXT_PUBLIC_MOVIE_SERVER_27_URL}/${showId}?autoPlay=false`,
    },
  ];
  return watchServers.find((_server) => _server.name === server);
};
