"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import bg from "../../../../public/images/footer-bg.webp";
import Image from "next/image";
import { FaRegCopyright } from "@react-icons/all-files/fa/FaRegCopyright";
import { RiMovie2Fill } from "@react-icons/all-files/ri/RiMovie2Fill";

const Footer = () => {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-gray-600">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={bg}
          alt="Footer background"
          fill
          className="object-cover"
          quality={80}
          placeholder="blur"
          sizes="100vw"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative max-w-screen-xl mx-auto px-6 py-8 lg:px-4">
        {/* Grid layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 place-content-around">
          {/* About Section */}
          <div className="group col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div
                className="flex items-center justify-center transform group-hover:rotate-45 transition
                  duration-500"
              >
                <RiMovie2Fill className="text-4xl text-blue-700" />
              </div>
              <h2
                className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400
                  to-blue-500"
              >
                {"FilmO'Clock"}
              </h2>
            </Link>
            <p className="text-gray-300 text-sm 3xl:text-base">
              {t("description1")}
              <br />
              <br />
              {t("description2")}
            </p>
          </div>

          {/* Explore Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-white">
              {t("exploreTitle")}
            </h3>
            <div className="flex flex-col gap-2 text-gray-400 text-sm">
              <Link
                href="/shows/explore/movie"
                className="hover:text-white transition-all hover:ps-1 duration-200"
              >
                {t("movies")}
              </Link>
              <Link
                href="/shows/explore/tv"
                className="hover:text-white transition-all hover:ps-1 duration-200"
              >
                {t("tvShows")}
              </Link>
              <Link
                href="/people/Popular"
                className="hover:text-white transition-all hover:ps-1 duration-200"
              >
                {t("celebs")}
              </Link>
              <Link
                href="/movies/Upcoming?page=1"
                className="hover:text-white transition-all hover:ps-1 duration-200"
              >
                {t("upcoming")}
              </Link>
              <Link
                href="/shows/genres/movie?page=1"
                className="hover:text-white transition-all hover:ps-1 duration-200"
              >
                {t("genres")}
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-white">
              {t("quickLinksTitle")}
            </h3>
            <div className="flex flex-col gap-2 text-gray-400 text-sm">
              <Link
                href="/tvShows/OnTheAir?page=1"
                className="hover:text-white transition-all hover:ps-1 duration-200"
              >
                {t("onTheAir")}
              </Link>
              <Link
                href="/shows/all/movie?page=1&sortBy=vote_count.desc"
                className="hover:text-white transition-all hover:ps-1 duration-200"
              >
                {t("bestMovies")}
              </Link>
              <Link
                href="/shows/all/tv?page=1&sortBy=vote_count.desc"
                className="hover:text-white transition-all hover:ps-1 duration-200"
              >
                {t("bestTvShows")}
              </Link>
              <Link
                href="/movies/NowPlaying?page=1"
                className="hover:text-white transition-all hover:ps-1 duration-200"
              >
                {t("nowPlaying")}
              </Link>
              <Link
                href="/shows/trending/movie?page=1"
                className="hover:text-white transition-all hover:ps-1 duration-200"
              >
                {t("trending")}
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div
          className="mt-10 pt-8 border-t border-gray-600 flex flex-col md:flex-row justify-between
            xs:px-8 md:px-12 items-center"
        >
          <p className="text-gray-400 text-xs text-center md:text-left mb-4 md:mb-0">
            {t("poweredBy")}{" "}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              TMDB
            </a>
          </p>
          <p
            className="text-gray-400 text-xs text-center md:text-right flex items-center justify-center
              flex-wrap gap-[2px]"
          >
            {t("madeWith")} <span className="text-red-500">❤</span> {t("by")}{" "}
            <a
              href="https://portfolio-one-xi.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 font-bold hover:underline"
            >
              {t("myName")}
            </a>{" "}
            • <span className="text-blue-400">{t("LogoName")}</span>{" "}
            <span className="flex gap-1 items-center">
              <FaRegCopyright />
              {year}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
