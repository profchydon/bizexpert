import type { ReduxDispatch } from "@/store/store";
import type { IEquipment } from "@/types/equipments";
import type { IEmployees } from "@/types/employees";
import { toast } from "sonner";
import { resolveOffboardReassignEquipment } from "./equipmentOffboardReassignFlow";
import { validateOffboardDisposeSelection } from "./equipmentOffboardDisposeFlow";
import { startEquipmentOffboardDisposition } from "./startEquipmentOffboardDisposition";

type StartParams = {
  item?: IEquipment;
  selectedRows: IEquipment[];
  employees: IEmployees[];
  dispatch: ReduxDispatch;
  push: (path: string) => void;
  onStarted?: () => void;
};

export function startEquipmentOffboardDispose({
  item,
  selectedRows,
  employees,
  dispatch,
  push,
  onStarted,
}: StartParams) {
  const equipment = resolveOffboardReassignEquipment(item, selectedRows);
  const validation = validateOffboardDisposeSelection(equipment);

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
    disposition: "DISPOSE",
    onStarted,
  });
}
