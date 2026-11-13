"use client";

import { useMemo, useState } from "react";
import type { Selection, SortDescriptor } from "react-aria-components";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge } from "@/components/base/badges/badges";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { IEquipment } from "@/types/equipments";
import type { Disposition } from "@/types/offboard";
import dayjs from "dayjs";
import {
  getDispositionDeviceIds,
  getSelectedRowCount,
  isDispositionEquipment,
} from "./employeeEquipmentSelection";
import EmployeeEquipmentSelectionBar from "./EmployeeEquipmentSelectionBar";
import EmployeeEquipmentTableRow from "./EmployeeEquipmentTableRow";
import EmployeeDetailTablePagination from "./EmployeeDetailTablePagination";
import { sortEmployeeDetailRows } from "./sortEmployeeDetailRows";
import { STICKY_ACTION_HEAD } from "./stickyActionColumn";
import { useEmployeeDetailTablePagination } from "./useEmployeeDetailTablePagination";
import { toast } from "sonner";

const columns = [
  { id: "title", label: "Equipment name", sortable: true },
  { id: "serial_number", label: "Serial number", sortable: true },
  { id: "specs", label: "RAM/Storage", sortable: false },
  { id: "purchase_date", label: "Purchase date", sortable: true },
  { id: "purchase_price", label: "Purchase price", sortable: true },
  { id: "country_code", label: "Country", sortable: true },
  { id: "status", label: "Status", sortable: true },
  { id: "refresh_status", label: "Refresh status", sortable: true },
  { id: "actions", label: "", sortable: false },
];

type Props = {
  equipments: IEquipment[];
  onEquipmentClick: (equipmentId: string) => void;
  onBulkDisposition: (disposition: Disposition, deviceIds: string[]) => void;
  pendingDisposition?: Disposition | null;
};

const getSortValue = (row: IEquipment, column: string) => {
  switch (column) {
    case "title":
      return row.title ?? "";
    case "serial_number":
      return row.serial_number ?? "";
    case "purchase_date":
      return row.purchase_date ? dayjs(row.purchase_date).valueOf() : 0;
    case "purchase_price":
      return Number(row.purchase_price ?? 0);
    case "country_code":
      return row.country ?? "";
    case "status":
      return row.status ?? "";
    case "refresh_status":
      return row.refresh_details?.refresh_status ?? "";
    default:
      return "";
  }
};

const EmployeeEquipmentTable = ({
  equipments,
  onEquipmentClick,
  onBulkDisposition,
  pendingDisposition = null,
}: Props) => {
  const [sort, setSort] = useState<SortDescriptor>({
    column: "",
    direction: "ascending",
  });
  const [selected, setSelected] = useState<Selection>(new Set());

  const rows = useMemo(
    () => sortEmployeeDetailRows(equipments, sort, getSortValue),
    [equipments, sort],
  );

  const paginationResetKey = `${sort.column}:${sort.direction}`;
  const { pageRows, currentPage, totalPages, showPagination, setPage } =
    useEmployeeDetailTablePagination(
      rows,
      paginationResetKey,
      "equipment_page",
    );

  const selectedCount = getSelectedRowCount(selected, rows);
  const selectedDeviceIds = getDispositionDeviceIds(rows, selected);
  const disabledKeys = useMemo(
    () =>
      rows.filter((row) => !isDispositionEquipment(row)).map((row) => row.id!),
    [rows],
  );

  const runBulkDisposition = (disposition: Disposition) => {
    if (selectedDeviceIds.length === 0) {
      toast.error("Select assigned equipment to reassign, store, or dispose.");
      return;
    }
    onBulkDisposition(disposition, selectedDeviceIds);
  };

  if (equipments.length === 0) {
    return (
      <TableCard.Root>
        <TableCard.Header
          title="Equipment"
          description="All equipment assigned to employee"
        />
        <div className="px-6 py-10 text-center text-sm text-tertiary">
          No equipment assigned to this employee.
        </div>
      </TableCard.Root>
    );
  }

  return (
    <TableCard.Root>
      {selectedCount > 0 ? (
        <EmployeeEquipmentSelectionBar
          count={selectedCount}
          canAction={selectedDeviceIds.length > 0}
          pendingDisposition={pendingDisposition}
          onClear={() => setSelected(new Set())}
          onAction={runBulkDisposition}
        />
      ) : (
        <TableCard.Header
          title="Equipment"
          description="All equipment assigned to employee"
          badge={
            <Tooltip
              title={`${equipments.length} device${equipments.length === 1 ? "" : "s"} linked to this employee.`}
              placement="top"
            >
              <TooltipTrigger className="cursor-default">
                <Badge color="brand" size="sm">
                  {equipments.length}
                </Badge>
              </TooltipTrigger>
            </Tooltip>
          }
        />
      )}
      <Table
        aria-label="Equipment"
        selectionMode="multiple"
        selectionBehavior="toggle"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        disabledKeys={disabledKeys}
        className="min-w-[1040px]"
        sortDescriptor={sort}
        onSortChange={setSort}
      >
        <Table.Header columns={columns}>
          {(column) => (
            <Table.Head
              id={column.id}
              label={column.label}
              allowsSorting={column.sortable}
              isRowHeader={column.id === "title"}
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
            <EmployeeEquipmentTableRow
              row={row}
              onEquipmentClick={onEquipmentClick}
              onBulkDisposition={onBulkDisposition}
              pendingDisposition={pendingDisposition}
            />
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

export default EmployeeEquipmentTable;
