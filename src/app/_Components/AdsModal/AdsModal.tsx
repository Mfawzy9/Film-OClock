"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { IoClose } from "@react-icons/all-files/io5/IoClose";

const extensions = {
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

const AdsModal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("adsModal");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [ref]);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("hasSeenAdsModal");
    if (!hasSeenModal) {
      setIsOpen(true);
      localStorage.setItem("hasSeenAdsModal", "true");
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
        >
          <div
            ref={ref}
            className="bg-white dark:bg-gray-900 rounded-md border border-gray-700 px-1 py-2 max-w-lg
              w-full shadow-lg scroll-hidden overflow-y-auto max-h-[92vh] relative"
          >
            <div className="flex flex-col mb-4 flex-wrap">
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-800 dark:hover:text-white text-3xl flex-none w-fit"
                aria-label="Close"
              >
                <IoClose />
              </button>
              <h2 className="text-xl font-bold text-center">
                {t("title")}
              </h2>{" "}
            </div>

            <p className="mb-4 text-center text-sm text-gray-700 dark:text-gray-300 px-2">
              {t("description")}
            </p>

            <div className="space-y-3 text-sm max-h-[400px] overflow-y-auto custom-scrollbar">
              <div className="bg-gray-800/50 px-4 py-0.5">
                <h3 className="font-semibold">{t("chrome")}</h3>
                <p>{t("chromeTips")}</p>
                <ul className="list-disc ms-5">
                  {extensions.chrome.map((ext) => (
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

              <div className="bg-gray-800/50 px-4 py-0.5">
                <h3 className="font-semibold">{t("firefox")}</h3>
                <p>{t("firefoxTips")}</p>
                <ul className="list-disc ms-5">
                  {extensions.firefox.map((ext) => (
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

              <div className="bg-gray-800/50 px-4 py-0.5">
                <h3 className="font-semibold">{t("edge")}</h3>
                <p>{t("edgeTips")}</p>
                <ul className="list-disc ms-5">
                  {extensions.edge.map((ext) => (
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

              <div className="bg-gray-800/50 px-4 py-0.5">
                <h3 className="font-semibold">{t("android")}</h3>
                <p>{t("androidTips")}</p>
                <ul className="list-disc ms-5">
                  {extensions.android.map((ext) => (
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

              <div className="bg-gray-800/50 px-4 py-0.5">
                <h3 className="font-semibold">{t("ios")}</h3>
                <p>{t("iosTips")}</p>
                <ul className="list-disc ms-5">
                  {extensions.ios.map((ext) => (
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
