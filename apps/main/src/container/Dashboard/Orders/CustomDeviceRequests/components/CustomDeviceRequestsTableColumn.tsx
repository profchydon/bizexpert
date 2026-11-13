import { ColumnDef } from "@tanstack/react-table";
import type { CustomDeviceRequest } from "../types";
import { calculateBudgetTotal, formatCurrency } from "../utils";
import CountryFlag from "./CountryFlag";
import RFQDeviceCount from "./RFQDeviceCount";
import StatusBadge from "./StatusBadge";

const CustomDeviceRequestsTableColumn = (
  action: (item: CustomDeviceRequest) => void,
): ColumnDef<CustomDeviceRequest>[] => [
  {
    header: "Request ID",
    accessorKey: "id",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900 text-sm">{row.original.id}</div>
    ),
  },
  {
    header: "Device(s)",
    accessorKey: "devices",
    cell: ({ row }) => <RFQDeviceCount devices={row.original.devices} />,
  },
  {
    header: "Budget",
    accessorKey: "requestBudget",
    cell: ({ row }) => {
      const budgetTotal = calculateBudgetTotal(row.original);
      return (
        <div className="text-sm text-gray-900">
          {budgetTotal
            ? formatCurrency(budgetTotal.total, row.original.currency)
            : "—"}
        </div>
      );
    },
  },
  {
    header: "Country",
    accessorKey: "country",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <CountryFlag
          country={row.original.country}
          code={row.original.countryCode}
        />
        <span className="text-sm text-gray-600">{row.original.country}</span>
      </div>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    header: "Quote",
    accessorKey: "requiredBudget",
    cell: ({ row }) => (
      <div className="text-sm text-gray-900">
        {row.original.requiredBudget
          ? formatCurrency(row.original.requiredBudget, row.original.currency)
          : "—"}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <button
        type="button"
        className="text-sm font-semibold text-primary-700 transition-colors hover:text-primary-800 hover:underline"
        onClick={() => action(row.original)}
      >
        View
      </button>
    ),
  },
];

export default CustomDeviceRequestsTableColumn;
