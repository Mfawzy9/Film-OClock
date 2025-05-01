const PageSection = ({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <section
      className={`px-3 sm:px-7 py-20 lg:max-w-screen-xl mx-auto ${className ?? ""}`}
      style={style ?? {}}
    >
      {children}
    </section>
  );
};

export default PageSection;
