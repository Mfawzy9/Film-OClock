"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { IoClose } from "@react-icons/all-files/io5/IoClose";

const TEN_DAYS_MS = 1000 * 60 * 60 * 24 * 10;

const EXTENSIONS = {
  chrome: [
    {
      name: "uBlock Origin Lite",
      url: "https://chrome.google.com/webstore/detail/ublock-origin-lite/ddkjiahejlhfcafbddmgiahcphecmpfh",
    },
    {
      name: "Adblock Plus",
      url: "https://chrome.google.com/webstore/detail/adblock-plus-free-ad-bloc/cfhdojbkjhnklbpkdaibdccddilifddb",
    },
  ],
  firefox: [
    {
      name: "uBlock Origin",
      url: "https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/",
    },
    {
      name: "Adblock Plus",
      url: "https://addons.mozilla.org/en-US/firefox/addon/adblock-plus/",
    },
  ],
  edge: [
    {
      name: "uBlock Origin",
      url: "https://microsoftedge.microsoft.com/addons/detail/ublock-origin/odfafepnkmbhccpbejgmiehpchacaeak",
    },
    {
      name: "Adblock",
      url: "https://microsoftedge.microsoft.com/addons/detail/adblock-%E2%80%94-block-ads-acros/ndcileolkflehcjpmjnfbnaibdcgglog",
    },
  ],
  android: [
    {
      name: "Brave Browser",
      url: "https://play.google.com/store/apps/details?id=com.brave.browser",
    },
    {
      name: "Firefox with uBlock",
      url: "https://play.google.com/store/apps/details?id=org.mozilla.firefox",
    },
  ],
  ios: [
    {
      name: "Brave Browser",
      url: "https://apps.apple.com/app/brave-private-web-browser/id1052879175",
    },
    {
      name: "Firefox Focus",
      url: "https://apps.apple.com/app/firefox-focus-privacy-browser/id1055677337",
    },
  ],
};

const Section = ({
  titleKey,
  tipsKey,
  list,
}: {
  titleKey: string;
  tipsKey: string;
  list: { name: string; url: string }[];
}) => {
  const t = useTranslations("adsModal");

  return (
    <div className="bg-gray-800/50 px-4 py-0.5">
      <h3 className="font-semibold">{t(titleKey as "title")}</h3>
      <p>{t(tipsKey as "description")}</p>
      <ul className="list-disc ms-5">
        {list.map((ext) => (
          <li key={ext.name}>
            <a
              href={ext.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {ext.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const AdsModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("adsModal");

  useEffect(() => {
    const lastShown = localStorage.getItem("adsModalLastShown");
    const now = Date.now();

    if (!lastShown || now - Number(lastShown) > TEN_DAYS_MS) {
      setIsOpen(true);
      localStorage.setItem("adsModalLastShown", String(now));
    }
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center xs:px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.2 } }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-md border border-gray-700 px-1 py-2 max-w-lg
              w-full shadow-lg overflow-y-auto max-h-[92vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col mb-4 flex-wrap">
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-800 dark:hover:text-white text-3xl flex-none w-fit"
                aria-label="Close"
              >
                <IoClose />
              </button>
              <h2 className="text-xl font-bold text-center">{t("title")}</h2>
            </div>

            <p className="mb-4 text-center text-sm text-gray-700 dark:text-gray-300 px-2">
              {t("description")}
            </p>

            <div className="space-y-3 text-sm max-h-[400px] overflow-y-auto">
              {Object.entries(EXTENSIONS).map(([key, value]) => {
                return (
                  <Section
                    key={key}
                    titleKey={key}
                    tipsKey={`${key}Tips`}
                    list={value}
                  />
                );
              })}
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="ms-auto block mt-4 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700
                transition duration-200 text-sm"
            >
              {t("gotIt")}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdsModal;
