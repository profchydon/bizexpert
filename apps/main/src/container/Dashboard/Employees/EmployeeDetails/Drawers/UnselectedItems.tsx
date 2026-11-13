import React, { useEffect, useState } from "react";
import DrawerRight from "@/components/DrawerRight";
import { roundedImage_placeholder } from "@/assets/images";
import { IEmployees } from "@/types/employees";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { checkbox_gray_300, checkbox_primary_600 } from "@/assets/icons";
import { useAppDispatch, useAppSelector } from "@/store";
import DrawerFooter from "@/components/DrawerRight/DrawerFooter";
import { Offboard_asset } from "@/types/offboarding";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  handleOtherAction?: () => void;
  handleContinue: () => void;
  employeeData?: IEmployees;
  itemsToArchive: Offboard_asset[];
  setItemsToArchive: (value: Offboard_asset[]) => void;
}

const UnselectedItems: React.FC<Props> = ({
  isOpen,
  onClose,
  employeeData,
  handleOtherAction,
  handleContinue,
  itemsToArchive,
  setItemsToArchive,
}) => {
  const offboardItems = useAppSelector(
    (state) => state.persistedReducers.offboarding,
  ) as unknown as Offboard_asset[];
  const transformedEquipments = employeeData?.equipment?.map((item) => ({
    ...item,
    assignee: {
      ...employeeData,
      name: `${employeeData?.first_name} ${employeeData?.last_name}`,
    },
  }));

  const equipments = transformedEquipments
    ?.filter((item) => !offboardItems?.some((equip) => equip?.id === item.id))
    .filter((item) => item.status.toLowerCase() === "assigned");

  // const handleSubmit = () => {};

  // const handleEquipmentSelect = (item: Offboard_asset) => {
  //   const offboardItemsId = itemsToArchive?.map((item) => item.id);
  //   if (!itemsToArchive) {
  //     setItemsToArchive([item]);
  //   }
  //   if (offboardItemsId?.includes(item?.id!)) {
  //     const filterItems = itemsToArchive?.filter(
  //       (asset) => asset.id !== item.id,
  //     );
  //     setItemsToArchive(filterItems as unknown as Offboard_asset[]);
  //   } else {
  //     setItemsToArchive([...itemsToArchive!, item]);
  //   }
  // };

  const handleClose = () => {
    onClose();
    handleOtherAction?.();
  };

  useEffect(() => {
    if (equipments?.length! > 0) {
      setItemsToArchive(equipments as unknown as Offboard_asset[]);
    }
  }, [offboardItems]);

  return (
    <>
      <DrawerRight
        isOpen={isOpen}
        onCancel={handleClose}
        onClose={onClose}
        drawerTitle="Unselected items"
        drawerDescription="Please select all employee’s equipment you want to archive"
        hideDefaultFooterBtn
        data-testid="unselecteditems-drawerright"
      >
        <div className="fixed bottom-[78px] h-[120px] bg-gray-50 p-6 w-[350px]">
          <p className="text-base font-semibold">Note</p>
          <span className="text-sm">
            Once you have been archived the action can not be reversed.
          </span>
        </div>

        <div className="mb-[175px]">
          <div className="flex flex-col gap-y-1 pb-2">
            <span className="font-medium text-base leading-6">
              Select items archived
            </span>
            <span className="text-sm font-normal">
              By selecting all these items it means it will be kept by the
              employee and archived in the platform.
            </span>
          </div>
          <Separator className="my-4" />

          <div className="flex flex-col gap-y-3">
            {equipments?.map((equipment) => (
              <Card
                key={equipment.id}
                className={cn(
                  "bg-white w-full text-gray-600 cursor-pointer border-gray-200",
                  `${itemsToArchive?.some((item) => item.id === equipment.id) && "border-primary-600 border-2 bg-primary-50"}`,
                )}
                // onClick={() =>
                //   handleEquipmentSelect(equipment as unknown as Offboard_asset)
                // }
              >
                <CardContent className="p-4 flex flex-row items-start space-x-2 justify-between">
                  <div className="flex items-center gap-x-3">
                    <Image
                      src={equipment?.image_url || roundedImage_placeholder}
                      alt="data.imageAlt"
                      width={34}
                      height={34}
                    />

                    <div className="space-y-1 flex flex-col">
                      <p className="text-sm font-normal leading-none">
                        <span className="text-sm font-medium">
                          {equipment?.title} {equipment?.make}
                        </span>
                      </p>
                    </div>
                  </div>

                  {!itemsToArchive?.some(
                    (item) => item.id === equipment?.id,
                  ) ? (
                    <Image
                      src={checkbox_gray_300}
                      alt="check_primary_icon"
                      // width={24}
                      // height={24}
                    />
                  ) : (
                    <Image
                      src={checkbox_primary_600}
                      alt="check_primary_icon"
                      // width={24}
                      // height={24}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <DrawerFooter
          onClose={handleClose}
          submitButtonType="button"
          cancelText="Select other actions"
          saveText="Continue"
          onSubmit={handleContinue}
          disableSubmitButton={equipments?.length !== itemsToArchive?.length}
        />
      </DrawerRight>
    </>
  );
};

export default UnselectedItems;
