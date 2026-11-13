import { Badge } from "@/components/ui/badge";
import { IDepartment } from "@/types/departments";
import { ColumnDef } from "@tanstack/react-table";

const DepartmentTableColumn = (
  action: (item: IDepartment) => void,
): readonly ColumnDef<IDepartment>[] => [
  {
    header: "Department Name",
    accessorKey: "name",
    cell: ({ row }) => {
      return (
        <p>
          {row.getValue("name") || <Badge variant="red">Not available</Badge>}
        </p>
      );
    },
  },
  {
    header: "Members (Total)",
    accessorKey: "total_members",
    cell: ({ row }) => {
      return (
        <p>
          {row.original.member_count ?? (
            <Badge variant="red">Not available</Badge>
          )}
        </p>
      );
    },
  },
  {
    header: "Asset Count",
    accessorKey: "asset_count",
    cell: ({ row }) => {
      return (
        <p>
          {row.original.asset_count || (
            <Badge variant="red">Not available</Badge>
          )}
        </p>
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

export default DepartmentTableColumn;
