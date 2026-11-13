import {
  add_icon_gray_600,
  toogle_icon_gray_600,
  trash_icon_gray_600,
} from "@/assets/icons";
import CustomTooltip from "@/components/CustomTooltip";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { memo } from "react";

const DevicesTableActions: React.FC<{
  item?: Record<string, string>;
  onAdd: () => void;
  onRemove: () => void;
  onAddSetup: () => void;
}> = memo(({ item, onAdd, onRemove, onAddSetup }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const getDevices = searchParams.get("data");
  return (
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
              if (getDevices) {
                return (
                  router.push(
                    `/dashboard/equip-employee/devices?employee_id=${item?.id}&data_cart=${getDevices}`,
                  ),
                  onAddSetup()
                );
              } else {
                return (
                  router.push(
                    `/dashboard/equip-employee/devices?employee_id=${item?.id}`,
                  ),
                  onAddSetup()
                );
              }
            }}
            data-testid="devicestableactions-button"
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
              return (
                router.push(
                  `/dashboard/equip-employee/devices?employee_id=${item?.id}`,
                ),
                onRemove()
              );
            }}
            data-testid="devicestableactions-button-2"
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
              if (getDevices) {
                return (
                  router.push(
                    `/dashboard/equip-employee/devices?employee_id=${item?.id}&data_cart=${getDevices}`,
                  ),
                  onAdd()
                );
              } else {
                return (
                  router.push(
                    `/dashboard/equip-employee/devices?employee_id=${item?.id}`,
                  ),
                  onAdd()
                );
              }
            }}
            data-testid="devicestableactions-button-3"
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
  );
});

export default DevicesTableActions;

{
  /* <div className="flex flex-row gap-2">
        <CustomTooltip content={<span className="text-white">Add setup</span>}>
          <Button
            className="text-gray-600 font-semibold p-1"
            variant="ghost"
            size="sm"
            onClick={() => {
              if (getDevices) {
                return (
                  router.push(
                    `/dashboard/equip-employee/devices?employee_id=${item?.id}&data_cart=${getDevices}`,
                  ),
                  onAddSetup()
                );
              } else {
                return (
                  router.push(
                    `/dashboard/equip-employee/devices?employee_id=${item?.id}`,
                  ),
                  onAddSetup()
                );
              }
            }}
          >
            <Image
              src={toogle_icon_gray_600}
              alt="toogle_icon_gray_600"
              width={16}
              height={16}
            />
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
              return (
                router.push(
                  `/dashboard/equip-employee/devices?employee_id=${item?.id}`,
                ),
                onRemove()
              );
            }}
          >
            <Image
              src={trash_icon_gray_600}
              alt="trash_icon_gray_600"
              width={16}
              height={16}
            />
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
              if (getDevices) {
                return (
                  router.push(
                    `/dashboard/equip-employee/devices?employee_id=${item?.id}&data_cart=${getDevices}`,
                  ),
                  onAdd()
                );
              } else {
                return (
                  router.push(
                    `/dashboard/equip-employee/devices?employee_id=${item?.id}`,
                  ),
                  onAdd()
                );
              }
            }}
          >
            <Image
              src={add_icon_gray_600}
              alt="add_icon_gray_600"
              width={16}
              height={16}
            />
          </Button>
        </CustomTooltip>
      </div> */
}
