"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Selection, SortDescriptor } from "react-aria-components";
import { useSessionPersistedState } from "@/hooks/useSessionPersistedState";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";
import {
  type DeviceActionKind,
  availableActions,
  devicesForBulkAction,
} from "../data/deviceActions";
import type { CustomerPlan } from "../data/plans";
import { useStorageInventoryApi } from "../hooks/useStorageInventoryApi";
import type { StorageSummary } from "../hooks/useStorageInventory";
import type { StorageInventoryExportContext } from "../types/inventoryExport";
import {
  type DeviceType,
  INITIAL_FILTERS,
  type InventoryFilters,
  type RequestKind,
  type StorageStatus,
  type StoredDevice,
} from "../types/storage";
import { buildRecommendations } from "../utils/recommendations";
import { STORAGE_INVENTORY_PAGE_SIZE } from "../constants/inventoryPagination";

interface Input {
  summary: StorageSummary;
  plan: CustomerPlan;
  readOnly?: boolean;
  forceError?: boolean;
  initialFilters?: InventoryFilters;
  onAction: (kind: RequestKind, device: StoredDevice) => void;
  onBulkAction?: (kind: DeviceActionKind, devices: StoredDevice[]) => void;
  exportSelectedInventory: (equipmentIds: string[]) => Promise<boolean>;
  isExporting: boolean;
  onExportContextChange?: (context: StorageInventoryExportContext) => void;
  onExportComplete?: () => void;
}

export function useInventoryTabController({
  summary,
  plan,
  readOnly,
  forceError,
  initialFilters = INITIAL_FILTERS,
  onAction,
  onBulkAction,
  exportSelectedInventory,
  isExporting,
  onExportContextChange,
  onExportComplete,
}: Input) {
  const [dismissed, setDismissed] = useSessionPersistedState<string[]>(
    "rr-storage-dismissed-recs-v1",
    [],
  );
  const [filters, setFilters] = useState<InventoryFilters>(initialFilters);
  const [sort, setSort] = useState<SortDescriptor>({
    column: "entry",
    direction: "descending",
  });
  const { page, setPage } = useTablePageQuery();
  const [pageSize, setPageSize] = useState(STORAGE_INVENTORY_PAGE_SIZE);
  const [target, setTarget] = useState<StoredDevice | null>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const api = useStorageInventoryApi({ filters, sort, page, pageSize });
  const onExportCompleteRef = useRef(onExportComplete);
  onExportCompleteRef.current = onExportComplete;

  useEffect(() => {
    onExportContextChange?.({ filters, sort });
  }, [filters, sort, onExportContextChange]);

  const exportSelection = useCallback(
    async (ids: string[]) => {
      const ok = await exportSelectedInventory(ids);
      if (ok) onExportCompleteRef.current?.();
    },
    [exportSelectedInventory],
  );

  const recs = useMemo(
    () =>
      buildRecommendations(api.devices, plan).filter(
        (r) => !dismissed.includes(r.id),
      ),
    [api.devices, plan, dismissed],
  );

  useEffect(() => setSelected(new Set()), [filters, sort, page, pageSize]);

  const patch = (p: Partial<InventoryFilters>) => {
    setFilters((f) => ({ ...f, ...p }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setPage(1);
  };

  const applySelection = (scopeIds: string[], keys: Selection) =>
    setSelected((prev) => {
      const scope = new Set(scopeIds);
      const picked =
        keys === "all"
          ? scope
          : new Set([...keys].map(String).filter((id) => scope.has(id)));
      const next = new Set([...prev].filter((id) => !scope.has(id)));
      picked.forEach((id) => next.add(id));
      return next;
    });

  const visibleRows = filters.grouped ? api.devices : api.devices;
  const selectedRows = visibleRows.filter((d) => selected.has(d.id));
  const eligible = selectedRows.filter((d) => availableActions(d).length > 0);
  const bulkKinds = (
    ["deployment", "device_check", "disposal"] as DeviceActionKind[]
  ).filter((kind) =>
    selectedRows.some((device) => availableActions(device).includes(kind)),
  );

  const mergedSummary: StorageSummary = {
    ...summary,
    total: api.overview.totalCount,
    countries: api.overview.countries,
    topCountry: api.overview.topCountry,
    pendingAction: api.overview.needsActionCount,
  };

  return {
    dismissed,
    setDismissed,
    filters,
    sort,
    page,
    pageSize,
    target,
    open,
    selected,
    setSelected,
    clearSelection: () => setSelected(new Set()),
    api,
    recs,
    mergedSummary,
    readOnly,
    forceError,
    onAction,
    onBulkAction,
    patch,
    clearFilters,
    applySelection,
    setSort: (d: SortDescriptor) => {
      setSort(d);
      setPage(1);
    },
    setPage,
    setPageSize: (s: number) => {
      setPageSize(s);
      setPage(1);
    },
    openDevice: (d: StoredDevice) => {
      setTarget(d);
      setOpen(true);
    },
    closeDrawer: () => setOpen(false),
    selectStatus: (status: StorageStatus) => patch({ status, grouped: false }),
    selectDeviceType: (deviceType: DeviceType) =>
      patch({ deviceType, grouped: false }),
    selectCountry: (countryId: string, countryName: string) =>
      patch({ countryId, country: countryName, grouped: false }),
    visibleRows,
    selectedRows,
    eligible,
    bulkKinds,
    runBulk: (kind: DeviceActionKind) =>
      onBulkAction?.(kind, devicesForBulkAction(selectedRows, kind)),
    exportSelection,
    isExporting,
  };
}
