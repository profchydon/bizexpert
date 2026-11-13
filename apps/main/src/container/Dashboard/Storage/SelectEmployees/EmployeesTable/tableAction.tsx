import { Button } from "@/components/ui/button";
import { IEmployees } from "@/types/employees";

const AllEmployeesTableActions: React.FC<{
  item?: IEmployees;
  onAdd: () => void;
}> = ({ item, onAdd }) => {
  return (
    <>
      <div className="flex flex-row gap-2">
        <Button
          className="text-primary-600 font-semibold"
          variant="ghost"
          size="sm"
          onClick={onAdd}
          data-testid="employeestableaction-button"
        >
          Add
        </Button>
      </div>
    </>
  );
};

export default AllEmployeesTableActions;
