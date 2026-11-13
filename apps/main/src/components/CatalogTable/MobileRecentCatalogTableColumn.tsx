import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Check, RefreshCcw } from "lucide-react";
import { IOrder } from "@/types/orders";
import ReactCountryFlag from "react-country-flag";

const MobileRecentCatalogTableColumn = (
  action: (item: IOrder) => void,
): readonly ColumnDef<IOrder>[] => [
  {
    header: "Catalog name",
    accessorKey: "name",
    cell: ({ row }) => {
      return (
        <div className="font-medium text-gray-900">
          Marketing Manager Equipment
        </div>
      );
    },
  },

  {
    id: "action",
    cell: ({ row }) => {
      return <>{action(row?.original)}</>;
    },
  },
];

export default MobileRecentCatalogTableColumn;
