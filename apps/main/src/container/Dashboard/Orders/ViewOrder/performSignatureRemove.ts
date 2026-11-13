import routes from "@/routes";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { IOrder, ISubOrder } from "@/types/orders";
import { collectSignatureEmployeeIds } from "./signatureEmployeeIds";

const REMOVED_MESSAGE = "Signature requirement removed successfully.";

export interface RemoveDeps {
  companyId?: string;
  orderId: string;
  order?: IOrder;
  subOrders: ISubOrder[];
  refetch: () => void;
  router: { replace: (url: string) => void };
  resetSelection: () => void;
  closeDialog: () => void;
}

type Mutation = (arg: any) => { unwrap: () => Promise<unknown> };

export async function removeSignatureAtOrderLevel(
  removeOrderSignature: Mutation,
  deps: RemoveDeps,
) {
  const hasStorageSubOrders =
    deps.order?.type === "offboarding" &&
    deps.subOrders.some((sub) => sub?.type === "storage");
  if (hasStorageSubOrders) {
    displayErrorMessage(
      "Signature requirement cannot be removed for storage offboarding actions.",
    );
    deps.closeDialog();
    return;
  }
  await removeOrderSignature({
    companyId: deps.companyId,
    orderId: deps.orderId,
  }).unwrap();
  deps.closeDialog();
  deps.resetSelection();
  displaySuccessMessage(REMOVED_MESSAGE);
  deps.refetch();
  deps.router.replace(`${routes.ORDERS}/${deps.orderId}`);
}

export async function removeSignatureForRows(
  removeSubOrderSignature: Mutation,
  selectedRows: ISubOrder[],
  deps: RemoveDeps,
) {
  const eligibleRows = selectedRows.filter((row) => row?.type !== "storage");
  if (eligibleRows.length === 0) {
    displayErrorMessage(
      "Signature requirement cannot be removed for storage offboarding actions.",
    );
    return;
  }

  const { nonReassignEmployeeIds, reassignEmployeeIds } =
    collectSignatureEmployeeIds(eligibleRows);

  if (nonReassignEmployeeIds.length === 0 && reassignEmployeeIds.length === 0) {
    displayErrorMessage("No valid employee IDs found in selected rows");
    return;
  }

  await removeSubOrderSignature({
    companyId: deps.companyId,
    orderId: deps.orderId,
    employee_ids: nonReassignEmployeeIds,
  }).unwrap();
  if (reassignEmployeeIds.length > 0) {
    await removeSubOrderSignature({
      companyId: deps.companyId,
      orderId: deps.orderId,
      employee_ids: reassignEmployeeIds,
    }).unwrap();
  }
  deps.closeDialog();
  deps.resetSelection();
  displaySuccessMessage(REMOVED_MESSAGE);
  deps.refetch();
}
