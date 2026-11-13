import React, { useEffect } from "react";
import DrawerRight from "@/components/DrawerRight";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import DrawerFooter from "@/components/DrawerRight/DrawerFooter";
import ActionCard from "./ActionCard";
import routes from "@/routes";
import { removeSelectedEmployee } from "@/store/slices/employeeSlice";
import displayErrorMessage from "@/utils/displayErrorMessage";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  handleAddAction?: () => void;
}

const ActionsDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  handleAddAction,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const selectedEmployee = useAppSelector(
    (state) => state.persistedReducers.employee.selectedEmployee,
  );
  const allEmployeesHaveACountry = selectedEmployee?.every((employee) =>
    Boolean(employee?.country),
  );
  const handleAddMoreActions = () => {
    onClose();
    handleAddAction?.();
  };

  const handleSubmit = () => {
    if (allEmployeesHaveACountry) {
      onClose();
      router.push(routes.STORAGE_ASSIGN_EMPLOYEES);
    } else {
      displayErrorMessage("All selected employees must have a country");
    }
  };

  useEffect(() => {
    if (!selectedEmployee || selectedEmployee.length === 0) {
      onClose();
    }
  }, [selectedEmployee]);

  return (
    <div>
      <DrawerRight
        isOpen={isOpen}
        onClose={onClose}
        onCancel={handleAddMoreActions}
        onSave={handleSubmit}
        saveText={"Continue"}
        cancelText={"Cancel"}
        drawerTitle="Actions"
        drawerDescription="See all actions and edit"
        data-testid="actions-drawerright"
      >
        <div className="space-y-6 mt-2 px-0 mb-[70px]">
          {selectedEmployee?.map((item) => (
            <ActionCard
              item={item}
              onRemove={() => dispatch(removeSelectedEmployee(item.id))}
            />
          ))}
        </div>

        <DrawerFooter onClose={onClose} submitButtonType="button" />
      </DrawerRight>
    </div>
  );
};

export default ActionsDrawer;
