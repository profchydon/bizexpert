"use client";

import { useMemo, useState } from "react";
import type { SortDescriptor } from "react-aria-components";
import dayjs from "dayjs";
import { OrderStatusBadge } from "@/components/application/order-status/order-status-badge";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge } from "@/components/base/badges/badges";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import routes from "@/routes";
import { OrderFlowType } from "@/types/offboarding";
import { IOrder } from "@/types/orders";
import formatAmount from "@/utils/formatAmount";
import {
  EmployeeOrderTypeBadge,
  EmployeeSignatureBadge,
} from "./employeeDetailBadges";
import EmployeeOrderRowActions from "./EmployeeOrderRowActions";
import EmployeeDetailTablePagination from "./EmployeeDetailTablePagination";
import { STICKY_ACTION_CELL, STICKY_ACTION_HEAD } from "./stickyActionColumn";
import { mapApiOrderStatus } from "./mapApiOrderStatus";
import { sortEmployeeDetailRows } from "./sortEmployeeDetailRows";
import { useEmployeeDetailTablePagination } from "./useEmployeeDetailTablePagination";

const columns = [
  { id: "order_number", label: "Order ID", sortable: true },
  { id: "order_date", label: "Order date", sortable: true },
  { id: "status", label: "Order status", sortable: true },
  { id: "total_amount", label: "Total amount", sortable: true },
  { id: "type", label: "Type", sortable: true },
  { id: "signature_requested", label: "Signature", sortable: true },
  { id: "actions", label: "", sortable: false },
];

type Props = {
  orders: IOrder[];
};

const getSortValue = (row: IOrder, column: string) => {
  switch (column) {
    case "order_number":
      return row.order_number ?? "";
    case "order_date":
      return row.order_date ? dayjs(row.order_date).valueOf() : 0;
    case "status":
      return row.status ?? "";
    case "total_amount":
      return Number(row.total_amount ?? 0);
    case "type":
      return row.type ?? "";
    case "signature_requested":
      return String(
        (row as { signature_requested?: string }).signature_requested ?? "",
      );
    default:
      return "";
  }
};

const EmployeeOrdersTable = ({ orders }: Props) => {
  const [sort, setSort] = useState<SortDescriptor>({
    column: "",
    direction: "ascending",
  });

  const rows = useMemo(
    () => sortEmployeeDetailRows(orders, sort, getSortValue),
    [orders, sort],
  );

  const paginationResetKey = `${sort.column}:${sort.direction}`;
  const { pageRows, currentPage, totalPages, showPagination, setPage } =
    useEmployeeDetailTablePagination(rows, paginationResetKey, "orders_page");

  if (orders.length === 0) {
    return (
      <TableCard.Root>
        <TableCard.Header
          title="Orders"
          description="All orders for this employee"
        />
        <div className="px-6 py-10 text-center text-sm text-tertiary">
          No orders placed by this employee.
        </div>
      </TableCard.Root>
    );
  }

  return (
    <TableCard.Root>
      <TableCard.Header
        title="Orders"
        description="All orders for this employee"
        badge={
          <Tooltip
            title={`${orders.length} order${orders.length === 1 ? "" : "s"} for this employee.`}
            placement="top"
          >
            <TooltipTrigger className="cursor-default">
              <Badge color="brand" size="sm">
                {orders.length}
              </Badge>
            </TooltipTrigger>
          </Tooltip>
        }
      />
      <Table
        aria-label="Orders"
        className="min-w-[880px]"
        sortDescriptor={sort}
        onSortChange={setSort}
      >
        <Table.Header columns={columns}>
          {(column) => (
            <Table.Head
              id={column.id}
              label={column.label}
              allowsSorting={column.sortable}
              isRowHeader={column.id === "order_number"}
              align={column.id === "actions" ? "right" : "left"}
              className={
                column.id === "actions"
                  ? `${STICKY_ACTION_HEAD} max-w-32`
                  : undefined
              }
            />
          )}
        </Table.Header>
        <Table.Body items={pageRows}>
          {(row) => (
            <Table.Row id={row.id!}>
              <Table.Cell>
                <span className="font-medium text-primary">
                  {row.order_number}
                </span>
              </Table.Cell>
              <Table.Cell>
                {row.order_date
                  ? dayjs(row.order_date).format("MMM DD, YYYY")
                  : "—"}
              </Table.Cell>
              <Table.Cell>
                <OrderStatusBadge status={mapApiOrderStatus(row.status)} />
              </Table.Cell>
              <Table.Cell className="tabular-nums text-secondary">
                {(row as { currency?: string }).currency ?? ""}
                {formatAmount(row.total_amount)}
              </Table.Cell>
              <Table.Cell>
                <EmployeeOrderTypeBadge type={row.type as OrderFlowType} />
              </Table.Cell>
              <Table.Cell>
                <EmployeeSignatureBadge
                  signatureRequired={
                    (row as { signature_requested?: string })
                      .signature_requested
                  }
                />
              </Table.Cell>
              <Table.Cell className={STICKY_ACTION_CELL}>
                <EmployeeOrderRowActions
                  orderId={row.id!}
                  viewHref={`${routes.EQUIP_EMPLOYEE_ORDERS}/${row.id}`}
                />
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      {showPagination ? (
        <EmployeeDetailTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      ) : null}
    </TableCard.Root>
  );
};

export default EmployeeOrdersTable;
