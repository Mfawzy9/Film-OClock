"use client";

import tmdbApi from "@/lib/Redux/apiSlices/tmdbSlice";
import store from "@/lib/Redux/store";
import { useEffect } from "react";

// endpoints type
type TmdbEndpoints = typeof tmdbApi.endpoints;

// endpoints keys
type TmdbEndpointsKeys = keyof TmdbEndpoints;
export interface PreloadedQuery {
  endpointName: TmdbEndpointsKeys;
  args: any;
  data: any;
}

export const RTKPreloader = ({
  preloadedQueries,
}: {
  preloadedQueries: PreloadedQuery[];
}) => {
  useEffect(() => {
    for (const { endpointName, args, data } of preloadedQueries) {
      const endpoint = tmdbApi.endpoints[endpointName].name;

      if (endpoint) {
        store.dispatch(
          tmdbApi.util.upsertQueryData(endpoint as any, args, data),
        );
      }
    }
  }, [preloadedQueries]);

  return null;
};
