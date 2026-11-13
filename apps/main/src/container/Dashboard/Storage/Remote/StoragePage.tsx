"use client";

import { useCallback, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FloatingAlert } from "@/components/application/alerts/floating-alert";
import { useScopedViewNavigation } from "@/hooks/useViewNavigation";
import { InventoryTab } from "./components/InventoryTab";
import { OrdersTab } from "./components/OrdersTab";
import { StorageOrderDetailSlideout } from "./components/StorageOrderDetailSlideout";
import { StoragePageHeader } from "./components/StoragePageHeader";
import { StoragePageTabList } from "./components/StoragePageTabList";
import { StoragePageActionDialogs } from "./StoragePageActionDialogs";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { useStorageWorkspace } from "./hooks/useStorageWorkspace";
import { useStorageInventory } from "./hooks/useStorageInventory";
import { useStorageOrdersCounts } from "./hooks/useStorageOrdersApi";
import { useStorageInventoryExport } from "./hooks/useStorageInventoryExport";
import { useStoragePageCartFlow } from "./hooks/useStoragePageCartFlow";
import { storageAppRoutes } from "./storageAppRoutes";
import type { StorageOrder, StoredDevice } from "./types/storage";
import { INITIAL_FILTERS } from "./types/storage";
import {
  DEFAULT_INVENTORY_EXPORT_SORT,
  type StorageInventoryExportContext,
} from "./types/inventoryExport";
import { inventoryFiltersFromSearchParams } from "./utils/inventoryFiltersFromSearchParams";

type TabKey = "inventory" | "orders" | "impact";
type AlertColor = "success" | "error" | "warning";
const NO_PERMISSION =
  "You don't have permission to request this. Ask an IT admin on your team.";

export default function StoragePage() {
  const { view, isViewLoading } = useScopedViewNavigation();
  const searchParams = useSearchParams();
  const { requests, summary } = useStorageInventory();
  const { activeCount: activeOrdersCount } = useStorageOrdersCounts();
  const { exportFilteredInventory, exportSelectedInventory, isExporting } =
    useStorageInventoryExport();
  const { plan, readOnly, importDisabledReason } = useStorageWorkspace();
  const online = useOnlineStatus();
  const initialTab = searchParams.get("tab");
  const initialInventoryFilters =
    inventoryFiltersFromSearchParams(searchParams);
  const resolvedTab: TabKey =
    initialTab === "orders" || initialTab === "requests"
      ? "orders"
      : "inventory";
  const [tab, setTab] = useState<TabKey>(resolvedTab);
  const [orderTarget, setOrderTarget] = useState<StorageOrder | null>(null);
  const [errored, setErrored] = useState(searchParams.get("error") === "1");
  const [alert, setAlert] = useState<{
    title: string;
    description: string;
    color?: AlertColor;
  } | null>(null);
  const inventoryExportCtxRef = useRef<StorageInventoryExportContext>({
    filters: INITIAL_FILTERS,
    sort: DEFAULT_INVENTORY_EXPORT_SORT,
  });

  const notify = (title: string, description: string, color?: AlertColor) =>
    setAlert({ title, description, color });
  const checkInProgress = (d: StoredDevice | null) =>
    !!d &&
    (d.status === "pending_check" ||
      requests.some(
        (r) =>
          r.kind === "device_check" &&
          r.status === "in_progress" &&
          r.serialNumber === d.serialNumber,
      ));
  const cartFlow = useStoragePageCartFlow({
    readOnly,
    notify,
    checkInProgress,
  });
  const onExportComplete = useCallback(
    () => notify("Export ready", "Storage inventory CSV downloaded."),
    [],
  );
  const handleInventoryExportContext = useCallback(
    (context: StorageInventoryExportContext) => {
      inventoryExportCtxRef.current = context;
    },
    [],
  );
  const handleHeaderExport = useCallback(async () => {
    const payload =
      tab === "inventory"
        ? inventoryExportCtxRef.current
        : {
            filters: INITIAL_FILTERS,
            sort: DEFAULT_INVENTORY_EXPORT_SORT,
          };
    const ok = await exportFilteredInventory(payload);
    if (ok) onExportComplete();
  }, [tab, exportFilteredInventory, onExportComplete]);

  const onImport = (key: string) => () => {
    if (readOnly) {
      notify("Read-only access", NO_PERMISSION, "warning");
      return;
    }
    view(storageAppRoutes.storageImport, key);
  };

  const tabItems = [
    { id: "inventory" as const, label: "Inventory" },
    { id: "orders" as const, label: `Orders (${activeOrdersCount})` },
    { id: "impact" as const, label: "Impact", comingSoon: true },
  ];

  return (
    <div className="pb-12 pt-6">
      <StoragePageHeader
        onExport={() => void handleHeaderExport()}
        exportLoading={isExporting}
        importDisabledReason={importDisabledReason}
      />
      {!online && (
        <div className="mt-4 rounded-lg bg-warning-secondary px-4 py-3 text-sm text-warning-primary">
          You&apos;re offline. We&apos;ll keep your details — reconnect and try
          again.
        </div>
      )}
      <div className="mt-6">
        <StoragePageTabList
          items={tabItems}
          selectedKey={tab}
          onSelectionChange={(next) => {
            setTab(next);
            const params = new URLSearchParams(window.location.search);
            if (next === "orders") params.set("tab", "orders");
            else params.delete("tab");
            const query = params.toString();
            const url = query
              ? `${window.location.pathname}?${query}`
              : window.location.pathname;
            window.history.replaceState(null, "", url);
          }}
        />
      </div>
      <div className="mt-6">
        {tab === "inventory" && (
          <InventoryTab
            summary={summary}
            plan={plan}
            readOnly={readOnly}
            forceError={errored}
            initialFilters={initialInventoryFilters}
            onAction={cartFlow.onAction}
            onBulkAction={cartFlow.onBulkAction}
            onImport={onImport("import-empty")}
            importLoading={isViewLoading("import-empty")}
            onRetry={() => setErrored(false)}
            exportSelectedInventory={exportSelectedInventory}
            isExporting={isExporting}
            onExportContextChange={handleInventoryExportContext}
            onExportComplete={onExportComplete}
          />
        )}
        {tab === "orders" && <OrdersTab onOpen={setOrderTarget} />}
      </div>
      <StoragePageActionDialogs
        bulk={cartFlow.bulk}
        checkInProgress={checkInProgress}
        checkTarget={cartFlow.checkTarget}
        deployTarget={cartFlow.deployTarget}
        disposeTarget={cartFlow.disposeTarget}
        onBulkClose={() => cartFlow.setBulk(null)}
        onBulkConfirm={cartFlow.handleBulkConfirm}
        onCheckClose={() => cartFlow.setCheckTarget(null)}
        onCheckConfirm={cartFlow.handleRequestCheck}
        checkSubmitError={cartFlow.cartActionError}
        onDeployClose={() => cartFlow.setDeployTarget(null)}
        onDeployConfirm={cartFlow.handleDeploy}
        onDisposeClose={() => cartFlow.setDisposeTarget(null)}
        onDisposeConfirm={cartFlow.handleDispose}
        onRequestBuyback={cartFlow.handleRequestBuyback}
        plan={plan}
        isCartPending={cartFlow.isCartPending}
      />
      <StorageOrderDetailSlideout
        order={orderTarget}
        isOpen={Boolean(orderTarget)}
        onClose={() => setOrderTarget(null)}
      />
      <FloatingAlert
        show={Boolean(alert)}
        color={alert?.color ?? "success"}
        title={alert?.title ?? ""}
        description={alert?.description}
        onDismiss={() => setAlert(null)}
      />
    </div>
  );
}
