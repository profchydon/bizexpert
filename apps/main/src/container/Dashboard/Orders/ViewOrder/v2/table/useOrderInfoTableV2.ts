import { useMemo, useState } from "react";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";
import { useSearchParams } from "next/navigation";
import { IOrder, ISubOrder } from "@/types/orders";
import { IAsset } from "@/types/assets";
import { useOrderScopedCompanyId } from "@/hooks/useOrderScopedCompanyId";
import displayCancellationSuccess from "@/utils/displayCancellationSuccess";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { useCancelSubOrderMutation } from "@/api/baseQueries/companiesApi/ordersApi/cancelSubOrder";
import {
  deriveCancellationInfo,
  deriveCancellationView,
} from "../cancel/mapCancellationInfo";
import { collectPendingCancellationSubOrderIds } from "./subOrderCancellationStatus";
import {
  buildRowValues,
  getRowSignatureRequested,
  sortRowValues,
  type SortDir,
  type SortKey,
} from "./orderInfoRowValues";
import { getSelectDisabledReason } from "./rowDisableReasons";

const PAGE_SIZE = 10;

interface Params {
  order: IOrder;
  orders: ISubOrder[];
  selectedRows: ISubOrder[];
  onSelectedRowsChange: (rows: ISubOrder[]) => void;
}

const useOrderInfoTableV2 = ({
  order,
  orders,
  selectedRows,
  onSelectedRowsChange,
}: Params) => {
  const searchParams = useSearchParams();
  const signatureRequestedParam = searchParams?.get("signature_requested");
  const companyId = useOrderScopedCompanyId(order);
  const [cancelSubOrder, setCancelSubOrder] = useState<ISubOrder>();
  const [subOrderDetail, setSubOrderDetail] = useState<ISubOrder>();
  const [asset, setAsset] = useState<IAsset>();
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const { page, setPage } = useTablePageQuery("items_page");
  const [cancelMutation, { isLoading: isCancelling }] =
    useCancelSubOrderMutation();

  const getRowDisabledReason = (row: ISubOrder) =>
    getSelectDisabledReason(row, order);

  const isRowSelectable = (row: ISubOrder) =>
    getRowDisabledReason(row) === null;

  const selectedIds = useMemo(
    () => new Set(selectedRows.map((row) => row.id)),
    [selectedRows],
  );

  let filterMode: "required" | "not_required" | null = null;
  if (selectedRows.length > 0) {
    filterMode = getRowSignatureRequested(selectedRows[0], order?.type)
      ? "required"
      : "not_required";
  }

  const cancellationView = useMemo(
    () => (order ? deriveCancellationView(order) : "none"),
    [order],
  );
  const cancellationInfo = useMemo(
    () => (order ? deriveCancellationInfo(order) : null),
    [order],
  );
  const pendingSubOrderIds = useMemo(
    () =>
      order ? collectPendingCancellationSubOrderIds(order) : new Set<string>(),
    [order],
  );

  const allRows = useMemo(
    () =>
      (orders || []).map((row) => ({
        row,
        values: buildRowValues(row, order?.type, order?.currency || "", order, {
          cancellationView,
          cancellationInfo,
          pendingSubOrderIds,
        }),
      })),
    [orders, order, cancellationView, cancellationInfo, pendingSubOrderIds],
  );

  const hasWindow = allRows.some((entry) => Boolean(entry.values.window));

  const sortedRows = useMemo(() => {
    const values = sortRowValues(
      allRows.map((entry) => entry.values),
      sortKey,
      sortDir,
    );
    const byId = new Map(allRows.map((entry) => [entry.values.id, entry.row]));
    return values.map((v) => ({ values: v, row: byId.get(v.id)! }));
  }, [allRows, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedRows = sortedRows.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const toggleSelect = (row: ISubOrder, checked: boolean) => {
    const next = checked
      ? [...selectedRows, row]
      : selectedRows.filter((item) => item.id !== row.id);
    onSelectedRowsChange(next);
  };

  const toggleSelectAll = (checked: boolean) => {
    if (!checked) {
      onSelectedRowsChange([]);
      return;
    }
    onSelectedRowsChange(
      pagedRows.map((entry) => entry.row).filter(isRowSelectable),
    );
  };

  const allStorageRows =
    order?.type === "offboarding" &&
    (orders || []).length > 0 &&
    (orders || []).every((row) => row?.type === "storage");

  const showMake =
    signatureRequestedParam === "false"
      ? !allStorageRows
      : selectedRows.length > 0 && filterMode === "not_required";
  const showRemove =
    signatureRequestedParam === "true"
      ? true
      : selectedRows.length > 0 && filterMode === "required";

  const handleConfirmCancel = async (reason: string, details: string) => {
    try {
      await cancelMutation({
        companyId,
        orderId: order?.id,
        subOrderId: cancelSubOrder?.id,
        reason,
        additional_details: details,
      }).unwrap();
      setCancelSubOrder(undefined);
      displayCancellationSuccess();
    } catch (error) {
      displayErrorMessage(
        "Failed to cancel sub-order",
        (error as { data?: { message?: string } })?.data?.message ||
          "Something went wrong. Please try again.",
      );
    }
  };

  return {
    pagedRows,
    selectedIds,
    isRowSelectable,
    getRowDisabledReason,
    filterMode,
    sortKey,
    sortDir,
    toggleSort,
    toggleSelect,
    toggleSelectAll,
    currentPage,
    totalPages,
    setPage,
    showMake,
    showRemove,
    allStorageRows,
    hasWindow,
    subOrderDetail,
    setSubOrderDetail,
    asset,
    setAsset,
    cancelSubOrder,
    setCancelSubOrder,
    handleConfirmCancel,
    isCancelling,
  };
};

export default useOrderInfoTableV2;
