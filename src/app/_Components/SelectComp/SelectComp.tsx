import { useRouter as useNextIntlRouter } from "@/i18n/navigation";
import { useRouter } from "@bprogress/next/app";

interface SelectCompProps {
  items: { query: string; name: string }[];
  activeSelect: { query: string; name: string };
  setActiveSelect: (selectedOption: { query: string; name: string }) => void;
  label?: string;
  className?: string;
  setSeasonNumber?: React.Dispatch<React.SetStateAction<number>>;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
}

const SelectComp = ({
  items,
  activeSelect,
  setActiveSelect,
  label = "Filter by Type:",
  className,
  setSeasonNumber,
  setPage,
}: SelectCompProps) => {
  const router = useRouter({ customRouter: useNextIntlRouter });
  const handleSelectOption = (query: string, name: string) => {
    setActiveSelect({ query, name });
    if (setSeasonNumber) setSeasonNumber(Number(query.split(" ")[1]));
    if (setPage) {
      setPage(1);
      router.push(`?page=${1}`, { scroll: false });
    }
  };

  return (
    <div className="flex flex-col flex-wrap items-start gap-3 relative">
      <label
        className={`text-gray-300 pointer-events-none px-1 text-xs absolute -top-2 start-2
          bg-gray-900 rounded-full z-10 ${className}`}
      >
        {label}
      </label>
      <select
        className="px-4 pb-2 pt-3 border border-gray-600 rounded-lg bg-gray-900 text-gray-200
          focus:ring-2 focus:ring-blue-700 focus:border-blue-700 custom-scrollbar
          [box-shadow:0_0_3px_#1c64f2] relative"
        defaultValue={activeSelect?.name}
        onChange={(e) => handleSelectOption(e.target.value, e.target.value)}
      >
        {items.map((type) => (
          <option
            key={type.query}
            value={type.query}
            className="bg-gray-800 text-gray-200"
          >
            {type.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectComp;
