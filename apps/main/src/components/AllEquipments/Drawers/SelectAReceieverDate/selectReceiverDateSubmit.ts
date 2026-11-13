import { Offboard_asset } from "@/types/offboarding";

type BuildParams = {
  offboardingData: Offboard_asset | Offboard_asset[] | null;
  selectDate?: Date | string;
  equipID?: string | null;
  selectedRowIds: string[];
};

function buildCompletedStoreAsset(
  data: Pick<Offboard_asset, "id"> & Partial<Offboard_asset>,
  selectDate?: Date | string,
): Offboard_asset {
  return {
    ...data,
    collectionDate: selectDate,
    statusFlow: "Completed",
    actionType: data.actionType || "Store",
  } as Offboard_asset;
}

function buildFromSelectedRowIds(
  selectedRowIds: string[],
  selectDate?: Date | string,
) {
  return selectedRowIds.map((id) =>
    buildCompletedStoreAsset({ id }, selectDate),
  );
}

export function buildCollectionDateOffboardingUpdate({
  offboardingData,
  selectDate,
  equipID,
  selectedRowIds,
}: BuildParams) {
  if (!offboardingData) {
    if (selectedRowIds.length > 0) {
      return buildFromSelectedRowIds(selectedRowIds, selectDate);
    }

    if (equipID) {
      return buildCompletedStoreAsset({ id: equipID }, selectDate);
    }

    return [];
  }

  if (Array.isArray(offboardingData)) {
    if (selectedRowIds.length > 0) {
      return offboardingData.map((data) => {
        if (!data) return data;
        return selectedRowIds.includes(data.id)
          ? buildCompletedStoreAsset(data, selectDate)
          : data;
      });
    }

    return offboardingData.map((data) => {
      if (!data) return data;
      return data.id === equipID
        ? buildCompletedStoreAsset(data, selectDate)
        : data;
    });
  }

  return buildCompletedStoreAsset(offboardingData, selectDate);
}

export function getSelectReceiverDateRedirectPath(
  baseRoute: string | undefined,
  isEditable?: boolean,
) {
  if (!baseRoute) return undefined;
  return isEditable ? `${baseRoute}/view-actions` : baseRoute;
}
