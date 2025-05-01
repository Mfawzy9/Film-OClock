import PageHeader from "@/app/_Components/PageHeader/PageHeader";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PageHeader />
      {children}
    </>
  );
};

export default Layout;
