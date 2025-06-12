import {
  MovieReviewsResponse,
  TvReviewsResponse,
} from "@/app/interfaces/apiInterfaces/reviewsInterfaces";
import { formatDate } from "../../../../helpers/helpers";
import Image from "next/image";
import { memo, useMemo } from "react";
import { useTranslations } from "next-intl";

const Reviews = ({
  reviews,
  isArabic,
}: {
  reviews: MovieReviewsResponse | TvReviewsResponse;
  isArabic: boolean;
}) => {
  const t = useTranslations("MovieDetails");
  // to get the reviews with avatar as first
  const sortedReviews = useMemo(() => {
    return [...(reviews?.results || [])].sort((a, b) =>
      b.author_details.avatar_path ? 1 : -1,
    );
  }, [reviews?.results]);

  return (
    <>
      {!reviews || reviews.results.length === 0 ? (
        <p className="text-center text-2xl font-bold">
          {t("Tabs.NoReviewsFound")}
        </p>
      ) : (
        <>
          {sortedReviews.map((review) => (
            <div
              key={review.id}
              className="relative w-full h-auto my-5 rounded-xl bg-black shadow shadow-blue-700 flex
                flex-col items-start gap-3 p-5"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center rounded-full bg-blue-800 h-12 w-12 relative
                    overflow-hidden"
                >
                  {review.author_details.avatar_path ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W500}${review.author_details.avatar_path}`}
                      fill
                      sizes="100%"
                      alt={review.author}
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold">
                      {review?.author.charAt(0).toUpperCase() ||
                        review?.author_details.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="relative flex flex-col">
                  <p className="font-bold text-xl">
                    {review.author || review.author_details.username}
                  </p>
                  <p className="text-stone-400 text-sm">
                    {formatDate(review.created_at, isArabic ? "ar" : "en")}
                  </p>
                </span>
              </div>
              <p className="leading-relaxed tracking-wide">{review.content}</p>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default memo(Reviews);
