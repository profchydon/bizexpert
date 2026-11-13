import { Button } from "@/components/ui/button";
import { IAsset } from "@/types/assets";

const CatalogTableActions: React.FC<{
  item?: IAsset;
  isRemoveAssetLoading: boolean;
  onRemove: () => void;
}> = ({ onRemove, isRemoveAssetLoading }) => {
  return (
    <div className="flex flex-row gap-2">
      <Button
        className="text-primary-600 font-semibold"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        disabled={isRemoveAssetLoading}
        data-testid="catalogtableaction-button"
      >
        Remove
      </Button>
    </div>
  );
};

export default CatalogTableActions;
