import ViewNavigateButton from "@/components/ViewNavigateButton";
import { IItemsInStorageByCountry } from "@/types/equipments";

const StorageSummaryActions: React.FC<{
  item?: IItemsInStorageByCountry;
  viewHref: string;
  onBeforeNavigate?: () => void;
}> = ({ viewHref, onBeforeNavigate }) => {
  return (
    <div className="flex flex-row gap-2">
      <ViewNavigateButton
        href={viewHref}
        className="font-semibold text-[#003999]"
        onBeforeNavigate={onBeforeNavigate}
        testId="storagesummarytableaction-button"
      />
    </div>
  );
};

export default StorageSummaryActions;
