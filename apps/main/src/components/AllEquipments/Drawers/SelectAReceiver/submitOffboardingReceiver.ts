import { SingleSelectValue } from "@/components/ui/autocomplete";
import { IEmployees } from "@/types/employees";
import { IEquipment } from "@/types/equipments";
import { Offboard_asset } from "@/types/offboarding";
import displaySuccessMessage from "@/utils/displaySuccessMessage";

export const submitOffboardingReceiver = ({
  modifyInstance,
  equipID,
  equipmentsData,
  offboardingData,
  selectedEmployeeValue,
  employeeData,
  transformData,
  dispatchUpdate,
  onNext,
  setSelectedEmployeeValue,
  editInstance,
  resetSearch,
  onClose,
  handleModifyInstanceSubmit,
  baseRoute,
  push,
}: {
  modifyInstance: boolean;
  equipID?: string | null;
  equipmentsData?: IEquipment[];
  offboardingData: Offboard_asset | Offboard_asset[];
  selectedEmployeeValue?: string | Record<string, SingleSelectValue | null>;
  employeeData?: IEmployees[];
  transformData: (input: any) => Offboard_asset | Offboard_asset[];
  dispatchUpdate: (data: Offboard_asset[]) => void;
  onNext?: () => void;
  setSelectedEmployeeValue: (
    value:
      | string
      | Record<string, SingleSelectValue | null>
      | ((
          prev: string | Record<string, SingleSelectValue | null> | undefined,
        ) => string | Record<string, SingleSelectValue | null>),
  ) => void;
  editInstance: boolean;
  resetSearch: () => void;
  onClose: () => void;
  handleModifyInstanceSubmit?: (
    selectedEmployeeValue: string | Record<string, SingleSelectValue | null>,
    setSelectedEmployeeValue: (
      value: string | Record<string, SingleSelectValue | null>,
    ) => void,
  ) => void;
  baseRoute: string;
  push: (path: string) => void;
}) => {
  if (modifyInstance) {
    handleModifyInstanceSubmit?.(
      selectedEmployeeValue as
        | string
        | Record<string, SingleSelectValue | null>,
      setSelectedEmployeeValue as (
        value: string | Record<string, SingleSelectValue | null>,
      ) => void,
    );
    resetSearch();
    if (baseRoute) {
      push(`${baseRoute}/order-summary`);
    }
    onClose();
    return;
  }

  const equipmentDB = equipmentsData?.find((item) => item.id === equipID);
  const transformed = transformData(equipmentDB);
  const transform = (
    Array.isArray(transformed) ? transformed[0] : transformed
  ) as Offboard_asset;
  let updatedOffboardingData: Offboard_asset[] = Array.isArray(offboardingData)
    ? [...offboardingData]
    : offboardingData
      ? [offboardingData]
      : [];

  const newSelections: Record<string, IEmployees | undefined> = {};

  if (typeof selectedEmployeeValue === "string") {
    newSelections[equipID as string] = employeeData?.find(
      (emp) => emp.id === selectedEmployeeValue,
    );
  } else if (selectedEmployeeValue) {
    Object.entries(selectedEmployeeValue).forEach(([equipmentId, value]) => {
      newSelections[equipmentId] = employeeData?.find(
        (emp) => emp.id === value?.value,
      );
    });
  }

  updatedOffboardingData = updatedOffboardingData.map((item) =>
    newSelections[item.id]
      ? {
          ...item,
          receiver: newSelections[item.id],
          actionType: "Transfer",
        }
      : item,
  );

  Object.entries(newSelections).forEach(([id, employee]) => {
    const exists = updatedOffboardingData.some((item) => item.id === id);
    if (!exists) {
      updatedOffboardingData.push({
        ...transform,
        id,
        receiver: employee as IEmployees,
        actionType: "Transfer",
      });
    }
  });

  dispatchUpdate(updatedOffboardingData);
  onNext?.();
  setSelectedEmployeeValue((prev) =>
    typeof prev === "object" ? { ...prev } : {},
  );

  if (editInstance) {
    displaySuccessMessage(
      `Action updated`,
      `The Off board action has been updated successfully.`,
    );
  }
  resetSearch();
  onClose();
};
