import { Button } from "@/components/ui/button";
import { HiDotsVertical } from "react-icons/hi";
import { Check } from "lucide-react";
import { IDepartment } from "@/types/departments";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DepartmentTableActions: React.FC<{
  item: IDepartment;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ item, onView, onEdit, onDelete }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          data-testid="departmenttableactions-button"
        >
          <HiDotsVertical className="text-gray-300" />
          <span className="sr-only">Open menu</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[160px] flex flex-col gap-y-3 text-sm">
        {/* <div
          className="group flex justify-between items-center cursor-pointer"
          onClick={onView}
        >
          <span>View</span>
          <Check className="text-primary-600 group-hover:visible invisible w-5 h-5" />
        </div> */}

        <div
          className="group flex justify-between items-center cursor-pointer"
          onClick={onEdit}
        >
          <span>Edit</span>
          <Check className="text-primary-600 group-hover:visible invisible w-5 h-5" />
        </div>

        <div
          className="group flex justify-between items-center cursor-pointer"
          onClick={onDelete}
        >
          <span>Delete</span>
          <Check className="text-primary-600 group-hover:visible invisible w-5 h-5" />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DepartmentTableActions;
