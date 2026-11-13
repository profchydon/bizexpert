import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import useDepartment from "@/hooks/useDepartment";
import { removeUserscore } from "@/utils/underScoreTransformer";
import { ColumnDef } from "@tanstack/react-table";

const EmployeeTableColumn = (
  action: (item: Record<string, string>) => void,
): readonly ColumnDef<Record<string, any>>[] => [
  {
    header: "Name",
    accessorKey: "first_name",
    cell: ({ row }) => {
      return (
        <div className="flex fle-row items-start gap-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="text-gray-600 bg-gray-100">{`${row?.original?.first_name?.[0]} ${row?.original?.last_name?.[0]}`}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-gray-900 font-medium text-sm">{`${row?.original?.first_name} ${row?.original?.last_name}`}</p>
            <p className="text-gray-600 text-sm">
              {removeUserscore(row?.original?.employment_type ?? "")}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    header: "Level",
    accessorKey: "level",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <p className="text-gray-900 text-sm">
            {removeUserscore(row?.original?.level || "")}
          </p>
          <p className="text-gray-600 text-sm">
            {useDepartment()?.departmentById(
              row?.original?.departments?.[0]?.id || "",
            )}
          </p>
          {!row?.original?.level && !row?.original?.departments?.[0]?.id && (
            <p>
              <Badge variant="red">Not available</Badge>
            </p>
          )}
        </div>
      );
    },
  },
  {
    header: "Email address",
    accessorKey: "email",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <p className="text-gray-900 text-sm">{row?.original?.email}</p>
          <p className="text-gray-600 text-sm">{row?.original?.phone}</p>
        </div>
      );
    },
  },
  {
    header: "Address",
    accessorKey: "address",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <p className="text-gray-600 text-sm">
            {row?.getValue("address") || (
              <Badge variant="red">Not available</Badge>
            )}
          </p>
        </div>
      );
    },
  },
  // {
  //   header: "Status",
  //   accessorKey: "status",
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex flex-col">
  //         {Object.hasOwn(row?.original, "items") &&
  //         row?.original?.items?.length > 0 ? (
  //           <div className="w-fit">
  //             <Badge className="w-fit" variant="success">
  //               {row?.original?.items?.length} Items added
  //             </Badge>
  //           </div>
  //         ) : (
  //           <div className="w-fit">
  //             <Badge className="w-fit" variant="destructive">
  //               No items
  //             </Badge>
  //           </div>
  //         )}
  //       </div>
  //     );
  //   },
  // },

  {
    id: "action",
    cell: ({ row }) => {
      return <>{action(row?.original)}</>;
    },
  },
];

export default EmployeeTableColumn;
