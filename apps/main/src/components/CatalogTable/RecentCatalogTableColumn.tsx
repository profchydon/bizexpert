import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Check, RefreshCcw } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { ICatalog } from "@/types/catalog";
import truncate from "lodash/truncate";

const RecentCatalogTableColumn = (
  action: (item: ICatalog) => void,
): readonly ColumnDef<ICatalog>[] => [
  {
    header: "Catalog name",
    accessorKey: "name",
    cell: ({ row }) => {
      return (
        <div className="font-medium text-gray-900">
          {truncate(row?.original.name, { length: 20 })}
        </div>
      );
    },
  },
  {
    header: "Department",
    accessorKey: "department",
    cell: ({ row }) => {
      return (
        <div className="text-sm">
          {row?.original?.departments?.[0]?.name || (
            <Badge variant="pending">No department</Badge>
          )}
          {row?.original?.departments &&
            row?.original?.departments?.length > 1 && (
              <Badge variant="pending" className="border-none">
                +{row.original.departments.length - 1}
              </Badge>
            )}
        </div>
      );
    },
  },
  {
    header: "Level",
    accessorKey: "level",
    cell: ({ row }) => {
      return (
        <div className="text-sm">
          {row?.original?.levels?.[0]?.name || (
            <Badge variant="pending">No level</Badge>
          )}
          {row?.original?.levels && row?.original?.levels?.length > 1 && (
            <Badge variant="pending" className="border-none">
              +{row.original.levels.length - 1}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      return (
        <div>
          {row?.original.status === "inactive" && (
            <Badge variant="pending">Inactive</Badge>
          )}
          {row?.original.status === "active" && (
            <Badge variant="success">Active</Badge>
          )}
        </div>
      );
    },
  },
  {
    header: "Country",
    accessorKey: "country",
    cell: ({ row }) => {
      return (
        <div className="text-sm flex gap-x-3 items-center">
          <ReactCountryFlag
            countryCode={row?.original?.country?.code || ""}
            className=""
            svg
            style={{
              width: "20px",
              height: "20px",
            }}
          />
          <span>{row?.original?.country?.name}</span>
        </div>
      );
    },
  },

  {
    id: "action",
    cell: ({ row }) => {
      return action(row?.original);
    },
  },
];

export default RecentCatalogTableColumn;
