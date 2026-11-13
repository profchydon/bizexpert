"use client";

import { useState } from "react";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/Custom/Pagination";
import { useAddKitItemsMutation } from "@/api/baseQueries/companiesApi/kitsApi/addKitItems";
import { useDeleteKitItemMutation } from "@/api/baseQueries/companiesApi/kitsApi/deleteKitItem";
import { useUpdateKitItemMutation } from "@/api/baseQueries/companiesApi/kitsApi/updateKitItem";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import displayErrorMessage from "@/utils/displayErrorMessage";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import type { KitItem } from "../types";
import { extractKitErrorMessage } from "../utils";
import DevicePickerDialog from "./DevicePickerDialog";
import KitItemRow from "./KitItemRow";
import KitPill from "./KitPill";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

interface Props {
  kitId: string;
  items: KitItem[];
  isLoading?: boolean;
  currentPage?: number;
  lastPage?: number;
  onPageChange?: (page: number) => void;
}

const KitItemList = ({
  kitId,
  items,
  isLoading,
  currentPage = 1,
  lastPage = 1,
  onPageChange,
}: Props) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [busyItemId, setBusyItemId] = useState<string | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();

  const [addKitItems, { isLoading: isAdding }] = useAddKitItemsMutation();
  const [updateKitItem] = useUpdateKitItemMutation();
  const [deleteKitItem] = useDeleteKitItemMutation();

  const addItems = async (
    assetSpecificationIds: string[],
  ): Promise<boolean> => {
    if (!companyId || assetSpecificationIds.length === 0) return false;
    try {
      await addKitItems({
        companyId: companyId,
        kitId,
        payload: {
          items: assetSpecificationIds.map((id) => ({
            asset_specification_id: id,
            required: true,
            quantity: 1,
          })),
        },
      }).unwrap();
      displaySuccessMessage(
        assetSpecificationIds.length === 1 ? "Item added" : "Items added",
      );
      return true;
    } catch (error) {
      displayErrorMessage(
        extractKitErrorMessage(error, "Failed to add items to kit"),
      );
      return false;
    }
  };

  const handleUpdate = async (item: KitItem, updates: Partial<KitItem>) => {
    if (!companyId) return;
    try {
      setBusyItemId(item.id);
      await updateKitItem({
        companyId: companyId,
        kitId,
        itemId: item.id,
        payload: {
          required: updates.required ?? item.required,
          quantity: updates.quantity ?? item.quantity,
          ...(typeof updates.sort_order === "number"
            ? { sort_order: updates.sort_order }
            : {}),
        },
      }).unwrap();
    } catch (error) {
      displayErrorMessage(
        extractKitErrorMessage(error, "Failed to update item"),
      );
    } finally {
      setBusyItemId(null);
    }
  };

  const handleRemove = async (item: KitItem) => {
    if (!companyId) return;
    try {
      setDeletingItemId(item.id);
      await deleteKitItem({
        companyId: companyId,
        kitId,
        itemId: item.id,
      }).unwrap();
      displaySuccessMessage("Item removed");
    } catch (error) {
      displayErrorMessage(
        extractKitErrorMessage(error, "Failed to remove item"),
      );
    } finally {
      setDeletingItemId(null);
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-[0_1px_2px_rgba(10,13,18,0.05)]">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-900">Kit Items</h2>
          <KitPill tone="blue">
            {items.length} {items.length === 1 ? "item" : "items"}
          </KitPill>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setPickerOpen(true)}
          disabled={isAdding}
          data-testid="kititemlist-button"
        >
          <Plus className="size-4" /> Add Item
        </Button>
      </div>

      <div className="flex flex-col gap-2 p-5">
        {isLoading ? (
          <p className="py-10 text-center text-sm text-gray-500">
            Loading items...
          </p>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-lg py-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              <Package className="size-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold text-gray-900">
                No items yet
              </h3>
              <p className="text-sm text-gray-600">
                Add devices to build your kit.
              </p>
            </div>
            <Button
              size="sm"
              className="gap-2"
              onClick={() => setPickerOpen(true)}
              data-testid="kititemlist-button-2"
            >
              <Plus className="size-4" /> Add Item
            </Button>
          </div>
        ) : (
          items.map((item) => (
            <KitItemRow
              key={item.id}
              item={item}
              isUpdating={busyItemId === item.id}
              isDeleting={deletingItemId === item.id}
              onChange={(updates) => handleUpdate(item, updates)}
              onRemove={() => handleRemove(item)}
            />
          ))
        )}

        {onPageChange && lastPage > 1 && (
          <Pagination
            className="pt-2"
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={onPageChange}
          />
        )}
      </div>

      <DevicePickerDialog
        open={pickerOpen}
        kitId={kitId}
        alreadyAddedIds={items.map((item) => item.asset_specification_id)}
        onAdd={(ids) => addItems(ids)}
        onClose={() => setPickerOpen(false)}
      />
    </div>
  );
};

export default KitItemList;
