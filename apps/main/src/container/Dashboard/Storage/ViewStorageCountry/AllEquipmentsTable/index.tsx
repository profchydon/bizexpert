import React, { useEffect, useMemo, useState } from "react";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";
import EquipmentsTableColumn from "./tableColumn";
import EquipmentsTableColumnLegacy from "./tableColumnLegacy";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store";
import PageState from "@/components/PageState";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import EquipmentsTableActions from "./tableAction";
import { useGetInStorageEquipmentsByCountryQuery } from "@/api/baseQueries/companiesApi/equipmentsApi/getInStorageEquipmentsByCountry";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";
import {
  setRefreshDeviceItems,
  setRenewStorageItems,
  setStorageToEmployeeItems,
  updateSelectedEquipment,
} from "@/store/slices/equipEmployeeSlice";
import routes from "@/routes";
import displayErrorMessage from "@/utils/displayErrorMessage";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IRenewStorage } from "@/types/renewStorage";
import { useShouldDisableActionItem } from "@/hooks/useShouldDisableActionItem";
import { IRefreshDevice } from "@/types/refreshDevice";
import isArray from "lodash/isArray";
import { IEquipment } from "@/types/equipments";
import StoragedurationWithCollectionDate from "@/components/DeviceRefresh/StoragedurationWithCollectionDate";
import { IAssetRefreshList } from "@/types/assetRefresh";

const AllEquipment = () => {
  const param = useParams();
  const params = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const countryId = param.countryId as string;
  const equipmentId = params.get("item_id");
  const equipmentRenewId = params.get("r_id");
  const isDeviceRefreshInstance = Boolean(params.get("device-refresh"));
  const isDeviceRefreshSingleInstance = Boolean(params.get("single-instance"));

  const companyId = useWorkspaceCompanyId();

  const storageToEmployeeItems = useAppSelector(
    (state) => state.persistedReducers.equipEmployee.storageToEmployeeItems,
  );

  const renewStorageItems = useAppSelector(
    (state) => state.persistedReducers.equipEmployee.renewStorageItems,
  );

  const refreshDeviceItems = useAppSelector(
    (state) => state.persistedReducers.equipEmployee.refreshDeviceItems,
  );

  const deviceRefreshSelectedEquipment = useAppSelector(
    (state) => state.persistedReducers.equipEmployee?.selectedEquipment,
  );

  const { hideAssign, hideRenew } = useShouldDisableActionItem();
  const useLegacyTableColumns =
    isDeviceRefreshInstance || (renewStorageItems?.length ?? 0) > 0;

  // useEffect(()=>{
  //   dispatch(resetEquipEmployeeState());
  // },[])

  const { page, setPage } = useTablePageQuery();

  const {
    data: equipmentsByCountryRes,
    isLoading,
    isError,
  } = useGetInStorageEquipmentsByCountryQuery(
    {
      companyId: companyId!,
      countryId: countryId!,
      params: { page },
    },
    { skip: !countryId },
  );

  const equipments = equipmentsByCountryRes?.data?.data ?? [];
  const currentPage = equipmentsByCountryRes?.data?.current_page ?? 1;
  const lastPage = equipmentsByCountryRes?.data?.last_page ?? 1;

  const [selectedRows, setSelectedRows] = React.useState<any[]>([]);
  const [selectedExternalRows, setSelectedExternalRows] = useState<
    Record<string, boolean>
  >({});

  const [isStorageDurationOpen, setIsStorageDurationOpen] = useState(false);

  const [isStorageTimeOpen, setIsStorageTimeOpen] = useState(false);
  const toggleStorageTimeOpen = () => {
    setIsStorageTimeOpen(true);
  };

  const handleClearSelection = () => {
    setSelectedExternalRows({});
    setSelectedRows([]);
  };

  const buildTableColumns = useLegacyTableColumns
    ? EquipmentsTableColumnLegacy
    : EquipmentsTableColumn;

  const columns: any = useMemo(
    () =>
      buildTableColumns((item) => (
        <EquipmentsTableActions
          deviceRefreshSelectedEquipment={deviceRefreshSelectedEquipment}
          viewHref={`${routes.All_Equipments}/${item.id}`}
          onAssign={() => {
            router.push(`${routes.STORAGE}/${countryId}?item_id=${item.id}`);
          }}
          onRenew={() =>
            router.push(`${routes.STORAGE}/${countryId}?r_id=${item.id}`)
          }
          onDeviceRefreshAssign={() =>
            handleAddRefreshDeviceItems([item] as any)
          }
          isDeviceRefresh={isDeviceRefreshInstance}
        />
      )),
    [
      buildTableColumns,
      countryId,
      deviceRefreshSelectedEquipment,
      isDeviceRefreshInstance,
      router,
    ],
  );

  const handleAddItems = () => {
    const selectedRowsIds = selectedRows.map((data: any) => data.id);
    const storageItemsId = storageToEmployeeItems?.map((item) => item.id);

    const payload =
      equipments
        ?.filter((item: any) => selectedRowsIds.includes(item?.id))
        .map((data) => ({ ...data, actionType: "Transfer" })) ?? [];

    if (!equipmentId) {
      const newItems = payload.filter(
        (item) => !storageItemsId?.includes(item.id),
      );
      if (storageToEmployeeItems) {
        if (newItems.length > 0) {
          dispatch(
            setStorageToEmployeeItems([
              ...storageToEmployeeItems!,
              ...newItems,
            ]),
          );
          handleClearSelection();
          dispatch(setSelectedEmployees([]));
          displaySuccessMessage("Items added successfully!");
          // router.push(routes.STORAGE_SELECT_EMPLOYEES);
        }
      } else {
        dispatch(setStorageToEmployeeItems(payload));
        handleClearSelection();
        dispatch(setSelectedEmployees([]));
        displaySuccessMessage("Items added successfully!");
        // router.push(routes.STORAGE_SELECT_EMPLOYEES);
      }
    }

    if (equipmentId) {
      if (storageItemsId?.includes(equipmentId)) {
        return displayErrorMessage("Equipment has already been added");
      } else {
        dispatch(
          setStorageToEmployeeItems(
            [
              ...storageToEmployeeItems!,
              equipments?.find((item) => item.id === equipmentId)!,
            ].map((data) => ({ ...data, actionType: "Transfer" })),
          ),
        );
        dispatch(setSelectedEmployees([]));
        displaySuccessMessage("Item added successfully!");
        // router.push(routes.STORAGE_SELECT_EMPLOYEES);
      }
    }
  };

  const handleRenewItems = () => {
    const selectedRowsIds = selectedRows.map((data: any) => data.id);

    const payload =
      equipments
        ?.filter((item: any) => selectedRowsIds.includes(item?.id))
        .map((data) => ({ ...data, actionType: "Store" })) ??
      ([] as IRenewStorage[]);

    // Single item instance
    if (equipmentRenewId) {
      const itemToAdd = equipments?.find(
        (item) => item.id === equipmentRenewId,
      );
      if (!itemToAdd) return;

      const newItem = { ...itemToAdd, actionType: "Store" };

      if (Array.isArray(renewStorageItems)) {
        const alreadyExists = renewStorageItems.some(
          (item) => item.id === equipmentRenewId,
        );
        if (alreadyExists) {
          return displayErrorMessage("Equipment has already been added");
        }
        // @ts-ignore
        dispatch(setRenewStorageItems([...renewStorageItems, newItem]));
      } else if (
        typeof renewStorageItems === "object" &&
        renewStorageItems !== null
      ) {
        const allItems = Object.values(renewStorageItems).flat();
        const alreadyExists = allItems.some(
          // @ts-ignore
          (item) => item?.id === equipmentRenewId,
        );
        if (alreadyExists) {
          return displayErrorMessage("Equipment has already been added");
        }

        const updated = {
          // @ts-ignore
          ...renewStorageItems,
          // @ts-ignore
          unassigned: [...(renewStorageItems?.unassigned ?? []), newItem],
        };

        dispatch(setRenewStorageItems(updated));
      } else {
        // @ts-ignore
        dispatch(setRenewStorageItems(newItem));
      }

      toggleStorageTimeOpen();
      return;
    }

    // Multiple instance
    const payloadIds = payload.map((item) => item.id);

    if (Array.isArray(renewStorageItems)) {
      const existingIds = renewStorageItems.map((item) => item.id);
      const newItems = payload.filter((item) => !existingIds.includes(item.id));

      if (renewStorageItems?.length > 0 && newItems?.length > 0) {
        // @ts-ignore
        dispatch(setRenewStorageItems([...renewStorageItems, ...newItems]));
      } else if (renewStorageItems?.length === 0) {
        // @ts-ignore
        dispatch(setRenewStorageItems(payload));
      }
    } else if (
      typeof renewStorageItems === "object" &&
      renewStorageItems !== null
    ) {
      const allItems = Object.values(renewStorageItems).flat();
      // @ts-ignore
      const existingIds = allItems.map((item) => item?.id);
      const newItems = payload.filter((item) => !existingIds.includes(item.id));

      if (newItems.length > 0) {
        const updated = {
          // @ts-ignore
          ...renewStorageItems,
          // @ts-ignore
          unassigned: [...(renewStorageItems.unassigned ?? []), ...newItems],
        };

        dispatch(setRenewStorageItems(updated));
      }
    } else {
      // @ts-ignore
      dispatch(setRenewStorageItems(payload));
    }

    toggleStorageTimeOpen();
    handleClearSelection();
  };

  const handleAddRefreshDeviceItems = (item?: IEquipment[]) => {
    if (!item) {
      const totalItemQuantity = (selectedRows as any[])?.length;
      const totalEquipments = (
        deviceRefreshSelectedEquipment as IAssetRefreshList[]
      )?.length;

      if (totalItemQuantity > totalEquipments) {
        return displayErrorMessage(
          `You have selected ${totalItemQuantity} items, but only ${totalEquipments} equipment${totalEquipments > 1 ? "s are" : " is"} available.`,
        );
      }

      dispatch(setRefreshDeviceItems(selectedRows as any[]));
      if (!isDeviceRefreshSingleInstance) {
        router.push(
          `${routes?.ALL_EQUIPMENT_REFRESH_VIEW_ACTION}?device-refresh=true&flow-source=from_storage&ci=${countryId}`,
        );
      } else {
        setIsStorageDurationOpen(true);
      }

      handleClearSelection();
    } else {
      if (item && Array.isArray(item)) {
        dispatch(setRefreshDeviceItems(item as any[]));
        setIsStorageDurationOpen(true);
      }
    }
  };

  const handleNextActionToOrderSummary = () => {
    router.push(
      `${routes?.ALL_EQUIPMENT_REFRESH_ORDER_SUMMARY}?device-refresh=true&flow-source=from_storage&ci=${countryId}`,
    );
  };

  useEffect(() => {
    if (equipmentId) {
      handleAddItems();
      router.push(`${routes.STORAGE}/${countryId}`);
    }
  }, [equipmentId]);

  useEffect(() => {
    if (equipmentRenewId) {
      handleRenewItems();
      router.push(`${routes.STORAGE}/${countryId}`);
    }
  }, [equipmentRenewId]);

  return (
    <>
      <Card className="mt-6">
        <CardHeader className="p-4 border-b border-border-secondary flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-y-1">
            <h3 className="text-lg flex flex-row items-center gap-3 font-semibold text-gray-900">
              Equipment{" "}
              {equipments?.length && (
                <Badge
                  variant={"blue"}
                  className="empty:hidden text-primary-700 border border-primary-300"
                >
                  {equipments?.length} items
                </Badge>
              )}
            </h3>
            <span className="text-sm text-gray-600">
              See more information by hovering over an item.
            </span>
          </div>
          {selectedRows?.length !== 0 && (
            <div className="flex items-center gap-x-2">
              {!Boolean(isDeviceRefreshInstance) ? (
                <Button
                  variant={"outline"}
                  className="border border-primary-300 text-primary-700 text-sm hover:bg-primary-50"
                  onClick={() => {
                    handleAddItems();
                  }}
                  data-testid="allequipmentstable-button"
                  disabled={hideAssign}
                >
                  Assign
                </Button>
              ) : (
                <Button
                  variant={"outline"}
                  className="border border-primary-300 text-primary-700 text-sm hover:bg-primary-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    handleAddRefreshDeviceItems();
                  }}
                  disabled={hideAssign}
                  data-testid="allequipmentstable-button-2"
                >
                  Add Items
                </Button>
              )}

              {/* <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant={"outline"}
                      className="border border-primary-300 text-primary-700 text-sm hover:bg-primary-50"
                      data-testid="allequipmentstable-button-2"
                      onClick={() => {
                        handleRenewItems();
                      }}
                      disabled={hideRenew}
                    >
                      Renew
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={6}>
                    <p className="w-44">Renew all selected items here</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}
            </div>
          )}
        </CardHeader>
        <PageState isLoading={isLoading} isError={isError}>
          <CardContent className="px-0 pt-0 pb-2">
            <DataTable
              data={equipments ?? []}
              columns={columns}
              pagination={{
                currentPage,
                lastPage,
                onPageChange: (value) => setPage(value),
              }}
              externalRowSelection={selectedExternalRows}
              setSeletectedValue={setSelectedRows}
            ></DataTable>
          </CardContent>
        </PageState>
      </Card>
      <StoragedurationWithCollectionDate<IAssetRefreshList>
        isOpen={isStorageDurationOpen}
        onClose={() => setIsStorageDurationOpen(!isStorageDurationOpen)}
        title="Storage Duration"
        onNext={handleNextActionToOrderSummary}
        dataInstance={deviceRefreshSelectedEquipment as IAssetRefreshList[]}
        updateData={(data) => dispatch(updateSelectedEquipment(data))}
      />
    </>
  );
};

export default AllEquipment;
