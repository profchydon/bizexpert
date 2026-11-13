import { Eye, LogOut, Pencil, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AllEmployeesTableActions: React.FC<{
  item?: Record<string, string>;
  selectedFilterValue?: string;
  canOffboard?: boolean;
  onView: () => void;
  onEdit: () => void;
  onOffboard?: () => void;
}> = ({
  onView,
  onEdit,
  onOffboard,
  selectedFilterValue,
  canOffboard = false,
}) => {
  const isArchived = selectedFilterValue === "archived";
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            data-testid="employeestableaction-button"
            aria-label="Employee actions"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onClick={onView}
            className="gap-2 text-gray-700"
            data-testid="employeestableaction-view"
          >
            <Eye className="h-4 w-4" />
            View
          </DropdownMenuItem>
          {!isArchived && (
            <DropdownMenuItem
              onClick={onEdit}
              className="gap-2 text-gray-700"
              data-testid="employeestableaction-edit"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
          )}
          {!isArchived && (
            <DropdownMenuItem
              onClick={canOffboard ? onOffboard : undefined}
              disabled={!canOffboard}
              title={
                canOffboard
                  ? undefined
                  : "Only employees with assigned devices can be off-boarded"
              }
              className="gap-2 text-gray-700"
              data-testid="employeestableaction-offboard"
            >
              <LogOut className="h-4 w-4" />
              Off-board
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AllEmployeesTableActions;
