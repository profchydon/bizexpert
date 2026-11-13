import CustomTooltip from "@/components/CustomTooltip";
import { Button } from "@/components/ui/button";
import routes from "@/routes";
import { useRouter, useSearchParams } from "next/navigation";
import { memo } from "react";
import {
  add_icon_gray_600,
  toogle_icon_gray_600,
  trash_icon_gray_600,
} from "@/assets/icons";
import Image from "next/image";

const AssignEmployeeTableActions: React.FC<{
  item?: Record<string, string>;
  onAdd: () => void;
  onRemove: () => void;
  onAddSetup: () => void;
}> = memo(({ item, onAdd, onRemove, onAddSetup }) => {
  const router = useRouter();

  return (
    <>
      <>
        <div className=" flex flex-row gap-2 items-center w-full sm:w-full">
          <CustomTooltip
            content={<span className="text-white text-xs">Add setup</span>}
          >
            <Button
              className="text-gray-600 font-semibold p-1"
              variant="ghost"
              size="sm"
              onClick={() => {
                router.push(
                  `${routes.STORAGE_ASSIGN_EMPLOYEES}?employee_id=${item?.id}`,
                );
                onAddSetup();
              }}
              data-testid="assignemployeetableactions-button"
            >
              <div className="flex-shrink-0">
                <Image
                  src={toogle_icon_gray_600}
                  alt="toogle_icon_gray_600"
                  width={16}
                  height={16}
                />
              </div>
            </Button>
          </CustomTooltip>

          <CustomTooltip
            content={<span className="text-white">Remove Item</span>}
          >
            <Button
              className="text-gray-600 font-semibold p-1"
              variant="ghost"
              size="sm"
              onClick={() => {
                (router.push(
                  `${routes.STORAGE_ASSIGN_EMPLOYEES}?employee_id=${item?.id}`,
                ),
                  onRemove());
              }}
              data-testid="assignemployeetableactions-button-2"
            >
              <div className="flex-shrink-0">
                <Image
                  src={trash_icon_gray_600}
                  alt="trash_icon_gray_600"
                  width={16}
                  height={16}
                />
              </div>
            </Button>
          </CustomTooltip>

          <CustomTooltip
            content={<span className="text-white">Add equipment</span>}
          >
            <Button
              className="text-primary-700 font-semibold p-1"
              variant="ghost"
              size="sm"
              onClick={() => {
                (router.push(
                  `${routes.STORAGE_ASSIGN_EMPLOYEES}?employee_id=${item?.id}`,
                ),
                  onAdd());
              }}
              data-testid="assignemployeetableactions-button-3"
            >
              <div className="flex-shrink-0">
                <Image
                  src={add_icon_gray_600}
                  alt="add_icon_gray_600"
                  width={16}
                  height={16}
                />
              </div>
            </Button>
          </CustomTooltip>
        </div>
      </>
    </>
  );
});

export default AssignEmployeeTableActions;
