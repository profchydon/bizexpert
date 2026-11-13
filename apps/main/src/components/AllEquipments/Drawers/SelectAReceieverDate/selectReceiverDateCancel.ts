import type { ReduxDispatch } from "@/store/store";
import { deleteOffboardingData } from "@/store/slices/offboardingSlice";
import { Offboard_asset } from "@/types/offboarding";
import { getSelectReceiverDateRedirectPath } from "./selectReceiverDateSubmit";

type CancelParams = {
  dispatch: ReduxDispatch;
  offboardingData: Offboard_asset | Offboard_asset[];
  equipID?: string | null;
  baseRoute?: string;
  isEditable?: boolean;
  setSelectedRows?: () => void;
  push: (path: string) => void;
};

export function cancelSelectReceiverDateFlow({
  dispatch,
  offboardingData,
  equipID,
  baseRoute,
  isEditable,
  setSelectedRows,
  push,
}: CancelParams) {
  const redirectPath = getSelectReceiverDateRedirectPath(baseRoute, isEditable);

  if (Array.isArray(offboardingData)) {
    if (equipID === "null" || !equipID) {
      offboardingData
        .filter((item) => item.statusFlow !== "Completed")
        .forEach((item) => dispatch(deleteOffboardingData(item.id)));

      setSelectedRows?.();
      if (redirectPath) push(redirectPath);
      return;
    }

    const itemToDelete = offboardingData.find((item) => item.id === equipID);
    if (itemToDelete && itemToDelete.statusFlow !== "Completed") {
      dispatch(deleteOffboardingData(equipID as string));
      if (redirectPath) push(redirectPath);
      return;
    }

    if (redirectPath) push(redirectPath);
    return;
  }

  if (
    offboardingData &&
    offboardingData.statusFlow !== "Completed" &&
    equipID
  ) {
    dispatch(deleteOffboardingData(equipID));
  }

  if (redirectPath) push(redirectPath);
}
