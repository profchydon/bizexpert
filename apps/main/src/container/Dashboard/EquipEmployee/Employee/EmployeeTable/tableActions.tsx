import { Button } from "@/components/ui/button";
import { IEmployees } from "@/types/employees";

const EmployeeTableActions: React.FC<{
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
          data-testid="employeetableactions-button"
        >
          Remove
        </Button>
        <Button
          className="text-primary-700 font-semibold"
          variant="ghost"
          size="sm"
          onClick={onEdit}
          data-testid="employeetableactions-button-2"
        >
          Edit
        </Button>
      </div>
    </>
  );
};

export default EmployeeTableActions;
