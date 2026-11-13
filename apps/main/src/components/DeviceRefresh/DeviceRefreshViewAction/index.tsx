import ViewActions from "@/components/ViewActions";
import { useAppSelector } from "@/store";
import { IAssetRefreshList } from "@/types/assetRefresh";
import React, { useMemo } from "react";
import DisposeActionTable from "./ActionTable.tsx";
import Link from "next/link.js";
import { useSearchParams } from "next/navigation";
import routes from "@/routes";

const DeviceRefreshViewAction = () => {
  const params = useSearchParams();
  const flowSource = params.get("flow-source");
  const countryId = params.get("ci");

  const deviceRefreshSelectedEquipment = useAppSelector(
    (state) => state.persistedReducers.equipEmployee?.selectedEquipment,
  );

  const breadCrumbs = [
    <Link className="cursor-pointer" href={routes?.All_Equipments}>
      Device Refresh
    </Link>,
    <span className="text-primary-600">See actions</span>,
  ];

  const checkoutRoute = `${routes?.ALL_EQUIPMENT_REFRESH_ORDER_SUMMARY}?flow-source=${flowSource || ""}&ci=${countryId}&device-refresh=true`;

  const isCheckOutDisabled = useMemo(() => {
    if ((deviceRefreshSelectedEquipment as IAssetRefreshList[])?.length < 1)
      return true;

    return (deviceRefreshSelectedEquipment as IAssetRefreshList[])?.some(
      (item) => {
        const isDispose = (item?.actionType as any) === "Dispose";
        const isStore = item?.actionType === "Store";

        const hasItems = Array.isArray(item.items) && item.items.length > 0;
        const hasCollectionDate = !!item.collectionDate;
        const hasActionType = !!item.actionType;
        const hasStorageDuration = !!item.storageDuration;

        if (isDispose) {
          return !(hasItems && hasCollectionDate && hasActionType);
        }

        if (isStore) {
          return !(
            (hasItems && hasCollectionDate && hasActionType)
            // hasActionType &&
            // hasStorageDuration
          );
        }

        return true; // disable by default if actionType is unknown
      },
    );
  }, [deviceRefreshSelectedEquipment]);

  return (
    <ViewActions<IAssetRefreshList>
      data={deviceRefreshSelectedEquipment}
      {...(flowSource === "from_storage" && {
        previousRoute: `${routes?.STORAGE}/${countryId}?device-refresh=true`,
      })}
      baseRoute={routes?.All_Equipments as string}
      breadCrumbs={breadCrumbs}
      secondaryButtonText="Back"
      checkoutRoute={checkoutRoute}
      isCheckOutDisabled={isCheckOutDisabled}
      tabs={[
        {
          label: "Storage",
          value: "Store",
          component: DisposeActionTable,
        },
        {
          label: "Dispose",
          value: "Dispose",
          component: DisposeActionTable,
        },
      ]}
    />
  );
};

export default DeviceRefreshViewAction;
