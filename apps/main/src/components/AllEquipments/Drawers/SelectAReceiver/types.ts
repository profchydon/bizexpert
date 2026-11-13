import { SingleSelectValue } from "@/components/ui/autocomplete";
import { IEmployees } from "@/types/employees";
import { IEquipment } from "@/types/equipments";
import { Offboard_asset } from "@/types/offboarding";

export interface FormattedItem {
  value: string;
  label: string;
}

export interface SelectAReceiverProps {
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  employeeDataOptions?: FormattedItem[];
  equipID?: string | null;
  equipmentsData?: IEquipment[];
  singleEquipmentData?: IEquipment;
  isLoading?: boolean;
  isError?: boolean;
  setSelectedRows?: () => void;
  presetEmployeeValue?: string | null;
  editInstance?: boolean;
  modifyInstance?: boolean;
  baseRoute: string;
  modifyInstanceData?: Offboard_asset[];
  currentEmployee?: IEmployees;
  handleModifyInstanceSubmit?: (
    selectedEmployeeValue: string | Record<string, SingleSelectValue | null>,
    setSelectedEmployeeValue: (
      value: string | Record<string, SingleSelectValue | null>,
    ) => void,
  ) => void;
  selectedRows?: Array<{ id?: string | null }>;
  isReAssignInstance?: boolean;
}
