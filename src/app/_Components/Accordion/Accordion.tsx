import { AnimatePresence, motion } from "framer-motion";
import { FaChevronDown } from "@react-icons/all-files/fa/FaChevronDown";
import Title from "../Title/Title";
import useIsArabic from "@/app/hooks/useIsArabic";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  id: string;
  openedAccordion: string | null;
  setOpenedAccordion: React.Dispatch<React.SetStateAction<string | null>>;
}

const Accordion = ({
  title,
  children,
  id,
  openedAccordion,
  setOpenedAccordion,
}: AccordionProps) => {
  const isOpen = openedAccordion === id;
  const { isArabic } = useIsArabic();

  const toggleAccordion = () => {
    setOpenedAccordion(isOpen ? null : id);
  };
  return (
    <div className="rounded-lg overflow-hidden border border-gray-800">
      <button
        onClick={toggleAccordion}
        className={`w-full flex justify-between items-center p-4 text-left ${
          isOpen ? "bg-gray-900" : "bg-gray-900/20" } hover:bg-gray-900 transition-colors`}
      >
        <Title
          title={title}
          className={`!text-lg !font-semibold !my-0 ${!isArabic ? "!font-roboto" : ""}`}
        />
        <div className={`${isOpen ? "rotate-180" : ""} transition-transform`}>
          <FaChevronDown className="text-gray-300" />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;
