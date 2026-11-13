import type { Selection, SortDescriptor } from "react-aria-components";
import { Table } from "@/components/application/table/table";
import { STICKY_ACTION_HEAD } from "../utils/stickyActionColumn";
import type { RequestKind, StoredDevice } from "../types/storage";
import { StorageInventoryRow } from "./StorageInventoryRow";

const COLUMNS = [
  {
    id: "device",
    name: "Device",
    sortable: true,
    tooltip: "Device name and type.",
  },
  {
    id: "serial",
    name: "Serial",
    sortable: false,
    tooltip: "Manufacturer serial number.",
  },
  {
    id: "country",
    name: "Country",
    sortable: true,
    tooltip: "Country where the device is stored.",
  },
  {
    id: "entity",
    name: "Entity",
    sortable: true,
    tooltip: "The billing entity that owns this stored device.",
  },
  {
    id: "grade",
    name: "Grade",
    sortable: true,
    tooltip: "Condition grade from the latest device check.",
  },
  {
    id: "entry",
    name: "Entry date",
    sortable: true,
    tooltip: "When the device entered storage.",
  },
  {
    id: "source",
    name: "Source",
    sortable: false,
    tooltip: "How the device arrived in storage.",
  },
  {
    id: "status",
    name: "Status",
    sortable: true,
    tooltip: "Current storage status of the device.",
  },
  {
    id: "wipe",
    name: "Wipe",
    sortable: false,
    tooltip: "Data wipe status of the device.",
  },
  { id: "action", name: "", sortable: false, tooltip: undefined },
];

interface Props {
  rows: StoredDevice[];
  sort?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
  onOpen: (device: StoredDevice) => void;
  onAction: (kind: RequestKind, device: StoredDevice) => void;
  renderEmptyState: () => React.ReactNode;
  selectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
}

export function StorageInventoryTable({
  rows,
  sort,
  onSortChange,
  onOpen,
  onAction,
  renderEmptyState,
  selectedKeys,
  onSelectionChange,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <Table
        aria-label="Storage inventory"
        sortDescriptor={sort}
        onSortChange={onSortChange}
        selectionMode={onSelectionChange ? "multiple" : undefined}
        selectedKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
        className="min-w-[1280px] [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap"
      >
        <Table.Header columns={COLUMNS}>
          {(col) => (
            <Table.Head
              id={col.id}
              label={col.name}
              tooltip={col.tooltip}
              isRowHeader={col.id === "device"}
              allowsSorting={col.sortable}
              className={
                col.id === "action"
                  ? `${STICKY_ACTION_HEAD} max-w-20`
                  : undefined
              }
            />
          )}
        </Table.Header>
        <Table.Body items={rows} renderEmptyState={renderEmptyState}>
          {(device) => (
            <StorageInventoryRow
              device={device}
              onOpen={onOpen}
              onAction={onAction}
            />
          )}
        </Table.Body>
      </Table>
    </div>
  );
}
