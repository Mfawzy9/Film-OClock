import useLibrary from "@/app/hooks/useLibrary";
import useWatchedList from "@/app/hooks/useWatchedList";
import { UserMenuLinksI } from "@/app/interfaces/localInterfaces/userMenuLinksI";
import {
  Link,
  usePathname,
  useRouter as useNextIntlRouter,
} from "@/i18n/navigation";
import { signOutUser } from "@/lib/firebase/authService";
import { User } from "@/lib/Redux/localSlices/authSlice";
import { useRouter } from "@bprogress/next/app";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { memo, useMemo } from "react";
import {
  FaClipboardList,
  FaEnvelope,
  FaHeart,
  FaUser,
  FaUserCog,
  FaUserPlus,
} from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
import { VscSignIn, VscSignOut } from "react-icons/vsc";

interface UserMenuProps {
  setUserMenu: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  handleLinkClick: (e: React.MouseEvent, href: string) => void;
}

const Badge = ({ count }: { count: number }) => (
  <div
    className="absolute inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold
      text-white bg-red-500 border border-white rounded-full -top-1 start-0
      dark:border-gray-900"
  >
    {count}
  </div>
);

const UserMenu = ({ setUserMenu, user, handleLinkClick }: UserMenuProps) => {
  const pathname = usePathname();
  const router = useRouter({ customRouter: useNextIntlRouter });
  const { favorites, watchlist } = useLibrary({ dropDownMenu: false });
  const { watchedShows } = useWatchedList({});
  const t = useTranslations("Navbar.UserMenu");

  const menuLinks = useMemo(() => {
    const baseLinks: UserMenuLinksI[] = [
      {
        name: t("Favorites"),
        href: "/library/favorites",
        icon: <FaHeart className="text-xl" />,
        badge: true,
        show: !!user,
      },
      {
        name: t("Watchlist"),
        href: "/library/watchlist",
        icon: <FaClipboardList className="text-xl" />,
        badge: true,
        show: !!user,
      },
      {
        name: t("WatchedShows"),
        href: "/watchedShows",
        icon: <FaEye className="text-xl" />,
        badge: true,
        show: !!user,
      },
      {
        name: t("Login"),
        href: "/auth/login",
        icon: <VscSignIn className="text-xl" />,
        show: !user,
      },
      {
        name: t("Register"),
        href: "/auth/signup",
        icon: <FaUserPlus className="text-xl" />,
        show: !user,
      },
      {
        name: t("Profile"),
        href: "/profile",
        icon: <FaUserCog className="text-xl" />,
        show: !!user,
      },
    ];

    return baseLinks.filter((link) => link.show);
  }, [t, user]);

  const handleLogout = () => {
    const protectedPaths = ["watchlist", "favorite", "profile", "watchedShows"];
    if (protectedPaths.some((path) => pathname.includes(path))) {
      router.push("/");
    }
    signOutUser(t);
    setUserMenu(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute z-20 top-10 end-0 bg-black/90 shadow shadow-blue-700 text-white
        min-w-10 rounded-md px-1 origin-top-right"
    >
      {user && (
        <div className="space-y-1 px-3 pt-4">
          {user.displayName && (
            <h6 className="flex items-center gap-2 whitespace-nowrap">
              <FaUser /> {user.displayName}
            </h6>
          )}
          {user.email && (
            <h6 className="flex items-center gap-2 whitespace-nowrap border-b border-gray-600 pb-2">
              <FaEnvelope /> {user.email}
            </h6>
          )}
        </div>
      )}

      <ul className="flex flex-col gap-2 p-1">
        {menuLinks.map(({ name, href, icon, badge }) => (
          <li key={name}>
            <Link
              href={href}
              onClick={(e) => {
                setUserMenu(false);
                handleLinkClick(e, href);
              }}
              className={`flex relative items-center gap-2 acc-link px-4 py-1 transition-all duration-200
              whitespace-nowrap ${pathname === href ? "bg-blue-700 rounded" : ""}`}
            >
              {badge && (
                <>
                  {name === t("Watchlist") && watchlist.length > 0 && (
                    <Badge count={watchlist.length} />
                  )}
                  {name === t("Favorites") && favorites.length > 0 && (
                    <Badge count={favorites.length} />
                  )}
                  {name === t("WatchedShows") && watchedShows.length > 0 && (
                    <Badge count={watchedShows.length} />
                  )}
                </>
              )}
              {icon}
              {name}
            </Link>
          </li>
        ))}

        {user && (
          <li>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-1 hover:text-white transition-all duration-300 flex items-center
                gap-1 hover:bg-red-800 hover:shadow-[0_0_10px_#9b1c1c]"
            >
              <VscSignOut className="text-xl" /> {t("Logout")}
            </button>
          </li>
        )}
      </ul>
    </motion.div>
  );
};

export default memo(UserMenu);
