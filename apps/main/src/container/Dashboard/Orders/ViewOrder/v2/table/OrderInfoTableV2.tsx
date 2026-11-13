import React from "react";
import {
  referenceNativeHeadCellClass,
  referenceNativeHeadRowClass,
  referenceTableShellClass,
} from "@/components/application/table/reference-table-classes";
import { ArrowDown, ChevronsUpDown, HelpCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import CustomTooltip from "@/components/CustomTooltip";
import { cn } from "@/lib/utils";
import { IOrder, ISubOrder } from "@/types/orders";
import { hasVerifiableAssetOrder } from "../../verificationUtils";
import { getSubOrders } from "../orderContentLines";
import { subOrderRecipientNoun } from "../subOrderIdentity";
import OrderInfoRowV2 from "./OrderInfoRowV2";
import OrderInfoTableHeader from "./OrderInfoTableHeader";
import { Button } from "@/components/ui/button";
import { subOrderCanCancel } from "@/utils/cancellationEligibility";
import OrderInfoTableDrawers from "./OrderInfoTableDrawers";
import OrderInfoTablePagination from "./OrderInfoTablePagination";
import useOrderInfoTableV2 from "./useOrderInfoTableV2";
import { getHeaders } from "./orderInfoHeaders";
import { getVerifyDisabledReason } from "./rowDisableReasons";

interface Props {
  order: IOrder;
  canUpdateSignature?: boolean;
  selectedRows: ISubOrder[];
  onSelectedRowsChange: (rows: ISubOrder[]) => void;
  onMakeSignatureRequired?: () => void;
  onRemoveSignatureRequired?: () => void;
  pendingVerificationCount?: number;
  onVerifyAddress?: (item: ISubOrder) => void;
  onVerifyAllPending?: () => void;
  onBulkCancel?: (suborderIds: string[]) => void;
  onCancelSubOrder?: (subOrder: ISubOrder) => void;
}

const OrderInfoTableV2: React.FC<Props> = (props) => {
  const { order, pendingVerificationCount = 0, onVerifyAddress } = props;
  const orders = getSubOrders(order);
  const table = useOrderInfoTableV2({
    order,
    orders,
    selectedRows: props.selectedRows,
    onSelectedRowsChange: props.onSelectedRowsChange,
  });

  const isOffboarding = order?.type === "offboarding";
  const windowNoun = isOffboarding ? "Pickup window" : "Delivery window";
  const headers = getHeaders(isOffboarding);
  const showWindow = table.hasWindow;
  const showSelect = !table.allStorageRows && orders.length > 0;
  const selectablePaged = table.pagedRows
    .map((entry) => entry.row)
    .filter(table.isRowSelectable);
  const allSelected =
    selectablePaged.length > 0 &&
    selectablePaged.every((row) => table.selectedIds.has(row.id));
  const selectedCancellable = props.selectedRows.filter((row) =>
    subOrderCanCancel(row),
  );

  return (
    <>
      <div
        className={`${referenceTableShellClass} flex min-w-0 flex-col ring-1 ring-gray-200 after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-gray-200 relative`}
      >
        <OrderInfoTableHeader
          employeeCount={orders.length}
          recipientNoun={subOrderRecipientNoun(orders, orders.length)}
          canUpdateSignature={props.canUpdateSignature}
          showMake={table.showMake}
          showRemove={table.showRemove}
          pendingVerificationCount={pendingVerificationCount}
          onMakeSignatureRequired={props.onMakeSignatureRequired}
          onRemoveSignatureRequired={props.onRemoveSignatureRequired}
          onVerifyAllPending={props.onVerifyAllPending}
        />

        {selectedCancellable.length > 0 && (
          <div className="flex items-center justify-between border-b border-gray-200 bg-primary-50 px-6 py-3">
            <span className="text-sm font-medium text-gray-700">
              {selectedCancellable.length} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              className="border-error-200 text-error-700"
              onClick={() =>
                props.onBulkCancel?.(
                  selectedCancellable
                    .map((row) => row.id)
                    .filter(Boolean) as string[],
                )
              }
              data-testid="orderinfotablev2-button"
            >
              Cancel sub-orders
            </Button>
          </div>
        )}

        <div className="min-w-0 overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className={referenceNativeHeadRowClass}>
                {showSelect && (
                  <th className="w-px px-6 py-3 text-left align-middle">
                    <span className="inline-flex">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={(value) =>
                          table.toggleSelectAll(!!value)
                        }
                        aria-label="Select all"
                        data-testid="orderinfotablev2-checkbox"
                      />
                    </span>
                  </th>
                )}
                {headers.map(({ id, label, help, sortKey }) => (
                  <th
                    key={id}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500"
                  >
                    <span className="inline-flex items-center gap-1">
                      {sortKey ? (
                        <button
                          type="button"
                          onClick={() => table.toggleSort(sortKey)}
                          className="inline-flex items-center gap-1 whitespace-nowrap hover:text-gray-700"
                        >
                          {label}
                          {table.sortKey === sortKey ? (
                            <ArrowDown
                              className={cn(
                                "size-3",
                                table.sortDir === "asc" && "rotate-180",
                              )}
                            />
                          ) : (
                            <ChevronsUpDown className="size-3 text-gray-400" />
                          )}
                        </button>
                      ) : (
                        <span className="whitespace-nowrap">{label}</span>
                      )}
                      {help && (
                        <CustomTooltip content={help}>
                          <HelpCircle className="size-3.5 cursor-default text-gray-400" />
                        </CustomTooltip>
                      )}
                    </span>
                  </th>
                ))}
                {showWindow && (
                  <th className="px-6 py-3 text-left text-xs font-semibold whitespace-nowrap text-gray-500">
                    {windowNoun}
                  </th>
                )}
                <th className="py-3 pr-6" />
              </tr>
            </thead>
            <tbody>
              {table.pagedRows.map(({ values, row }) => {
                const isPending =
                  row?.status?.toLowerCase() === "verification_pending";
                const hasVerifiableAddress = hasVerifiableAssetOrder(row);
                return (
                  <OrderInfoRowV2
                    key={values.id}
                    values={values}
                    showSelect={showSelect}
                    isSelectable={table.isRowSelectable(row)}
                    selectDisabledReason={table.getRowDisabledReason(row)}
                    isSelected={table.selectedIds.has(values.id)}
                    onToggleSelect={(checked) =>
                      table.toggleSelect(row, checked)
                    }
                    showAmount={!isOffboarding}
                    showActionType={isOffboarding}
                    showWindow={showWindow}
                    onView={() => table.setSubOrderDetail(row)}
                    onVerify={
                      isPending && onVerifyAddress
                        ? () => onVerifyAddress(row)
                        : undefined
                    }
                    verifyLabel="Verify address"
                    isVerifyDisabled={isPending && !hasVerifiableAddress}
                    verifyDisabledReason={getVerifyDisabledReason(
                      isPending,
                      hasVerifiableAddress,
                    )}
                    onCancelSubOrder={
                      subOrderCanCancel(row) && props.onCancelSubOrder
                        ? () => props.onCancelSubOrder?.(row)
                        : subOrderCanCancel(row)
                          ? () => table.setCancelSubOrder(row)
                          : undefined
                    }
                  />
                );
              })}
            </tbody>
          </table>
        </div>

        <OrderInfoTablePagination
          currentPage={table.currentPage}
          totalPages={table.totalPages}
          onPageChange={table.setPage}
        />
      </div>

      <OrderInfoTableDrawers
        order={order}
        subOrderDetail={table.subOrderDetail}
        setSubOrderDetail={table.setSubOrderDetail}
        asset={table.asset}
        setAsset={table.setAsset}
        cancelSubOrder={table.cancelSubOrder}
        setCancelSubOrder={table.setCancelSubOrder}
        onConfirmCancel={table.handleConfirmCancel}
        isCancelling={table.isCancelling}
      />
    </>
  );
};

export default OrderInfoTableV2;
