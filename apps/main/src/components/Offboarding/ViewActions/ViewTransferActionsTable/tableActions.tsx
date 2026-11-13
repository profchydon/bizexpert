import { Button } from "@/components/ui/button";
import { IEmployees } from "@/types/employees";

const ViewTransferActions: React.FC<{
  item?: IEmployees;
  onEdit: () => void;
  onRemove: () => void;
}> = ({ item, onEdit, onRemove }) => {
  return (
    <>
      <div className="flex flex-row gap-3">
        <Button
          className="text-gray-600 font-semibold"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          data-testid="viewtransferactionstableactions-button"
        >
          Remove
        </Button>
        <Button
          className="text-primary-700 font-semibold"
          variant="ghost"
          size="sm"
          onClick={onEdit}
          data-testid="viewtransferactionstableactions-button-2"
        >
          Edit
        </Button>
      </div>
    </>
  );
};

export default ViewTransferActions;
