import PageHeader from "@/app/_Components/PageHeader/PageHeader";
import PageSection from "@/app/_Components/PageSection/PageSection";

const LegalLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PageHeader />
      <PageSection className="!py-10">{children}</PageSection>
    </>
  );
};

export default LegalLayout;
