import { headers } from "next/headers";

export const getBaseUrl = async () => {
  const headersStore = await headers();
  const host = headersStore.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  return `${protocol}://${host}`;
};

export const siteBaseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://film-oclock.vercel.app";
