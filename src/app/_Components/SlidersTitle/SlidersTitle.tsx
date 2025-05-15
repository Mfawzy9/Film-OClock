import { Link } from "@/i18n/navigation";
import Title from "../Title/Title";
import useIsArabic from "@/app/hooks/useIsArabic";
import { TiChevronLeft } from "@react-icons/all-files/ti/TiChevronLeft";
import { TiChevronRight } from "@react-icons/all-files/ti/TiChevronRight";

const SlidersTitle = ({
  title,
  pageLink,
}: {
  title?: string;
  pageLink: string;
}) => {
  const { isArabic } = useIsArabic();
  return (
    <Link
      href={pageLink}
      className="mb-2 sm:mb-0 text-lg flex items-center gap-1 group relative z-10 w-fit"
    >
      <Title title={title ?? ""} />
      {isArabic ? (
        <TiChevronLeft className="mb-2 text-4xl group-hover:text-blue-700 font-extrabold" />
      ) : (
        <TiChevronRight className="mb-2 text-4xl group-hover:text-blue-700 font-extrabold" />
      )}
    </Link>
  );
};

export default SlidersTitle;
