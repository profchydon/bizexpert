import React, { useState } from "react";

import DrawerRight from "@/components/DrawerRight";
import MultipleInstance from "./MultipleInstance";
import { useAppDispatch, useAppSelector } from "@/store";
import { setBuyToStorageItems } from "@/store/slices/equipEmployeeSlice";
import { useRouter } from "next/navigation";
import routes from "@/routes";
import { IEmployees } from "@/types/employees";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";
import { UNASSIGNED_ORDER_SUMMARY_KEY } from "@/utils/getInitials";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardStorageDuration: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const buyToStorageItems = useAppSelector(
    (state) => state.persistedReducers.equipEmployee.buyToStorageItems,
  );

  const [selectedValues, setSelectedValuesState] = useState<
    Record<number | string, string>
  >({});

  const setSelectedValues = (id: number | string, value: string) => {
    setSelectedValuesState((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const updatedItems = buyToStorageItems?.map((item) => {
    const assetId = item?.pricing?.id;
    const getItemDuration = selectedValues[assetId!];
    return {
      ...item,
      storageDuration: getItemDuration,
    };
  });

  const employees = [
    {
      id: UNASSIGNED_ORDER_SUMMARY_KEY,
      items: updatedItems,
    },
  ] as IEmployees[];

  const handleSave = () => {
    dispatch(setBuyToStorageItems(updatedItems));
    dispatch(setSelectedEmployees(employees));
    onClose();
    router.push(routes.EQUIP_EMPLOYEE_ORDER_SUMMARY);
  };

  const storageDurationsArray = Object.entries(selectedValues).map(
    ([id, duration]) => ({
      id,
      duration,
    }),
  );
  return (
    <div>
      <DrawerRight
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelectedValuesState({});
          dispatch(setBuyToStorageItems([]));
        }}
        onCancel={() => {
          onClose();
          setSelectedValuesState({});
          dispatch(setBuyToStorageItems([]));
        }}
        onSave={handleSave}
        saveText={"Submit"}
        isSaveButtonDisabled={
          storageDurationsArray.length !== updatedItems?.length
        }
        drawerTitle={"Storage duration"}
        drawerDescription={
          "How long would you like to store the equipment for?"
        }
        data-testid="onboardstorageduration-drawerright"
      >
        <MultipleInstance
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
          storageItems={buyToStorageItems!}
        />
      </DrawerRight>
    </div>
  );
};

export default OnboardStorageDuration;
