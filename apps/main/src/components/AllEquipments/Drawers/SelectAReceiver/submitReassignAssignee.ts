import { UpdateEquipmentAssigneeRequest } from "@/types/equipments";
import displayErrorMessage from "@/utils/displayErrorMessage";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { resolveReassignEquipmentIds } from "./resolveReassignEquipmentIds";

type AssignMutation = (payload: UpdateEquipmentAssigneeRequest) => {
  unwrap: () => Promise<unknown>;
};

export const submitReassignAssignee = async ({
  companyId,
  equipID,
  selectedRows,
  singleEquipmentData,
  assignee,
  assign,
  onSuccess,
}: {
  companyId: string;
  equipID?: string | null;
  selectedRows?: Array<{ id?: string | null }>;
  singleEquipmentData?: { id?: string | null };
  assignee: unknown;
  assign: AssignMutation;
  onSuccess: () => void;
}) => {
  const equipmentIds = resolveReassignEquipmentIds({
    equipID,
    selectedRows,
    singleEquipmentData,
  });

  if (equipmentIds.length === 0) {
    displayErrorMessage(
      "Could not reassign equipment",
      "The selected asset is missing. Select the asset again and retry.",
    );
    return;
  }

  for (const equipment_id of equipmentIds) {
    await assign({
      companyId,
      equipment_id,
      payload: {
        assignee:
          (assignee as UpdateEquipmentAssigneeRequest["payload"]["assignee"]) ||
          null,
      },
    }).unwrap();
  }

  displaySuccessMessage(
    "Equipment updated successfully",
    "The equipment has been updated in the company roster.",
  );
  onSuccess();
};
