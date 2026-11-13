import { Button } from "@/components/ui/button";
import { IEmployees } from "@/types/employees";

const ViewSalesActions: React.FC<{
  item?: IEmployees;
  onRemove: () => void;
}> = ({ item, onRemove }) => {
  return (
    <>
      <div className="flex flex-row gap-3">
        <Button
          className="text-gray-600 font-semibold"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          data-testid="viewsalesactiontableactions-button"
        >
          Remove
        </Button>
      </div>
    </>
  );
};

export default ViewSalesActions;
