import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import Image from "next/image";
import { roundedImage_placeholder } from "@/assets/images";
import { removeUserscore } from "@/utils/underScoreTransformer";
import { Checkbox } from "@/components/ui/checkbox";
import ReactCountryFlag from "react-country-flag";

const StorageTableColumn = (
  action: (item: Record<string, string>) => void,
): ColumnDef<Record<string, any>>[] => {
  const columns: ColumnDef<Record<string, any>>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          data-testid="storagetablecolumn-checkbox"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          data-testid="storagetablecolumn-checkbox-2"
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
            <div className="rounded-full w-[40px] flex flex-col justify-center items-center h-[40px] bg-gray-100">
              <Image
                src={row?.original?.image_url || roundedImage_placeholder}
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
      header: "Equipment type",
      accessorKey: "type",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <p className="text-gray-600 text-sm">{row?.original?.type}</p>
          </div>
        );
      },
    },
    {
      header: "Country",
      accessorKey: "country_code",
      cell: ({ row }) => {
        return (
          <div className="text-sm flex gap-x-3 items-center">
            <ReactCountryFlag
              countryCode={row?.original?.country_code || "NG"}
              className=""
              svg
              style={{
                width: "20px",
                height: "20px",
              }}
            />
            <span>{"NG"}</span>
          </div>
        );
      },
    },
    {
      header: "Collection date",
      accessorKey: "purchase_date",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <p className="text-gray-600 text-sm">
              {!row?.original?.purchase_date ? (
                <Badge variant="red">Not available</Badge>
              ) : (
                dayjs(row?.original.purchase_date).format("MMM DD, YYYY")
              )}
            </p>
          </div>
        );
      },
    },
    {
      header: "Storage duration",
      accessorKey: "usage_time_in_days",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <p className="text-gray-600 text-sm">
              {row?.original?.usage_time_in_days || "3 Months"}
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

export default StorageTableColumn;
