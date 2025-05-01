// app/api/tmdb/route.ts
import { NextRequest } from "next/server";

const API_KEY = process.env.TMDB_API_KEY;
const ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const tmdbPath = searchParams.get("path"); // ex: discover/movie
  if (!tmdbPath) {
    return new Response("Missing TMDB path", { status: 400 });
  }

  const params = new URLSearchParams(searchParams);
  params.delete("path");
  params.set("api_key", API_KEY); // Inject api_key server-side

  const tmdbUrl = `${BASE_URL}${tmdbPath}?${params.toString()}`;

  const response = await fetch(tmdbUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json;charset=utf-8",
    },
    next: { revalidate: 3600, tags: [`tmdb-${tmdbPath}`] },
  });

  const data = await response.json();
  return Response.json(data);
}
