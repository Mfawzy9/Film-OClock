"use client";
import { JSX, memo, useCallback } from "react";
import { motion } from "motion/react";

interface Tab {
  name: string;
  icon: JSX.Element;
  content: JSX.Element;
}

export interface TabsProps {
  tabs: Tab[];
  setActiveTab: (tabName: string) => void;
  activeTab: string;
}

const Tabs = ({ tabs, setActiveTab, activeTab }: TabsProps) => {
  const handleTabClick = useCallback(
    (tabName: string) => {
      if (activeTab !== tabName) {
        setActiveTab(tabName);
      }
    },
    [activeTab, setActiveTab],
  );

  return (
    <>
      {/* Tabs */}
      <main
        className="mt-5 flex flex-wrap gap-3 lg:max-w-screen-xl mx-auto justify-center
          bg-gradient-to-t from-blue-700/15 via-black to-blue-700/35 sm:text-lg
          font-semibold rounded shadow-sm shadow-gray-600"
      >
        {tabs.map((tab, idx) => (
          <motion.button
            key={idx}
            onClick={() => handleTabClick(tab.name)}
            className={`px-2 py-1.5 hover:text-white xs:px-4 xs:py-2 rounded-md relative text-sm
            xs:text-base ${activeTab === tab.name ? "" : "bg-transparent text-gray-400"}`}
          >
            <span className="relative z-10 flex items-center gap-1">
              {tab.icon} {tab.name}
            </span>
            {activeTab === tab.name && (
              <motion.span
                transition={{ duration: 0.3, ease: "easeInOut" }}
                layoutId="tab"
                className="absolute inset-0 bg-gradient-to-br from-black/15 via-blue-900 to-black/35"
                style={{ willChange: "transform" }}
              />
            )}
          </motion.button>
        ))}
      </main>

      {/* Tab Content */}
      <div className="py-8 min-h-[270px]">
        {tabs.find((tab) => tab.name === activeTab)?.content}
      </div>
    </>
  );
};

export default memo(Tabs);
