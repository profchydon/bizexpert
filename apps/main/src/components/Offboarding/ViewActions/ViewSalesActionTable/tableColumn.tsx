import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { SafeImage } from "@/components/SafeImage";
import formatAmount from "@/utils/formatAmount";
import { removeUserscore } from "@/utils/underScoreTransformer";
import { Checkbox } from "@/components/ui/checkbox";
import ReactCountryFlag from "react-country-flag";
import { Badge } from "@/components/ui/badge";

const ViewSalesActionsColumn = (
  action: (item: Record<string, string>) => void,
): readonly ColumnDef<Record<string, any>>[] => {
  const columns: ColumnDef<Record<string, any>>[] = [
    {
      header: "Equipment",
      accessorKey: "name",
      cell: ({ row }) => {
        return (
          <div className="flex flex-row items-center gap-x-3 sm:gap-x-1">
            <div className="rounded-full w-[40px] flex flex-col justify-center items-center h-[40px] bg-gray-100">
              <SafeImage
                src={row?.original?.image_url}
                alt={row?.original?.name}
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
      header: "Collection date",
      accessorKey: "collectionDate",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <p className="text-gray-900 text-sm">
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
      header: "Estimated sales price",
      accessorKey: "estimatedSalesPrice",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <p className="text-gray-900 text-sm">
              {row?.original?.currency?.symbol || ""}
              {formatAmount(row?.original?.estimatedSalesPrice!) || (
                <Badge variant="red">Not available</Badge>
              )}
            </p>
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
              countryCode={row?.original?.country_code || ""}
              className=""
              svg
              style={{
                width: "20px",
                height: "20px",
              }}
            />
            <span>{row?.original?.country || ""}</span>
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

export default ViewSalesActionsColumn;
