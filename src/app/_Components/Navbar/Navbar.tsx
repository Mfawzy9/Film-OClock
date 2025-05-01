"use client";

import { memo, useCallback, useEffect, useState, useMemo } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { RiMovie2Fill } from "react-icons/ri";
import { MdArrowDropDown } from "react-icons/md";
import { motion, useScroll } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/Redux/store";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";
import SearchBox from "../SearchBox/SearchBox";
import LanguageSwitcher from "./LanguagesSwitcher";
import useIsArabic from "@/app/hooks/useIsArabic";
import Image from "next/image";

export interface NavbarlinksI {
  name: string;
  href: string;
  children?: { name: string; href: string }[];
}

const Navbar = () => {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const [userMenu, setUserMenu] = useState(false);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useSelector((state: RootState) => state.authReducer);
  const { isArabic } = useIsArabic();
  const t = useTranslations("Navbar");

  const links = useMemo(
    () => [
      {
        name: t("Home"),
        href: "/",
      },
      {
        name: t("Movies.Movies"),
        href: "/Movies",
        children: [
          { name: t("Movies.Explore"), href: "/shows/explore/movie" },
          { name: t("Movies.AllMovies"), href: "/shows/all/movie?page=1" },
          { name: t("Movies.Trending"), href: "/shows/trending/movie?page=1" },
          { name: t("Movies.Genres"), href: "/shows/genres/movie?page=1" },
          { name: t("Movies.NowPlaying"), href: "/movies/NowPlaying?page=1" },
          { name: t("Movies.Popular"), href: "/shows/popular/movie?page=1" },
          { name: t("Movies.TopRated"), href: "/shows/topRated/movie?page=1" },
          { name: t("Movies.Upcoming"), href: "/movies/Upcoming?page=1" },
        ],
      },
      {
        name: t("TvShows.TvShows"),
        href: "/TvShows",
        children: [
          { name: t("TvShows.Explore"), href: "/shows/explore/tv" },
          { name: t("TvShows.AllTvShows"), href: "/shows/all/tv?page=1" },
          { name: t("TvShows.Trending"), href: "/shows/trending/tv?page=1" },
          { name: t("TvShows.Genres"), href: "/shows/genres/tv?page=1" },
          {
            name: t("TvShows.AiringToday"),
            href: "/tvShows/AiringToday?page=1",
          },
          { name: t("TvShows.OnTheAir"), href: "/tvShows/OnTheAir?page=1" },
          { name: t("TvShows.Popular"), href: "/shows/popular/tv?page=1" },
          { name: t("TvShows.TopRated"), href: "/shows/topRated/tv?page=1" },
        ],
      },
      {
        name: t("Celebs.Celebs"),
        href: "/People",
        children: [
          { name: t("Celebs.Popular"), href: "/people/Popular" },
          { name: t("Celebs.Trending"), href: "/people/Trending?page=1" },
        ],
      },
    ],
    [t],
  );

  // Scroll handler with debounce
  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 75);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const toggleUserMenu = useCallback(() => {
    setUserMenu((prev) => !prev);
  }, []);

  const handleLinkClick = useCallback(
    (e: React.MouseEvent, href: string) => {
      if (pathname === href.split("?")[0]) {
        e.preventDefault();
      }
    },
    [pathname],
  );

  // Auth check with cleanup
  useEffect(() => {
    let mounted = true;
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (mounted) {
        setIsLoading(false);
      }
    };
    checkAuth();
    return () => {
      mounted = false;
    };
  }, [user]);

  // Memoized user initial
  const userInitial = useMemo(() => {
    if (user?.photoURL) {
      return (
        <Image src={user.photoURL} width={40} height={40} alt="user-image" />
      );
    }
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return null;
  }, [user]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? "bg-black/90 py-1 shadow-sm shadow-blue-700"
          : "py-4 xs:py-6"
        }`}
    >
      <nav className="py-2 flex items-center justify-between px-2 xl:container lg:px-6 relative">
        {/* Logo */}
        <Link
          onClick={(e) => handleLinkClick(e, "/")}
          href="/"
          className="flex items-center gap-1"
          aria-label="Home"
        >
          <RiMovie2Fill className="text-3xl text-blue-700" />
          <h1 className="font-bold text-xl xs:text-2xl">
            {t("LogoOne")}
            <span className="text-blue-700">{t("LogoTwo")}</span>{" "}
          </h1>
        </Link>

        {/* Search */}
        <SearchBox />

        {/* Desktop Navigation */}
        <ul
          className={`items-center hidden lg:flex gap-3 lg:gap-5 xl:gap-8 text-lg
            ${isArabic ? "font-cairo" : "font-righteous"} lg:text-xl`}
        >
          {links.map((link) => (
            <NavLink
              key={link.name}
              link={link}
              pathname={pathname}
              handleLinkClick={handleLinkClick}
            />
          ))}
        </ul>

        <div className="flex items-center gap-2 pe-1">
          {/* Language Switcher */}
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          {/* User Icon */}
          {!isLoading && (
            <div className="relative sm:ms-auto md:ms-0 flex items-center">
              <button
                onClick={toggleUserMenu}
                className="w-9 h-9"
                aria-label="User menu"
              >
                {userInitial ? (
                  <span
                    className="w-full h-full flex items-center justify-center text-white bg-blue-700
                      hover:bg-blue-600 rounded-full overflow-hidden"
                  >
                    {userInitial}
                  </span>
                ) : (
                  <FaCircleUser className="w-full h-full" />
                )}
              </button>

              {/* User Menu Dropdown */}
              {userMenu && (
                <>
                  <div
                    className="fixed top-0 left-0 w-full h-full z-20 bg-black/20"
                    onClick={toggleUserMenu}
                  />
                  <UserMenu
                    setUserMenu={setUserMenu}
                    user={user}
                    handleLinkClick={handleLinkClick}
                  />
                </>
              )}
            </div>
          )}

          {/* Mobile Menu */}
          <MobileMenu links={links} isArabic={isArabic} />
        </div>
      </nav>
    </header>
  );
};

const NavLink = memo(
  ({
    link,
    pathname,
    handleLinkClick,
  }: {
    link: NavbarlinksI;
    pathname: string;
    handleLinkClick: (e: React.MouseEvent, href: string) => void;
  }) => {
    const currentPath = pathname.split("?")[0]; // pathname without query parameters

    const isActive =
      currentPath.startsWith(link.href.split("?")[0]) ||
      (link.children?.some((child) =>
        currentPath.startsWith(child.href.split("?")[0]),
      ) ??
        false);

    if (link.children) {
      return (
        <li
          className={`relative group ${isActive ? "text-white" : "hover:text-white text-blue-200"}`}
        >
          {isActive && (
            <motion.span
              layoutId="underline"
              className="absolute -bottom-1 left-0 w-full h-1 bg-blue-700"
            />
          )}
          <span className="flex items-center">
            {link.name}
            <MdArrowDropDown className="group-hover:rotate-180 transition-all duration-200 text-xs xl:text-sm" />
          </span>
          <div
            className="-top-4 group-hover:top-full absolute py-3 rounded opacity-0
              group-hover:opacity-100 transition-all duration-200 pointer-events-none
              group-hover:pointer-events-auto"
          >
            <ul
              className="flex flex-col gap-2 w-[200px] bg-black/85 px-2 py-2 shadow shadow-blue-700
                rounded"
            >
              {link.children.map((child) => (
                <li
                  key={child.name}
                  className={`text-base
                  ${currentPath === child.href.split("?")[0] ? "bg-blue-700 rounded" : ""}`}
                >
                  <Link
                    onClick={(e) => handleLinkClick(e, child.href)}
                    href={child.href}
                    className="px-2 py-1 transition-all duration-200 hover:bg-blue-700 block rounded"
                  >
                    {child.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </li>
      );
    }

    return (
      <motion.li
        className={`${
          currentPath === link.href.split("?")[0]
            ? "text-white"
            : "hover:text-white text-blue-200"
          } relative `}
      >
        {currentPath === link.href.split("?")[0] && (
          <motion.span
            layoutId="underline"
            className="absolute -bottom-1 left-0 w-full h-1 bg-blue-700"
          />
        )}
        <Link
          onClick={(e) => handleLinkClick(e, link.href)}
          href={link.href}
          className="transition-all duration-200 after:content-[''] after:absolute after:-bottom-1
            after:origin-center after:left-0 after:w-0 after:h-1 after:bg-blue-700
            after:transition-all after:duration-200 hover:after:w-full"
        >
          {link.name}
        </Link>
      </motion.li>
    );
  },
);

NavLink.displayName = "NavLink";

export default memo(Navbar);
