import { Button } from "@/components/ui/button";

const StorageTableActions: React.FC<{
  item?: Record<string, string>;
  onDelete: () => void;
}> = ({ item, onDelete }) => {
  return (
    <>
      <div className="flex flex-row gap-2">
        <Button
          className="text-[#003999] font-semibold"
          variant="ghost"
          size="sm"
          onClick={onDelete}
          data-testid="storagetableaction-button"
        >
          Remove
        </Button>
      </div>
    </>
  );
};

export default StorageTableActions;
