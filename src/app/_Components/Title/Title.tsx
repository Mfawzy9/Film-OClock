import useIsArabic from "@/app/hooks/useIsArabic";

const Title = ({ title }: { title: string }) => {
  const { isArabic } = useIsArabic();
  return (
    <h2
      className={`text-xl xs:text-3xl font-bold ${isArabic ? "font-cairo" : "font-righteous"} mb-3
        border-s-4 border-blue-700 ps-2`}
    >
      {title}
    </h2>
  );
};

export default Title;
