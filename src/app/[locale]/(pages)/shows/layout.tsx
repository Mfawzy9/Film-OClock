import PageHeader from "@/app/_Components/PageHeader/PageHeader";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PageHeader />
      {children}
    </>
  );
};

export default layout;
