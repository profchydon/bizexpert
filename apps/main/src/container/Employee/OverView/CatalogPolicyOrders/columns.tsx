import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import type { EmployeeCatalogPolicyOrderRow } from "./utils";
import { getCatalogPolicyOrderStatusMeta } from "./status";
import {
  getCatalogPolicyOrderItemCount,
  getCatalogPolicyOrderItemDetails,
  getCatalogPolicyOrderQuantity,
  isRejectedCatalogPolicyOrder,
} from "./utils";

const CatalogPolicyOrderColumns = ({
  onViewRejectionReason,
}: {
  onViewRejectionReason?: (row: EmployeeCatalogPolicyOrderRow) => void;
} = {}): readonly ColumnDef<EmployeeCatalogPolicyOrderRow>[] => [
  {
    header: "Date requested",
    accessorKey: "created_at",
    cell: ({ row }) => (
      <div className="text-sm">
        {dayjs(row.original.created_at).format("MMM DD, YYYY")}
      </div>
    ),
  },
  {
    header: "Catalog policy",
    accessorKey: "catalogPolicyName",
    cell: ({ row }) => (
      <div className="text-sm font-medium text-primary-600">
        {row.original.catalogPolicyName}
      </div>
    ),
  },
  {
    header: "Item details",
    id: "itemDetails",
    cell: ({ row }) => <ItemDetailsCell row={row.original} />,
  },
  {
    header: "Items",
    accessorKey: "items",
    cell: ({ row }) => (
      <div className="text-sm">
        {getCatalogPolicyOrderItemCount(row.original)}
      </div>
    ),
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
    cell: ({ row }) => (
      <div className="text-sm">
        {getCatalogPolicyOrderQuantity(row.original)}
      </div>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => <StatusCell row={row.original} />,
  },
  {
    header: "",
    id: "actions",
    cell: ({ row }) =>
      isRejectedCatalogPolicyOrder(row.original) ? (
        <button
          type="button"
          className="text-sm font-semibold text-primary-700 hover:text-primary-800"
          onClick={() => onViewRejectionReason?.(row.original)}
        >
          View reason
        </button>
      ) : null,
  },
];

export default CatalogPolicyOrderColumns;

function StatusCell({ row }: { row: EmployeeCatalogPolicyOrderRow }) {
  const status = getCatalogPolicyOrderStatusMeta(row);
  return <Badge variant={status.variant}>{status.label}</Badge>;
}

function ItemDetailsCell({ row }: { row: EmployeeCatalogPolicyOrderRow }) {
  const details = getCatalogPolicyOrderItemDetails(row);
  if (!details.length) return <span className="text-sm text-gray-500">-</span>;
  const visible = details.slice(0, 2);
  const remaining = details.length - visible.length;

  return (
    <div className="flex max-w-[260px] flex-col gap-1 text-sm">
      {visible.map((item) => (
        <div key={item.id} className="min-w-0">
          <p className="truncate font-medium text-gray-900">{item.name}</p>
          <p className="truncate text-xs text-gray-500">
            {item.model ? `Model: ${item.model}` : "Model: -"}
          </p>
        </div>
      ))}
      {remaining > 0 ? (
        <span className="text-xs text-gray-500">+{remaining} more</span>
      ) : null}
    </div>
  );
}
