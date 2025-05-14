import useIsArabic from "@/app/hooks/useIsArabic";

const Title = ({ title, className }: { title: string; className?: string }) => {
  const { isArabic } = useIsArabic();
  return (
    <h2
      className={`${className ?? ""} text-xl xs:text-3xl font-bold
        ${isArabic ? "font-cairo" : "font-righteous"} mb-3 border-s-4 border-blue-700
        ps-2 `}
    >
      {title}
    </h2>
  );
};

export default Title;
