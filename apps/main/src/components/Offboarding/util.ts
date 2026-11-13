import {
  ActionType,
  Offboard_asset,
  assetActionType,
} from "@/types/offboarding";
import type { ReduxDispatch } from "@/store";
import { deleteOffboardingData } from "@/store/slices/offboardingSlice";

export {
  transformDataForOffboardingFee,
  transformDataForOffboardingPayment,
  getIdObject,
} from "./offboardingPayload";

export const getOffboardActionLabel = (
  actionType: ActionType,
  isEmployeeOffboarding: boolean,
): string | undefined =>
  isEmployeeOffboarding && actionType === "Archive"
    ? "Dispose"
    : assetActionType[actionType]?.label;

export const filterItemsByAction = (
  actionType: string,
  ids: string[],
  items: Offboard_asset[],
): string[] | null => {
  const filteredTitles = items
    .filter(
      (item) => ids?.includes(item?.id) && item?.actionType !== actionType,
    )
    .map((item) => item.title);

  return filteredTitles?.length > 0 ? filteredTitles : null;
};

export const removeItemsNotCompleted = (
  offboardingData: Offboard_asset[] | Offboard_asset,
  dispatch: ReduxDispatch,
) => {
  if (Array.isArray(offboardingData)) {
    const itemsToDelete = offboardingData.filter(
      (item) => item?.statusFlow !== "Completed",
    );

    itemsToDelete.forEach((item) => {
      dispatch(deleteOffboardingData(item.id));
    });
  } else {
    if (offboardingData?.statusFlow !== "Completed") {
      dispatch(deleteOffboardingData(offboardingData?.id));
    }
  }
};

export const getActionType = (
  offboardingData: Offboard_asset | Offboard_asset[],
  equipID: string,
): ActionType | null => {
  if (Array.isArray(offboardingData)) {
    if (equipID !== "null" || equipID) {
      const offboardingItem = offboardingData.find(
        (item) => item?.id === equipID,
      );

      if (offboardingItem) {
        return offboardingItem?.actionType as ActionType;
      }
    }
  }
  // @ts-ignore
  if (offboardingData && offboardingData?.actionType && equipID) {
    // @ts-ignore
    return offboardingData?.actionType as ActionType;
  }

  return null;
};
export const getActionStatusFlow = (
  offboardingData: Offboard_asset | Offboard_asset[],
  equipID: string,
): "Completed" | null => {
  if (Array.isArray(offboardingData)) {
    if (equipID !== "null" || equipID) {
      const offboardingItem = offboardingData.find(
        (item) => item?.id === equipID,
      );

      if (offboardingItem) {
        return offboardingItem?.statusFlow as "Completed";
      }
    }
  }
  // @ts-ignore
  if (offboardingData && offboardingData?.statusFlowe && equipID) {
    // @ts-ignore
    return offboardingData?.statusFlow as "Completed";
  }

  return null;
};
