import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import Image from "next/image";
import { roundedImage_placeholder } from "@/assets/images";
import formatAmount from "@/utils/formatAmount";
import { removeUserscore } from "@/utils/underScoreTransformer";
import { formatDecimalYears } from "@/utils/formatDecimalYears";
import { IItemsInStorageByCountry } from "@/types/equipments";
import ReactCountryFlag from "react-country-flag";

const StorageSummaryTableColumn = (
  action: (item: IItemsInStorageByCountry) => void,
): readonly ColumnDef<IItemsInStorageByCountry>[] => {
  const columns: ColumnDef<IItemsInStorageByCountry>[] = [
    {
      header: "Country",
      accessorKey: "country",
      cell: ({ row }) => {
        return (
          <div className="flex flex-row items-start gap-x-3 sm:gap-x-1">
            <div className="text-sm flex gap-x-3 items-center">
              <ReactCountryFlag
                countryCode={row?.original?.country_code ?? "NG"}
                className=""
                svg
                style={{
                  width: "20px",
                  height: "20px",
                }}
              />
              <span className="font-semibold text-gray-900">
                {row?.original?.country || ""}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: "Items stored",
      accessorKey: "items",
      cell: ({ row }) => {
        return (
          <p className="text-gray-600 text-sm">
            {row.original.total_in_storage}
          </p>
        );
      },
    },
    // {
    //   header: "Expiry status",
    //   accessorKey: "expire status",
    //   cell: ({ row }) => {
    //     return (
    //       <div className="flex flex-col">
    //         <p className="text-gray-600 text-sm">
    //           {row?.original?.expiring_soon === 0 ? (
    //             <Badge variant="success">No expiry</Badge>
    //           ) : (
    //             <Badge variant="red">
    //               {row?.original?.expiring_soon} Items expiring
    //             </Badge>
    //           )}
    //         </p>
    //       </div>
    //     );
    //   },
    // },
    {
      header: "Last activity date",
      accessorKey: "activity-date",
      cell: ({ row }) => {
        return (
          <p className="text-gray-600 text-sm">
            {dayjs(row?.original.latest_update).format("MMM DD, YYYY")}
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

  return columns;
};

export default StorageSummaryTableColumn;
