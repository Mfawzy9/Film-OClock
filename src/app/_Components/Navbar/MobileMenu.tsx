import { AnimatePresence, motion, Variants } from "framer-motion";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { NavbarlinksI } from "./Navbar";
import { MdArrowDropDown } from "react-icons/md";
import { Link, usePathname } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguagesSwitcher";

const topVariants: Variants = {
  opened: { rotate: 45 },
  closed: { rotate: 0 },
};

const midVariants: Variants = {
  opened: { opacity: 0 },
  closed: { opacity: 1 },
};

const botVariants: Variants = {
  opened: { rotate: -45 },
  closed: { rotate: 0 },
};

const listVariants: Variants = {
  closed: { x: "100vw" },
  opened: {
    x: 0,
    transition: { when: "beforeChildren", staggerChildren: 0.2 },
  },
  exit: { x: "100vw" },
};

const linksVariants: Variants = {
  closed: { opacity: 0, x: -10 },
  opened: { opacity: 1, x: 0 },
};

const MobileMenu = ({
  links,
  isArabic,
}: {
  links: NavbarlinksI[];
  isArabic: boolean;
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const pathname = usePathname();
  const currentPath = pathname.split("?")[0]; // pathname without query parameters

  const handleTvAndMoviesMenu = useCallback((type: string) => {
    setActiveSubmenu((prev) => (prev === type ? null : type));
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setActiveSubmenu(null);
  }, []);

  const handleLinkClick = useCallback(
    (e: React.MouseEvent, href: string) => {
      if (pathname === href.split("?")[0]) {
        e.preventDefault();
        closeMobileMenu();
      }
      closeMobileMenu();
    },
    [pathname, closeMobileMenu],
  );

  // Memoize rendered links to avoid recalculation on every render
  const renderedLinks = useMemo(() => {
    return links.map((link) => {
      const isActive =
        currentPath.startsWith(link.href.split("?")[0]) ||
        (link.children?.some((child) =>
          currentPath.startsWith(child.href.split("?")[0]),
        ) ??
          false);
      const hasChildren = !!link.children;
      const isSubmenuOpen = activeSubmenu === link.name.toLowerCase();

      if (hasChildren) {
        return (
          <motion.li
            variants={linksVariants}
            key={link.name}
            className={`relative group ${isActive ? "text-blue-700" : ""} `}
            onClick={() => handleTvAndMoviesMenu(link.name.toLowerCase())}
          >
            <span className="flex items-center justify-center gap-1 cursor-pointer">
              {link.name}
              <MdArrowDropDown
                className={`${isSubmenuOpen ? "rotate-180" : ""} transition-all duration-200 text-lg`}
              />
            </span>

            <ul
              className={`${isSubmenuOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"}
                transition-all duration-200 flex flex-col items-center gap-2 px-2 rounded
                overflow-hidden text-white border-b border-gray-600`}
            >
              {link.children &&
                link.children.map((child) => (
                  <li
                    key={child.name}
                    className={`text-base text-gray-300 transition-all duration-200 hover:bg-blue-700
                    hover:text-white rounded px-2 py-1
                    ${currentPath === child.href.split("?")[0] ? "bg-blue-700 rounded" : ""}
                    cursor-pointer`}
                  >
                    <Link
                      href={child.href}
                      className=""
                      onClick={(e) => handleLinkClick(e, child.href)}
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </motion.li>
        );
      }

      return (
        <motion.li variants={linksVariants} key={link.name}>
          <Link
            onClick={(e) => handleLinkClick(e, link.href)}
            className={pathname === link.href ? "text-blue-700" : ""}
            href={link.href}
          >
            {link.name}
          </Link>
        </motion.li>
      );
    });
  }, [
    links,
    pathname,
    activeSubmenu,
    handleTvAndMoviesMenu,
    handleLinkClick,
    currentPath,
  ]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.ul
            variants={listVariants}
            initial="closed"
            animate="opened"
            exit="exit"
            className={`flex flex-col justify-center items-center gap-6 lg:hidden fixed z-30 inset-0
            bg-gray-950/95 text-white text-3xl ${isArabic ? "font-cairo" : "font-righteous"}
            overflow-y-auto`}
          >
            {renderedLinks}
          </motion.ul>
        )}
      </AnimatePresence>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="absolute z-40 top-4 start-4 text-base md:hidden"
        >
          <LanguageSwitcher />
        </motion.div>
      )}

      <button
        onClick={() => {
          setIsMobileMenuOpen((prev) => !prev);
          setActiveSubmenu(null);
        }}
        className="h-6 w-8 flex flex-col justify-between relative z-40 lg:hidden"
      >
        <motion.div
          variants={topVariants}
          animate={isMobileMenuOpen ? "opened" : "closed"}
          className="w-8 h-1 bg-white rounded origin-left"
        />
        <motion.div
          variants={midVariants}
          animate={isMobileMenuOpen ? "opened" : "closed"}
          className="w-8 h-1 bg-white rounded"
        />
        <motion.div
          variants={botVariants}
          animate={isMobileMenuOpen ? "opened" : "closed"}
          className="w-8 h-1 bg-white rounded origin-left"
        />
      </button>
    </>
  );
};

export default memo(MobileMenu);
