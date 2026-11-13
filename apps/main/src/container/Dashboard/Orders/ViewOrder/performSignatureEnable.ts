import routes from "@/routes";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { ISubOrder } from "@/types/orders";
import {
  SIGNATURE_ENABLED_MESSAGE,
  collectSignatureEmployeeIds,
} from "./signatureEmployeeIds";

export interface EnableDeps {
  companyId?: string;
  orderId: string;
  refetch: () => void;
  router: { replace: (url: string) => void };
  resetSelection: () => void;
  closeDialog: () => void;
}

export async function enableSignatureAtOrderLevel(
  addOrderSignature: (arg: any) => { unwrap: () => Promise<unknown> },
  deps: EnableDeps,
) {
  try {
    await addOrderSignature({
      companyId: deps.companyId,
      orderId: deps.orderId,
    }).unwrap();
    deps.closeDialog();
    deps.resetSelection();
    displaySuccessMessage(
      "Signature requirement enabled",
      SIGNATURE_ENABLED_MESSAGE,
    );
    deps.refetch();
    deps.router.replace(`${routes.ORDERS}/${deps.orderId}`);
  } catch (error: any) {
    displayErrorMessage(
      error?.data?.message || "Failed to update signature requirement",
    );
  }
}

export async function enableSignatureForRows(
  addSubOrderSignature: (arg: any) => { unwrap: () => Promise<unknown> },
  selectedRows: ISubOrder[],
  deps: EnableDeps,
) {
  const eligibleRows = selectedRows.filter((row) => row?.type !== "storage");
  if (eligibleRows.length === 0) {
    displayErrorMessage(
      "Signature requirement cannot be enabled for storage offboarding actions.",
    );
    return;
  }

  const { nonReassignEmployeeIds, reassignEmployeeIds } =
    collectSignatureEmployeeIds(eligibleRows, { storageFallback: true });

  if (nonReassignEmployeeIds.length === 0 && reassignEmployeeIds.length === 0) {
    displayErrorMessage("No valid employee IDs found in selected rows");
    return;
  }

  try {
    await addSubOrderSignature({
      companyId: deps.companyId,
      orderId: deps.orderId,
      employee_ids: nonReassignEmployeeIds,
    }).unwrap();
    if (reassignEmployeeIds.length > 0) {
      await addSubOrderSignature({
        companyId: deps.companyId,
        orderId: deps.orderId,
        employee_ids: reassignEmployeeIds,
      }).unwrap();
    }
    deps.closeDialog();
    deps.resetSelection();
    displaySuccessMessage(
      "Signature requirement enabled",
      SIGNATURE_ENABLED_MESSAGE,
    );
    deps.refetch();
  } catch (error: any) {
    displayErrorMessage(
      error?.data?.message || "Failed to update signature requirement",
    );
  }
}
