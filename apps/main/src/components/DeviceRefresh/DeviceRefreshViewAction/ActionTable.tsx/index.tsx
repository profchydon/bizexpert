import { useAppDispatch, useAppSelector } from "@/store";
import { IAssetRefreshList } from "@/types/assetRefresh";
import React, { FC, useEffect, useMemo, useState } from "react";
import ViewTableActionsColumn from "./tableColumn";
import ViewTableActions from "./tableActions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageState from "@/components/PageState";
import { DataTable } from "@/components/ui/data-table";
import StorageDuration from "../../StorageDuration";
import {
  removeItemFromSelectedEquipmentById,
  removeSelectedEquipment,
  setSelectedEquipment,
  updateSelectedEquipment,
} from "@/store/slices/equipEmployeeSlice";
import { Button } from "@/components/ui/button";
import CollectionDate from "../../CollectionDate";
import { IRefreshDevice } from "@/types/refreshDevice";
import AddItems from "../../AddItems";

interface Props {
  data: IAssetRefreshList[];
  baseRoute: string;
  currentTab: string;
}
const DisposeActionTable: FC<Props> = ({ data, baseRoute, currentTab }) => {
  const dispatch = useAppDispatch();
  const [isStorageDurationOpen, setIsStorageDurationOpen] = useState(false);
  const [isCollectionDateOpen, setIsCollectionDateOpen] = useState(false);
  const [isAddItemsOpen, setIsAddItemsOpen] = useState(false);
  const [availabeDeviceItems, setAvailabeDeviceItems] = useState<
    IRefreshDevice[]
  >([]);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    undefined,
  );
  const [equipmentId, setEquipmentId] = useState<string | undefined>(undefined);
  const [getEquipmentName, setEquipmentName] = useState("");

  const refreshDeviceItems = useAppSelector(
    (state) => state.persistedReducers.equipEmployee.refreshDeviceItems,
  );

  const handleRemove = (id: string) => {
    dispatch(removeSelectedEquipment(id));
  };

  const handleOpenAddItem = (id: string) => {
    setIsAddItemsOpen(true);
    setEquipmentId(id);
  };

  const handleOpenRemoveItem = (equipmentId: string, itemId: string) => {
    dispatch(
      removeItemFromSelectedEquipmentById({
        equipmentId,
        itemId,
      }),
    );
  };

  const columns: any = useMemo(
    () =>
      ViewTableActionsColumn({
        handleActionClick: (item: Record<string, string>) => (
          <ViewTableActions
            onAddItem={() => {
              handleOpenAddItem(item?.id as string);
              setEquipmentName(item?.title);
            }}
            onRemoveItem={() =>
              handleOpenRemoveItem(
                item?.id as string,
                // @ts-ignore
                item?.items?.[0]?.asset?.id,
              )
            }
            onRemove={() => handleRemove(item?.id as string)}
            item={item}
          />
        ),
        showStorageDuration: currentTab !== "Dispose",
      }),
    [data, currentTab],
  );

  const assignItemsToSavedData = (
    itemList: any[],
    itemId: string,
    selectedItem: IRefreshDevice[],
  ) => {
    return itemList.map((item) => {
      if (item?.id === itemId) {
        return {
          ...item,
          items: [...(item?.items || []), ...selectedItem],
        };
      }
      return item;
    });
  };

  const handleAssign = () => {
    if (!data?.length || !selectedValue || !selectedValue.length) return;
    const selectedItem = availabeDeviceItems.find(
      (item) =>
        // @ts-ignore
        item?.specification?.id === selectedValue || item?.id === selectedValue,
    );

    if (!equipmentId || !selectedItem) return;

    // Assign selected item to the saved data
    const updatedWithItem = assignItemsToSavedData(data, equipmentId, [
      selectedItem,
    ]) as any;

    dispatch(setSelectedEquipment(updatedWithItem));

    // Reset state
    setSelectedValue(undefined);
    setIsAddItemsOpen(false);
  };

  useEffect(() => {
    const itemUsageMap = new Map<string, number>();

    // Count how many times each item/specification has been added
    data?.forEach((emp) => {
      emp.items?.forEach((item: any) => {
        const key = item?.specification?.id || item?.id;
        if (key) {
          itemUsageMap.set(key, (itemUsageMap.get(key) || 0) + 1);
        }
      });
    });

    const filtered = refreshDeviceItems?.filter((item) => {
      // @ts-ignore
      const key = item?.specification?.id || item?.id;
      const usedQty = itemUsageMap.get(key) || 0;
      // @ts-ignore
      const availableQty = item?.quantity || 1;
      return usedQty < availableQty;
    });

    setAvailabeDeviceItems(filtered as IRefreshDevice[]);
  }, [data, refreshDeviceItems]);

  return (
    <>
      <Card className="mt-6">
        <CardHeader className="p-2 border-b border-border-secondary flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-3">
            <p className="text-gray-900 text-lg font-semibold">Actions</p>
            <Badge variant="blue">{data?.length || 0} Action(s)</Badge>
          </div>
          <div className="flex flex-row items-center gap-3">
            <Button
              type="button"
              variant={currentTab !== "Dispose" ? "outline" : "primary"}
              onClick={() => setIsCollectionDateOpen(true)}
              className="!text-sm"
              data-testid="actiontable.tsx-button"
            >
              Add collection date
            </Button>
            {/* {currentTab !== "Dispose" && (
              <Button
                type="button"
                variant="primary"
                onClick={() => setIsStorageDurationOpen(true)}
                className="!text-sm"
                data-testid="actiontable.tsx-button-2"
              >
                Add Storage duration
              </Button>
            )} */}
          </div>
        </CardHeader>

        <PageState isLoading={false} isError={false}>
          <CardContent className="px-0 pt-0 pb-2">
            <>
              <DataTable data={data || []} columns={columns} />

              <StorageDuration<IAssetRefreshList>
                isOpen={isStorageDurationOpen}
                onClose={() => setIsStorageDurationOpen(!isStorageDurationOpen)}
                title="Storage Duration"
                dataInstance={
                  data?.filter(
                    (item) => item?.actionType === currentTab,
                  ) as IAssetRefreshList[]
                }
                updateData={(data) => dispatch(updateSelectedEquipment(data))}
              />
              <CollectionDate<IAssetRefreshList>
                isOpen={isCollectionDateOpen}
                onClose={() => setIsCollectionDateOpen(!isCollectionDateOpen)}
                data={
                  data?.filter(
                    (item) => item?.actionType === currentTab,
                  ) as IAssetRefreshList[]
                }
                updateData={(data) => dispatch(updateSelectedEquipment(data))}
              />

              <AddItems
                data={(availabeDeviceItems as any) ?? []}
                isOpen={isAddItemsOpen}
                onClose={() => {
                  setIsAddItemsOpen(false);
                  setEquipmentName("");
                }}
                onSave={handleAssign}
                selectedValue={selectedValue}
                handleSelection={setSelectedValue}
                name={getEquipmentName}
              />
            </>
          </CardContent>
        </PageState>
      </Card>
    </>
  );
};

export default DisposeActionTable;
