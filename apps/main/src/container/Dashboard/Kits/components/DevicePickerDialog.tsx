"use client";
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetAssetCategoriesQuery } from "@/api/baseQueries/assetsApi/getAssetCategories";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { DeviceList, DevicePagination } from "./DevicePickerDeviceList";
import {
  DeviceCategoryTabs,
  DevicePickerFilters,
  DevicePickerFooter,
} from "./DevicePickerDialogParts";
import { useDevicePickerAssets } from "./useDevicePickerAssets";

interface Props {
  open: boolean;
  kitId: string;
  alreadyAddedIds: string[];
  onAdd: (
    assetSpecificationIds: string[],
  ) => boolean | void | Promise<boolean | void>;
  onClose: () => void;
}

const DevicePickerDialog = ({
  open,
  kitId,
  alreadyAddedIds,
  onAdd,
  onClose,
}: Props) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();

  useEffect(() => {
    setPage(1);
  }, [categoryId, debouncedSearch]);

  const { devices, isFetching, paginationMeta } = useDevicePickerAssets({
    categoryId,
    companyId: companyId,
    kitId,
    open,
    page,
    search: debouncedSearch,
  });

  const { data: categoriesResponse } = useGetAssetCategoriesQuery(undefined, {
    skip: !open,
  });

  const categories = useMemo(() => {
    const seen = new Set<string>();
    const remote = (categoriesResponse?.data ?? [])
      .filter((entry) => entry?.id && entry?.name)
      .filter((entry) => {
        const key = entry.name.trim().toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((entry) => ({ id: entry.id, name: entry.name }));
    return [{ id: null as string | null, name: "All" }, ...remote];
  }, [categoriesResponse]);

  useEffect(() => {
    if (!open) {
      setSelected([]);
      setSearch("");
      setCategoryId(null);
      setPage(1);
    }
  }, [open]);

  const resetAndClose = () => {
    setSelected([]);
    setSearch("");
    setCategoryId(null);
    setPage(1);
    onClose();
  };

  const toggle = (id: string) => {
    if (alreadyAddedIds.includes(id)) return;
    setSelected((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !next && resetAndClose()}
      data-testid="devicepickerdialog-dialog"
    >
      <DialogContent className="max-w-2xl gap-0 p-0" showCloseButton={false}>
        <DialogHeader className="flex-row items-center justify-between border-b border-gray-200 px-6 py-4">
          <DialogTitle>Add Devices</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={resetAndClose}
            data-testid="devicepickerdialog-button"
          >
            <X className="size-5" />
          </Button>
        </DialogHeader>
        <DevicePickerFilters search={search} onSearchChange={setSearch} />
        <DeviceCategoryTabs
          categories={categories}
          categoryId={categoryId}
          onSelect={setCategoryId}
        />
        <DeviceList
          alreadyAddedIds={alreadyAddedIds}
          devices={devices}
          isFetching={isFetching}
          selected={selected}
          onToggle={toggle}
        />
        <DevicePagination
          currentPage={paginationMeta.currentPage}
          lastPage={paginationMeta.lastPage}
          onPageChange={setPage}
        />
        <DevicePickerFooter
          selectedCount={selected.length}
          onCancel={resetAndClose}
          onAdd={async () => {
            const result = await onAdd(selected);
            if (result === false) return;
            resetAndClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DevicePickerDialog;
