"use client";

import { Package, SwitchHorizontal01 } from "@untitledui/icons";
import {
  getBulkActionDisabledReason,
  isBulkActionEligible,
} from "@/components/AllEquipments/equipmentBulkActionEligibility";
import { canPerformAction } from "@/components/AllEquipments/util";
import { useAppSelector } from "@/store";
import { IAssetRefreshList } from "@/types/assetRefresh";
import { DeviceRefreshActionType, Offboard_asset } from "@/types/offboarding";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { filterItemsByAction } from "@/components/Offboarding/util";
import {
  SelectionActionButton,
  SelectionActionGroup,
  toOffboardingList,
} from "./equipmentTableSelectionActionButton";

type Props = {
  selectedRows?: any[];
  multipleSelectBtnActions: {
    onTransfer: () => void;
    onStore: () => void;
    onSell: () => void;
    onDispose: () => void;
    onRefreshStore: () => void;
  };
  isDeviceRefreshEquipment?: boolean;
  isDeviceRefresh?: boolean;
};

const EquipmentTableSelectionActions = ({
  selectedRows = [],
  multipleSelectBtnActions,
  isDeviceRefreshEquipment,
  isDeviceRefresh,
}: Props) => {
  const offboardingData = useAppSelector(
    (state) => state.persistedReducers.offboarding,
  ) as Offboard_asset[] | Offboard_asset;

  const deviceRefreshSelectedEquipment = useAppSelector(
    (state) => state.persistedReducers.equipEmployee?.selectedEquipment,
  ) as IAssetRefreshList | IAssetRefreshList[];

  if (selectedRows.length === 0) return null;

  const isEquipmentsWithoutCountries = selectedRows.some(
    (data) => !data.country,
  );

  const canPerform = (action: "transfer" | "store" | "sell" | "dispose") => {
    if (action === "sell") {
      return selectedRows.every((item) =>
        canPerformAction(item.status ?? "", action),
      );
    }

    return selectedRows.every((item) =>
      isBulkActionEligible(item.status, action),
    );
  };

  const handleClick = (actionType: DeviceRefreshActionType | string) => {
    const ids = selectedRows.map((item) => item?.id) as string[];
    const actionMap: Record<string, (() => void) | undefined> = {
      Transfer: multipleSelectBtnActions.onTransfer,
      Store: multipleSelectBtnActions.onStore,
      Sale: multipleSelectBtnActions.onSell,
      Dispose: multipleSelectBtnActions.onDispose,
      RefreshStore: multipleSelectBtnActions.onRefreshStore,
    };

    const runAction = () => actionMap[actionType]?.();
    const isSingleDeviceRefresh =
      isDeviceRefreshEquipment &&
      isDeviceRefresh &&
      !Array.isArray(deviceRefreshSelectedEquipment);
    const isSingleOffboarding =
      !isDeviceRefreshEquipment &&
      !isDeviceRefresh &&
      !Array.isArray(offboardingData);

    if (isSingleDeviceRefresh || isSingleOffboarding) {
      runAction();
      return;
    }

    const items = toOffboardingList(offboardingData);
    const checkActionByType = filterItemsByAction(actionType, ids, items);
    if (!checkActionByType) {
      runAction();
      return;
    }

    displayErrorMessage(`${checkActionByType?.[0]} already has an action type`);
  };

  if (isEquipmentsWithoutCountries) {
    return (
      <p className="max-w-[40ch] text-sm font-medium text-error-primary">
        Some selected equipment does not have a country assigned. You cannot
        offboard equipment without specifying a country.
      </p>
    );
  }

  if (!isDeviceRefreshEquipment && !isDeviceRefresh) {
    const transferDisabled = !canPerform("transfer");
    const storeDisabled = !canPerform("store");

    return (
      <SelectionActionGroup>
        <SelectionActionButton
          isDisabled={transferDisabled}
          reason={getBulkActionDisabledReason(selectedRows, "transfer")}
          onPress={() => handleClick("Transfer")}
          testId="allequipmentstableheader-button"
          icon={SwitchHorizontal01}
          label="Reassign"
        />
        <SelectionActionButton
          isDisabled={storeDisabled}
          reason={getBulkActionDisabledReason(selectedRows, "store")}
          onPress={() => handleClick("Store")}
          testId="allequipmentstableheader-button-2"
          icon={Package}
          label="Store"
        />
      </SelectionActionGroup>
    );
  }

  if (isDeviceRefreshEquipment && isDeviceRefresh) {
    const disposeDisabled = !canPerform("dispose");
    const storeDisabled = !canPerform("store");

    return (
      <SelectionActionGroup>
        <SelectionActionButton
          isDisabled={disposeDisabled}
          reason={getBulkActionDisabledReason(selectedRows, "dispose")}
          onPress={() => handleClick("Dispose")}
          testId="allequipmentstableheader-button-3"
          icon={SwitchHorizontal01}
          label="Dispose"
        />
        <SelectionActionButton
          isDisabled={storeDisabled}
          reason={getBulkActionDisabledReason(selectedRows, "store")}
          onPress={() => handleClick("RefreshStore")}
          testId="allequipmentstableheader-button-4"
          icon={Package}
          label="Store"
        />
      </SelectionActionGroup>
    );
  }

  return null;
};

export default EquipmentTableSelectionActions;
