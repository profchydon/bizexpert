import { file_rounded_primary_100 } from "@/assets/icons";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

const SubscriptionTableColumn = (
  action: (item: Record<string, string>) => void,
): readonly ColumnDef<Record<string, any>>[] => [
  {
    header: "Invoice",
    accessorKey: "name",
    cell: ({ row }) => {
      return (
        <p className="flex flex-row items-center gap-3">
          <Image
            src={file_rounded_primary_100}
            alt="file_rounded_primary_100"
            width={40}
            height={40}
          />
          {row.getValue("name") || <Badge variant="red">Not available</Badge>}
        </p>
      );
    },
  },
  {
    header: "Billing date",
    accessorKey: "date",
    cell: ({ row }) => {
      return (
        <p>
          {row.getValue("date") || <Badge variant="red">Not available</Badge>}
        </p>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      return (
        <>
          {row.getValue("status") ? (
            <Badge className="bg-success-50 text-success-700">
              {row.getValue("status")}
            </Badge>
          ) : (
            <Badge variant="red">Not available</Badge>
          )}
        </>
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

export default SubscriptionTableColumn;
