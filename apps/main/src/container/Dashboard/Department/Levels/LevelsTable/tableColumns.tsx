import { Badge } from "@/components/ui/badge";
import { ILevel } from "@/types/departments";
import { ColumnDef } from "@tanstack/react-table";

const LevelTableColumn = (
  action: (item: ILevel) => void,
): readonly ColumnDef<ILevel>[] => [
  {
    header: "Level Name",
    accessorKey: "name",
    cell: ({ row }) => {
      return (
        <h1 className="font-semibold">
          {row.getValue("name") || <Badge variant="red">Not available</Badge>}
        </h1>
      );
    },
  },
  {
    header: "Members (Total)",
    accessorKey: "total_members",
    cell: ({ row }) => {
      return (
        <p>
          {row.original.member_count || (
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

export default LevelTableColumn;
