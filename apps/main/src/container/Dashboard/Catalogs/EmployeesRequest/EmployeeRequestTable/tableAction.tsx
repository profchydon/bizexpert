import { Button } from "@/components/ui/button";
import { IEmployeeRequest } from "@/types/employees";

const EmployeeRequestTableActions: React.FC<{
  item?: IEmployeeRequest;
  onView: () => void;
}> = ({ onView }) => {
  return (
    <div className="flex flex-row gap-2">
      <Button
        className="text-primary-600 font-semibold"
        variant="ghost"
        size="sm"
        onClick={onView}
        data-testid="employeerequesttableaction-button"
      >
        View
      </Button>
    </div>
  );
};

export default EmployeeRequestTableActions;
