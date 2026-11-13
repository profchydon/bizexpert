import React from "react";
import DrawerRight from "@/components/DrawerRight";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { checkbox_gray_300, checkbox_primary_600 } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { IEmployees } from "@/types/employees";
import { roundedImage_placeholder } from "@/assets/images";
import DrawerFooter from "@/components/DrawerRight/DrawerFooter";
import { useAppDispatch, useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import { Offboard_asset } from "@/types/offboarding";
import EmptyEquipmentInstance from "./EmptyEquipmentInstance";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  employeeData?: IEmployees;
  handleNext: () => void;
  setSelectedEquipments: (selectedEquipments: Offboard_asset[]) => void;
  selectedEquipments: Offboard_asset[];
}

const SelectEquipments: React.FC<Props> = ({
  isOpen,
  onClose,
  employeeData,
  handleNext,
  setSelectedEquipments,
  selectedEquipments,
}) => {
  const offboardingData = useAppSelector(
    (state) => state.persistedReducers.offboarding,
  ) as Offboard_asset;
  const offboardItems = offboardingData as unknown as Offboard_asset[];

  const newEqs = employeeData?.equipment;
  const transformedEquipments = newEqs?.map((item) => ({
    ...item,
    assignee: {
      ...employeeData,
      name: `${employeeData?.first_name} ${employeeData?.last_name}`,
    },
  }));
  const equipments = transformedEquipments
    ?.filter((item) => !offboardItems?.some((equip) => equip?.id === item.id))
    .filter((item) => item.status.toLowerCase() === "assigned");

  const selectAllEquipments = () => {
    if (selectedEquipments?.length === equipments?.length!) {
      setSelectedEquipments([]);
    } else {
      setSelectedEquipments(equipments as unknown as Offboard_asset[]);
    }
  };

  const handleEquipmentSelect = (item: Offboard_asset) => {
    const offboardItemsId = selectedEquipments?.map((item) => item.id);
    if (!selectedEquipments) {
      setSelectedEquipments([item]);
    }

    if (offboardItemsId?.includes(item?.id)) {
      const filterItem = selectedEquipments?.filter(
        (equip) => equip.id !== item?.id,
      );
      setSelectedEquipments(filterItem);
    } else {
      setSelectedEquipments([...selectedEquipments, item]);
    }
  };

  return (
    <>
      <DrawerRight
        isOpen={isOpen}
        onCancel={onClose}
        onClose={onClose}
        hideDefaultFooterBtn
        drawerTitle="Select Equipment"
        drawerDescription="Please select all employee's equipment you want to offboard"
        data-testid="selectequipments-drawerright"
      >
        <div className="mb-[78px]">
          <div className="flex flex-col w-full gap-y-4">
            {equipments?.length! > 0 && (
              <div className="">
                <Button
                  className="w-full space-x-2 border border-gray-300"
                  variant={"outline"}
                  onClick={selectAllEquipments}
                  data-testid="selectequipments-button"
                >
                  <Check /> <span>Select all</span>
                </Button>
              </div>
            )}
            {equipments && equipments.length > 0 ? (
              equipments?.map((equipment) => (
                <Card
                  key={equipment.id}
                  className={cn(
                    "bg-white w-full text-gray-600 cursor-pointer border-gray-200",
                    `${selectedEquipments?.some((item) => item.id === equipment.id) && "border-primary-600 border-2 bg-primary-50"}`,
                  )}
                  onClick={() =>
                    handleEquipmentSelect(
                      equipment as unknown as Offboard_asset,
                    )
                  }
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
                            {equipment?.title} {equipment?.description}
                          </span>
                        </p>
                      </div>
                    </div>

                    {!selectedEquipments?.some(
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
              ))
            ) : (
              <EmptyEquipmentInstance />
            )}
          </div>
          <DrawerFooter
            submitButtonType="button"
            onClose={onClose}
            onSubmit={handleNext}
            disableSubmitButton={
              !selectedEquipments || selectedEquipments?.length < 1
            }
          />
        </div>
      </DrawerRight>
    </>
  );
};

export default SelectEquipments;
