import type { ReduxDispatch } from "@/store/store";
import type { IEquipment } from "@/types/equipments";
import type { IEmployees } from "@/types/employees";
import { toast } from "sonner";
import { resolveOffboardReassignEquipment } from "./equipmentOffboardReassignFlow";
import { validateOffboardStoreSelection } from "./equipmentOffboardStoreFlow";
import { startEquipmentOffboardDisposition } from "./startEquipmentOffboardDisposition";

type StartParams = {
  item?: IEquipment;
  selectedRows: IEquipment[];
  employees: IEmployees[];
  dispatch: ReduxDispatch;
  push: (path: string) => void;
  onStarted?: () => void;
};

export function startEquipmentOffboardStore({
  item,
  selectedRows,
  employees,
  dispatch,
  push,
  onStarted,
}: StartParams) {
  const equipment = resolveOffboardReassignEquipment(item, selectedRows);
  const validation = validateOffboardStoreSelection(equipment);

  if (!validation.ok) {
    toast.error(validation.message);
    return false;
  }

  return startEquipmentOffboardDisposition({
    equipment,
    validation,
    employees,
    dispatch,
    push,
    disposition: "STORE",
    onStarted,
  });
}
