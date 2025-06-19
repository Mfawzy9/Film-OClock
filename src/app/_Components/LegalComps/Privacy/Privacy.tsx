import { getTranslations } from "next-intl/server";

const sectionKeys = [
  {
    title: "Section1Title",
    desc: "Section1Note",
    list: ["Section1ListItem1", "Section1ListItem2", "Section1ListItem3"],
  },
  {
    title: "Section2Title",
    desc: "Section2Note",
    list: ["Section2ListItem1", "Section2ListItem2", "Section2ListItem3"],
  },
  { title: "Section3Title", desc: "Section3Description" },
  { title: "Section4Title", desc: "Section4Description" },
] as const;

const PrivacyPage = async () => {
  const t = await getTranslations("Legal.PrivacyPage");

  return (
    <>
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold text-blue-500 mb-2">
          {t("IntroTitle")}
        </h2>
        <p className="text-white/80">{t("IntroDescription")}</p>
      </div>

      <section className="space-y-6 text-white/90">
        {sectionKeys.map((section) => (
          <div key={section.title}>
            <h2 className="text-2xl font-semibold text-blue-300 mb-2">
              {t(section.title)}
            </h2>
            <p className="mb-4">{t(section.desc)}</p>

            {"list" in section && (
              <ul className="list-disc ps-6 mb-4">
                {section.list.map((key) => (
                  <li key={key}>{t(key)}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-6">
        <p className="text-white/80">{t("LastUpdated")}</p>
      </div>
    </>
  );
};

export default PrivacyPage;
