import { getTranslations } from "next-intl/server";

const sectionKeys = [
  { title: "Section1Title", desc: "Section1Description" },
  { title: "Section2Title", desc: "Section2Description" },
  { title: "Section3Title", desc: "Section3Description" },
  { title: "Section4Title", desc: "Section4Description" },
  { title: "Section5Title", desc: "Section5Description" },
  { title: "Section6Title", desc: "Section6Description" },
  { title: "Section7Title", desc: "Section7Description" },
] as const;

const TermsPage = async () => {
  const t = await getTranslations("Legal.TermsPage");

  return (
    <>
      {/* <h1 className="text-3xl font-bold mb-6">{t("Title")}</h1> */}

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold text-yellow-400 mb-2">
          {t("NoticeTitle")}
        </h2>
        <p className="text-white/80">{t("NoticeDescription")}</p>
      </div>

      <section className="space-y-6 text-white/90">
        {sectionKeys.map(({ title, desc }) => (
          <div key={`${title}-Terms`}>
            <h2 className="text-2xl font-semibold text-blue-300 mb-2">
              {t(title)}
            </h2>
            <p>{t(desc)}</p>
          </div>
        ))}
      </section>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-6">
        <p className="text-white/80">{t("LastUpdated")}</p>
      </div>
    </>
  );
};

export default TermsPage;
