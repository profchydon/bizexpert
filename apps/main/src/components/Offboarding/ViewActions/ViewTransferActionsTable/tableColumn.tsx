import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { SafeImage } from "@/components/SafeImage";
import formatAmount from "@/utils/formatAmount";
import { removeUserscore } from "@/utils/underScoreTransformer";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const ViewTransferActionsColumn = (
  action: (item: Record<string, string>) => void,
): readonly ColumnDef<Record<string, any>>[] => {
  const columns: ColumnDef<Record<string, any>>[] = [
    {
      header: "Equipment",
      accessorKey: "title",
      cell: ({ row }) => {
        return (
          <div className="flex flex-row items-start gap-x-3 sm:gap-x-1">
            <div className="rounded-full w-[40px] flex flex-col justify-center items-center h-[40px] bg-gray-100">
              <SafeImage
                src={row?.original?.image_url}
                alt={row?.original?.title}
                className="w-full object-fill rounded-full"
                width={40}
                height={40}
              />
            </div>
            <div className="flex flex-col flex-1">
              <p
                className="text-gray-900 font-medium text-sm w-[30ch] truncate"
                title={row?.original?.title}
              >
                {row?.original?.title}
              </p>
              <p className="text-gray-600 text-sm">
                {row?.original?.source &&
                  removeUserscore(row?.original?.source)}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Name",
      accessorKey: "assignee",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <p className="text-gray-900 text-sm">
              {row?.original?.assignee?.name || (
                <Badge variant="red">Not available</Badge>
              )}
            </p>
            <p className="text-gray-900 text-sm">
              {row?.original?.assignee?.level || (
                <Badge variant="red">Not available</Badge>
              )}
            </p>
          </div>
        );
      },
    },
    // {
    //   header: "Department",
    //   accessorKey: "assignee",
    //   cell: ({ row }) => {
    //     return (
    //       <div className="flex flex-col">
    //         <p className="text-gray-900 text-sm">
    //           {row?.original?.assignee?.job_title || <Badge variant="red">Not available</Badge>}
    //         </p>
    //         <p className="text-gray-900 text-sm">
    //           {row?.original?.assignee?.department || <Badge variant="red">Not available</Badge>}
    //         </p>
    //       </div>
    //     );
    //   },
    // },
    {
      header: "Receiver's name",
      accessorKey: "receiver",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <p className="text-gray-900 text-sm">
              {`${row?.original?.receiver?.first_name} ${row?.original?.receiver?.last_name}` || (
                <Badge variant="red">Not available</Badge>
              )}
            </p>
            <p className="text-gray-900 text-sm">
              {row?.original?.receiver?.level || (
                <Badge variant="red">Not available</Badge>
              )}
            </p>
          </div>
        );
      },
    },
    // {
    //   header: "Receiver's department",
    //   accessorKey: "receiver",
    //   cell: ({ row }) => {
    //     return (
    //       <div className="flex flex-col">
    //         <p className="text-gray-900 text-sm">
    //           {row?.original?.receiver?.role || <Badge variant="red">Not available</Badge>}
    //         </p>
    //         <p className="text-gray-900 text-sm">
    //           {row?.original?.receiver?.departments?.[0]?.name || <Badge variant="red">Not available</Badge>}
    //         </p>
    //       </div>
    //     );
    //   },
    // },
    {
      header: "Estimated pick-up date",
      accessorKey: "collectionDate",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <p className="text-gray-600 text-sm">
              {!row?.original?.collectionDate ? (
                <Badge variant="red">Not available</Badge>
              ) : (
                dayjs(row?.original?.collectionDate).format("MMM DD, YYYY")
              )}
            </p>
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
  return columns;
};

export default ViewTransferActionsColumn;
