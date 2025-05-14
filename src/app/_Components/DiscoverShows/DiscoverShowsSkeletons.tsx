import CardsSkeletons from "../Card/CardsSkeletons";
import PageSection from "../PageSection/PageSection";
import Title from "../Title/Title";
import { FilterConfig } from "./showsNeeds";

interface Props {
  pageTitle: string;
  filterConfigs: FilterConfig[];
}

const DiscoverShowsSkeletons = ({ pageTitle, filterConfigs }: Props) => {
  return (
    <PageSection>
      <div className="flex flex-col gap-2 sm:gap-5 sm:flex-row items-center justify-between flex-wrap">
        <Title title={pageTitle} className="!mb-0" />
        <div className="flex items-center justify-center gap-4 lg:gap-2 flex-wrap">
          {filterConfigs.map((config) => (
            <div
              key={config.id}
              className="flex flex-col flex-wrap items-start gap-3 relative"
            >
              <div
                className="text-transparent bg-gray-700 rounded-full h-3 w-16 absolute -top-1 start-2 z-10
                  animate-pulse"
              />
              <div
                className={`${config.multiSelect ? "w-60" : "w-28"} h-10 border border-gray-600 rounded-lg
                bg-gray-800 animate-pulse relative`}
              >
                {/* Simulating the select dropdown */}
                <div className="h-full w-full px-4 pt-2 flex items-center">
                  <div className="h-3 bg-gray-700 rounded w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CardsSkeletons needSection={false} />
    </PageSection>
  );
};

export default DiscoverShowsSkeletons;
