import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import Image from "next/image";
import { roundedImage_placeholder } from "@/assets/images";
import formatAmount from "@/utils/formatAmount";
import { removeUserscore } from "@/utils/underScoreTransformer";
import { formatDecimalYears } from "@/utils/formatDecimalYears";
import { Checkbox } from "@/components/ui/checkbox";
import { IEquipmentsInStorageByCountry } from "@/types/equipments";
import CustomTooltip from "@/components/CustomTooltip";

const EquipmentsTableColumn = (
  action: (item: IEquipmentsInStorageByCountry) => void,
  hideStatus?: boolean,
): readonly ColumnDef<IEquipmentsInStorageByCountry>[] => {
  const columns: ColumnDef<IEquipmentsInStorageByCountry>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="ml-1"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          data-testid="tablecolumnlegacy-checkbox"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          data-testid="tablecolumnlegacy-checkbox-2"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      header: "Equipment name",
      accessorKey: "title",
      cell: ({ row }) => {
        return (
          <div className="flex flex-row items-start gap-x-3 sm:gap-x-1">
            <CustomTooltip
              content={
                <div className="text-gray-300 text-xs w-full max-w-[400px]">
                  <h2 className="text-white font-semibold ">
                    {row?.original?.title}
                  </h2>
                  <p>
                    Ram:{" "}
                    <span className="font-medium">
                      {row?.original?.specs?.memory}
                    </span>
                  </p>
                  <p>
                    Storage (Type and Capacity):{" "}
                    <span className="font-medium">
                      {row?.original?.specs?.storage}
                    </span>
                  </p>
                </div>
              }
            >
              <div className="rounded-full w-[40px] flex flex-col justify-center items-center h-[40px] bg-gray-100">
                <Image
                  src={row?.original?.image_url || roundedImage_placeholder}
                  alt={row?.original?.title}
                  className="w-full object-fill rounded-full"
                  width={40}
                  height={40}
                />
              </div>
            </CustomTooltip>

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
                {!row?.original?.source && "---"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Serial Number",
      accessorKey: "serial_number",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <p className="text-gray-600 text-sm">
              {row?.original?.serial_number && row?.original?.serial_number}
              {!row?.original?.serial_number && (
                <Badge variant="red">Not available</Badge>
              )}
            </p>
          </div>
        );
      },
    },
    {
      header: "Storage duration",
      accessorKey: "duration",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <p className="text-gray-600 text-sm">
              {row?.original?.storage_duration &&
                row?.original?.storage_duration}
              {!row?.original?.storage_duration && (
                <Badge variant="red">Not available</Badge>
              )}
            </p>
          </div>
        );
      },
    },
    {
      header: "Moved to storage",
      accessorKey: "moved",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <p className="text-gray-600 text-sm">
              {row?.original?.moved_to_storage &&
                dayjs(row?.original?.moved_to_storage).format("MMM DD, YYYY")}
              {!row?.original?.moved_to_storage && (
                <Badge variant="red">Not available</Badge>
              )}
            </p>
          </div>
        );
      },
    },
    // {
    //   header: "Expiration date",
    //   accessorKey: "exp",
    //   cell: ({ row }) => {
    //     return (
    //       <div className="flex flex-col">
    //         <p className="text-gray-600 text-sm">
    //           {row?.original?.expiration_date &&
    //             dayjs(row?.original?.expiration_date).format("MMM DD, YYYY")}
    //           {!row?.original?.expiration_date && (
    //             <Badge variant="red">Not available</Badge>
    //           )}
    //         </p>
    //       </div>
    //     );
    //   },
    // },

    {
      id: "action",
      cell: ({ row }) => {
        return action(row?.original);
      },
    },
  ];

  // Conditionally add the "Status" column if hideStatus is not true
  if (!hideStatus) {
    columns.splice(columns.length - 1, 0, {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        type Status =
          | "unassigned"
          | "leased"
          | "assigned"
          | "in_storage"
          | "sold"
          | "expiring";

        const statusMap: Record<
          Status,
          { className: string; variant?: string; label: string }
        > = {
          assigned: {
            className: "w-fit text-success-700",
            variant: "success",
            label: "Assigned",
          },
          in_storage: {
            className: "w-fit text-gray-700",
            variant: "awaiting",
            label: "In Storage",
          },
          leased: {
            className: "w-fit text-primary-700 bg-primary-25",
            label: "Leased",
          },
          unassigned: {
            className: "w-fit bg-purple-50 text-purple-700",
            label: "Unassigned",
          },
          sold: {
            className: "w-fit bg-warning-50 text-warning-700",
            label: "Sold",
          },
          expiring: {
            className: "w-fit bg-error-50 text-error-700",
            label: "Expiring",
            variant: "red",
          },
        };

        const status = row?.original.status as Status;

        return (
          statusMap[status]?.label && (
            <div className="w-fit">
              <Badge
                className={statusMap[status]?.className}
                variant={statusMap[status]?.variant as any}
              >
                {statusMap[status]?.label}
              </Badge>
            </div>
          )
        );
      },
    });
  }

  return columns;
};

export default EquipmentsTableColumn;
