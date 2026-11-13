"use client";

import PageState from "@/components/PageState";
import { TablePaginationFooter } from "@/components/application/pagination/table-pagination-footer";
import { TableCard } from "@/components/application/table/table";
import { type DeviceActionKind } from "../data/deviceActions";
import type { CustomerPlan } from "../data/plans";
import { useInventoryTabController } from "../hooks/useInventoryTabController";
import type { StorageSummary } from "../hooks/useStorageInventory";
import type { StorageInventoryExportContext } from "../types/inventoryExport";
import type { RequestKind, StoredDevice } from "../types/storage";
import { STORAGE_INVENTORY_PAGE_SIZES } from "../constants/inventoryPagination";
import { DeviceDetailDrawer } from "./DeviceDetailDrawer";
import { StorageBulkBar } from "./StorageBulkBar";
import {
  LoadErrorState,
  NoDevicesState,
  NoMatchesState,
} from "./StorageEmptyStates";
import { StorageInventoryTable } from "./StorageInventoryTable";
import { StorageOverview } from "./StorageOverview";
import { StorageToolbar } from "./StorageToolbar";
import { RecCollapsibleLayout } from "./recommendations/RecCollapsibleLayout";

interface Props {
  summary: StorageSummary;
  plan: CustomerPlan;
  readOnly?: boolean;
  forceError?: boolean;
  initialFilters?: import("../types/storage").InventoryFilters;
  onAction: (kind: RequestKind, device: StoredDevice) => void;
  onBulkAction?: (kind: DeviceActionKind, devices: StoredDevice[]) => void;
  onImport: () => void;
  importLoading?: boolean;
  onRetry: () => void;
  exportSelectedInventory: (equipmentIds: string[]) => Promise<boolean>;
  isExporting: boolean;
  onExportContextChange?: (context: StorageInventoryExportContext) => void;
  onExportComplete?: () => void;
}

export function InventoryTab(props: Props) {
  const c = useInventoryTabController(props);
  const { api } = c;
  const showError = props.forceError || api.isError;
  const isEmpty =
    !api.isLoading &&
    !api.isOverviewLoading &&
    !showError &&
    api.overview.totalCount === 0;

  if (isEmpty) {
    return (
      <NoDevicesState
        onImport={props.onImport}
        importLoading={props.importLoading}
      />
    );
  }

  const tableBody = () => {
    if (showError)
      return (
        <LoadErrorState
          onRetry={() => {
            props.onRetry();
            void api.refetch();
          }}
        />
      );
    if (api.isLoading) {
      return (
        <PageState isLoading isError={false}>
          <span />
        </PageState>
      );
    }
    if (c.visibleRows.length === 0) {
      return <NoMatchesState onClear={c.clearFilters} />;
    }
    return (
      <StorageInventoryTable
        rows={c.visibleRows}
        sort={c.sort}
        onSortChange={c.setSort}
        onOpen={c.openDevice}
        onAction={c.onAction}
        renderEmptyState={() => <NoMatchesState onClear={c.clearFilters} />}
        selectedKeys={c.selected}
        onSelectionChange={(keys) =>
          c.applySelection(
            c.visibleRows.map((d) => d.id),
            keys,
          )
        }
      />
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <RecCollapsibleLayout
        recommendations={c.recs}
        readOnly={c.readOnly}
        onAction={c.onAction}
        onView={c.openDevice}
        onDismiss={(id) => c.setDismissed([...c.dismissed, id])}
      />
      <StorageOverview
        overview={api.overview}
        onSelectStatus={c.selectStatus}
        onSelectDeviceType={c.selectDeviceType}
        onSelectCountry={c.selectCountry}
        onPendingClick={() => c.patch({ needsAction: true, status: "all" })}
      />
      <TableCard.Root className="overflow-visible">
        <TableCard.Header
          title="Inventory"
          badge={
            <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 ring-1 ring-brand-200 ring-inset">
              {api.pagination.total}
            </span>
          }
        />
        <StorageToolbar
          filters={c.filters}
          countryOptions={api.countryOptions}
          deviceTypes={api.deviceTypes}
          onChange={c.patch}
          onClearAll={c.clearFilters}
        />
        {c.selectedRows.length > 0 && (
          <StorageBulkBar
            count={c.selectedRows.length}
            actionableCount={c.eligible.length}
            kinds={c.bulkKinds}
            onAction={c.runBulk}
            onExport={() =>
              void c.exportSelection(c.selectedRows.map((d) => d.id))
            }
            exportLoading={c.isExporting}
            onClear={c.clearSelection}
          />
        )}
        {tableBody()}
        {api.pagination.total > 0 && (
          <TablePaginationFooter
            currentPage={c.page}
            itemsPerPage={c.pageSize}
            totalItems={api.pagination.total}
            totalPages={api.pagination.lastPage}
            onPageChange={c.setPage}
            onPageSizeChange={c.setPageSize}
            pageSizeOptions={[...STORAGE_INVENTORY_PAGE_SIZES]}
          />
        )}
      </TableCard.Root>
      <DeviceDetailDrawer
        device={c.target}
        isOpen={c.open}
        onClose={c.closeDrawer}
        onAction={c.onAction}
      />
    </div>
  );
}
