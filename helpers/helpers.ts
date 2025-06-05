import { FirestoreTheShowI } from "@/app/hooks/useLibrary";
import {
  MovieDetailsResponse,
  TvDetailsResponse,
} from "@/app/interfaces/apiInterfaces/detailsInterfaces";
import {
  Movie,
  TVShow,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import { SearchPerson } from "@/app/interfaces/apiInterfaces/searchPersonInterfaces";
import { WatchHistoryItem } from "@/app/interfaces/localInterfaces/watchHistoryInterfaces";
import { toast } from "sonner";

export const minutesToHours = (minutes: number, isArabic: boolean) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return hours > 0
    ? `${hours}${isArabic ? "س" : "h"} ${mins}${isArabic ? "د" : "m"}`
    : `${mins}${isArabic ? "د" : "m"}`;
};
export function minutesToHMS(totalMinutes: number): string {
  // Split into hours, minutes, and seconds
  const totalSeconds = totalMinutes * 60;
  const hours = Math.floor(totalSeconds / 3600);
  const remainingSeconds = totalSeconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = Math.floor(remainingSeconds % 60);

  // HH:MM:SS if hours exist, otherwise MM:SS
  return hours > 0
    ? `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    : `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export const secondsToHMS = (totalSeconds: number): string => {
  const truncatedSeconds = Math.floor(totalSeconds);

  // Calculate hours, minutes, seconds
  const hours = Math.floor(truncatedSeconds / 3600);
  const remainingSeconds = truncatedSeconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = Math.floor(remainingSeconds % 60);

  // Format with leading zeros
  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
};

// getVideoThumbnail for movies and tv videos
export const getVideoThumbnail = (videoKey: string) => {
  return `https://img.youtube.com/vi/${videoKey}/mqdefault.jpg`;
};

export const handleThumbnailError = (
  event: React.SyntheticEvent<HTMLImageElement>,
) => {
  event.currentTarget.src = `https://img.youtube.com/vi/${event.currentTarget.dataset.key}/hqdefault.jpg`;
};

//getVideoDuration
export const getVideoDuration = async (videoKey: string) => {
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoKey}&part=contentDetails&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.items.length > 0) {
      const durationISO = data.items[0].contentDetails.duration;
      return parseYouTubeDuration(durationISO);
    }
  } catch (error) {
    console.error("Error fetching video duration:", error);
  }

  return null;
};

// Convert ISO 8601 duration format (PT3M45S) to "3:45"
export const parseYouTubeDuration = (isoDuration: string) => {
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  const hours = match?.[1] ? parseInt(match[1]) : 0;
  const minutes = match?.[2] ? parseInt(match[2]) : 0;
  const seconds = match?.[3] ? parseInt(match[3]) : 0;

  // Ensure seconds are always two digits
  const formattedSeconds = String(seconds).padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${formattedSeconds}`;
  }

  return `${minutes}:${formattedSeconds}`;
};

// to format the date like this 2021-06-23T15:57:35.053Z
export const formatDate = (
  isoDate: string,
  locale: string = "en-US",
): string => {
  if (!isoDate) return "Invalid date";

  const date = new Date(isoDate);

  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// calculate age
export function calculateAge(
  birthDateString: string,
  isArabic: boolean,
): string {
  const birthDate = new Date(birthDateString);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // Adjust age if the birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  // Format birth date as YYYY/MM/DD
  const formattedBirthDate = `${birthDate.getFullYear()}/${(
    birthDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${birthDate.getDate().toString().padStart(2, "0")}`;

  return `${formattedBirthDate} → (${age} ${isArabic ? "سنة" : "yo"})`;
}

// social links

export const instagramLink = (id: string) => `https://www.instagram.com/${id}/`;
export const twitterLink = (id: string) => `https://x.com/${id}/`;
export const facebookLink = (id: string) => `https://www.facebook.com/${id}/`;
export const tiktokLink = (id: string) => `https://www.tiktok.com/@${id}/`;
export const imdbLink = (id: string, isPerson: boolean) =>
  `https://www.imdb.com/${isPerson ? "name" : "title"}/${id}/`;

// scroll to top
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

// utility function can be reused anywhere to removeDuplicatesById
export const removeDuplicatesById = ({
  items,
}: {
  items: Movie[] | TVShow[] | SearchPerson[] | FirestoreTheShowI[];
}) => {
  return items?.filter((item, index, self) => {
    return self?.findIndex((i) => i.id === item.id) === index;
  });
};

export const nameToSlug = (name: string) =>
  name
    ?.replace(/&/g, "and")
    .replace(/[^\p{L}\d\- ]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();

// handle share movie or tvshow
export function getDetailsShareUrl(
  show: FirestoreTheShowI | WatchHistoryItem | Movie | TVShow,
  showType: string,
  showId: number,
) {
  const locale =
    typeof window !== "undefined"
      ? window.location.pathname.split("/")[1]
      : "en";
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const title =
    (show as Movie).title ||
    (show as Movie).original_title ||
    (show as TVShow).name ||
    (show as TVShow).original_name ||
    (show as FirestoreTheShowI).title ||
    (show as WatchHistoryItem).title ||
    "";

  const slug = nameToSlug(
    getShowTitle({
      show,
      isArabic: locale === "ar",
    }) ?? title,
  );
  return `${origin}/${locale}/details/${showType}/${showId}/${slug}`;
}

export const handleShare = async ({
  theShow,
  showType,
  showId,
  t,
}: {
  theShow: Movie | TVShow | FirestoreTheShowI | WatchHistoryItem;
  showType: "movie" | "tv";
  showId: number;
  t: any;
}) => {
  const shareUrl = getDetailsShareUrl(theShow, showType, showId);
  const title =
    (theShow as Movie).title ||
    (theShow as Movie).original_title ||
    (theShow as TVShow).name ||
    (theShow as TVShow).original_name ||
    (theShow as FirestoreTheShowI | WatchHistoryItem).title ||
    "";

  const text = title ? t("ShareTitle", { title }) : t("Share2Title");

  try {
    if (navigator.share) {
      await navigator.share({
        title,
        text,
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success(t("linkCopied"));
    }
  } catch (error) {
    if (error === "AbortError") {
      toast.error("Failed to share link");
    }
  }
};

// get show title
export const getShowTitle = ({
  isArabic,
  show,
}: {
  isArabic: boolean;
  show:
    | Movie
    | MovieDetailsResponse
    | TVShow
    | TvDetailsResponse
    | FirestoreTheShowI
    | WatchHistoryItem;
}) => {
  return isArabic
    ? (show as Movie)?.original_title ||
        (show as TVShow)?.original_name ||
        (show as FirestoreTheShowI | WatchHistoryItem)?.oriTitle
    : (show as Movie)?.title || (show as TVShow)?.name || null;
};
