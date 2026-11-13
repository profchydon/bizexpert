import { memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { removeUserscore } from "@/utils/underScoreTransformer";
import useDepartment from "@/hooks/useDepartment";
import { format, parseISO } from "date-fns";

const DevicesTableColumn = (
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
              {removeUserscore(row?.original?.employment_type)}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    header: "Department",
    accessorKey: "department",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <p className="text-gray-900 text-sm">
            {row?.original?.level ? (
              removeUserscore(row?.original?.level)
            ) : (
              <Badge variant="red">Not available</Badge>
            )}
          </p>
          <p className="text-gray-600 text-sm">
            {row?.original?.departments.length > 0 &&
              useDepartment()?.departmentById(
                row?.original?.departments?.[0]?.id,
              )}
          </p>
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
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const totalQuantity = row?.original?.items?.reduce(
        (sum: any, item: any) => sum + item.quantity,
        0,
      );
      return (
        <div className="flex flex-col">
          {Object.hasOwn(row?.original, "items") &&
          row?.original?.items?.length > 0 ? (
            <div className="w-fit">
              <Badge className="w-fit" variant="success">
                {totalQuantity} Items added
              </Badge>
            </div>
          ) : (
            <div className="w-fit">
              <Badge className="w-fit" variant="destructive">
                No items
              </Badge>
            </div>
          )}
        </div>
      );
    },
  },
  {
    header: "Fulfilment start date",
    accessorKey: "fulfilment_date",
    cell: ({ row }) => {
      const dateString = row?.original?.fulfilment_date;
      const parsedDate = !dateString ? null : parseISO(dateString);
      const formattedDate = !parsedDate
        ? null
        : format(parsedDate, "dd/MM/yyyy"); // Format the date
      return (
        <p className="text-gray-900 text-sm">{formattedDate || "-- -- --"}</p>
      );
    },
  },
  {
    header: "Items",
    accessorKey: "items",
    cell: memo(({ row }) => {
      return (
        <div className="flex">
          {Object.hasOwn(row?.original, "items") &&
          row?.original?.items?.length > 0 ? (
            row?.original?.items
              ?.slice(0, 3)
              .map((item: any, index: number) => (
                <div key={index} className="w-auto h-auto first:-ml-0 -ml-2">
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={item?.images?.[0] || ""}
                            alt="asset_image"
                          />
                          <AvatarFallback className="text-gray-600 bg-gray-100">
                            {item?.asset?.name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="bg-gray-900 rounded-lg p-3 text-xs flex items-center sm:w-[276px] gap-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={item?.image || ""}
                              alt="asset_image"
                            />
                            <AvatarFallback className="text-gray-600 bg-gray-100">
                              {item?.asset?.name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-white">
                            {item?.asset.name}{" "}
                            {item.specification?.properties?.condition}{" "}
                            {item.specification?.properties?.memory}{" "}
                            {item.specification?.properties?.processor}{" "}
                            {item.specification?.properties?.storage}
                          </span>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))
          ) : (
            <div>0 items</div>
          )}
        </div>
      );
    }),
  },
  {
    id: "action",
    cell: ({ row }) => {
      return action(row?.original);
    },
  },
];

export default DevicesTableColumn;
