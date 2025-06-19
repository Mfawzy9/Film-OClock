import { getTranslations } from "next-intl/server";

const sectionKeys = [
  {
    title: "Section1Title",
    desc: "Section1Description",
    list: ["Section1Item1", "Section1Item2", "Section1Item3", "Section1Item4"],
    type: "ul",
  },
  {
    title: "Section2Title",
    desc: "Section2Description",
    list: ["Section2Item1", "Section2Item2", "Section2Item3", "Section2Item4"],
    type: "ol",
  },
  {
    title: "Section3Title",
    desc: "Section3Description",
  },
  {
    title: "Section4Title",
    desc: "Section4Description",
    isBox: true,
  },
  {
    title: "Section5Title",
    desc: "Section5Description",
  },
] as const;

const ContentRemovalPage = async () => {
  const t = await getTranslations("Legal.ContentRemovalPage");

  return (
    <>
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold text-yellow-500 mb-2">
          {t("IntroTitle")}
        </h2>
        <p className="text-white/80 whitespace-pre-line">
          {t("IntroDescription")}
        </p>
      </div>

      {sectionKeys.map((section) => {
        const Tag = "type" in section && section.type === "ol" ? "ol" : "ul";
        const boxClasses =
          "isBox" in section && section.isBox
            ? "bg-gray-500/10 border border-gray-500/20 rounded-lg p-4 mb-6"
            : "";

        return (
          <div key={section.title} className={boxClasses}>
            <h2 className="text-2xl font-semibold text-blue-300 mb-2">
              {t(section.title)}
            </h2>
            <p className="mb-4 whitespace-pre-line">{t(section.desc)}</p>

            {"list" in section && section.list && (
              <Tag className="ps-6 mb-4 list-disc marker:text-blue-300">
                {section.list.map((key) => (
                  <li key={key}>{t(key)}</li>
                ))}
              </Tag>
            )}
          </div>
        );
      })}

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-6">
        <p className="text-white/80">{t("LastUpdated")}</p>
      </div>
    </>
  );
};

export default ContentRemovalPage;
