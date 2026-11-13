import { Button } from "@/components/ui/button";
import { IAssetRefreshList } from "@/types/assetRefresh";

const ViewTableActions: React.FC<{
  item?: any;
  onAddItem: () => void;
  onRemoveItem: () => void;
  onRemove: () => void;
}> = ({ item, onAddItem, onRemoveItem, onRemove }) => {
  return (
    <>
      <div className="flex flex-row gap-3">
        <Button
          className="text-gray-600 font-semibold"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          data-testid="actiontable.tsxactions-button"
        >
          Remove
        </Button>

        {Object.hasOwn(item as IAssetRefreshList, "items") &&
        item?.items?.length > 0 ? (
          <Button
            className="text-error-700 font-semibold"
            variant="ghost"
            size="sm"
            onClick={onRemoveItem}
            data-testid="actiontable.tsxactions-button-2"
          >
            Remove item
          </Button>
        ) : (
          <Button
            className="text-primary-700 font-semibold"
            variant="ghost"
            size="sm"
            onClick={onAddItem}
            data-testid="actiontable.tsxactions-button-3"
          >
            Add item
          </Button>
        )}
      </div>
    </>
  );
};

export default ViewTableActions;
