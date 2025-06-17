import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const sectionKeys = [
  {
    title: "Section1Title",
    desc: "Section1Note",
    list: [
      "Section1ListItem1",
      "Section1ListItem2",
      "Section1ListItem3",
      "Section1ListItem4",
    ],
  },
  {
    title: "Section2Title",
    desc: "Section2Note",
    list: ["Section2ListItem1", "Section2ListItem2", "Section2ListItem3"],
  },
  {
    title: "Section3Title",
    desc: "Section3Description",
  },
] as const;

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("MetaData.Dmca");

  return {
    title: t("Title"),
    description: t("Description"),
  };
};

const DmcaPage = async () => {
  const t = await getTranslations("Legal.DmcaPage");

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">{t("Title")}</h1>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold text-yellow-500 mb-2">
          {t("IntroTitle")}
        </h2>
        <p className="text-white/80 whitespace-pre-line">
          {t("IntroDescription")}
        </p>
      </div>

      {sectionKeys.map((section) => (
        <div key={section.title}>
          <h2 className="text-2xl font-semibold text-blue-300 mb-2">
            {t(section.title)}
          </h2>
          {"list" in section ? (
            <>
              <p className="mb-4">{t(section.desc)}</p>
              <ul className="list-disc ps-6 mb-4">
                {section.list.map((item) => (
                  <li key={item}>{t(item)}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mb-4 whitespace-pre-line">{t(section.desc)}</p>
          )}
        </div>
      ))}

      <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-4 mb-6">
        <h3 className="text-xl font-semibold mb-2">{t("DisclaimerTitle")}</h3>
        <p className="text-white/80 whitespace-pre-line">
          {t("DisclaimerDescription")}
        </p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-6">
        <p className="text-white/80">{t("LastUpdated")}</p>
      </div>
    </>
  );
};

export default DmcaPage;
