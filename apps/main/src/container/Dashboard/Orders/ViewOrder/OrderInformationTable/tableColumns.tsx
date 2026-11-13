import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { ISubOrder } from "@/types/orders";
import formatAmount from "@/utils/formatAmount";
import { ASSET_ORDER_STATUS, orderStatusMap } from "@/utils/orderStatusMap";
import dayjs from "dayjs";
import { assetActionType, OrderActionType } from "@/types/offboarding";
import { removeUserscore } from "@/utils/underScoreTransformer";
import truncate from "lodash/truncate";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { signatureStatusMap } from "@/utils/signatureStatusMap";

const createSelectColumn = (
  signatureFilterMode: "required" | "not_required" | null,
  getSignatureValue: (row: ISubOrder) => boolean | undefined | null,
  isRowSelectable?: (row: ISubOrder) => boolean,
): ColumnDef<ISubOrder> => {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => {
          const shouldSelect = !!value;
          table.getRowModel().rows.forEach((row) => {
            const canSelect = isRowSelectable
              ? isRowSelectable(row.original)
              : true;
            row.toggleSelected(shouldSelect && canSelect);
          });
        }}
        disabled={
          isRowSelectable
            ? table
                .getRowModel()
                .rows.every((row) => !isRowSelectable(row.original))
            : false
        }
        aria-label="Select all"
        data-testid="orderinformationtablecolumns-checkbox"
      />
    ),
    cell: ({ row }) => {
      const rowSignature = getSignatureValue(row.original);
      const canSelect = isRowSelectable ? isRowSelectable(row.original) : true;
      const isDisabled =
        signatureFilterMode !== null &&
        ((signatureFilterMode === "required" && !rowSignature) ||
          (signatureFilterMode === "not_required" && rowSignature));

      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          disabled={!canSelect || isDisabled || false}
          data-testid="orderinformationtablecolumns-checkbox-2"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  };
};

const getAssigneeName = (row: ISubOrder): string | React.ReactNode => {
  if (row?.employee_first_name && row?.employee_last_name) {
    return `${row?.employee_first_name || ""} ${row?.employee_last_name || ""}`;
  }
  if (row?.equipment?.assignee?.name) {
    return `${row?.equipment?.assignee?.name}`;
  }
  return <Badge variant="red">Not available</Badge>;
};

const getAssigneeJobTitle = (row: ISubOrder): string => {
  if (row?.job_title) {
    return row?.job_title;
  }
  // @ts-ignore
  if (row?.equipment?.assignee?.job_title) {
    // @ts-ignore
    return row?.equipment?.assignee?.job_title;
  }
  return "";
};

const getOrderAmount = (row: ISubOrder, currency: string): string | number => {
  // @ts-ignore
  if (row?.total_amount) {
    // @ts-ignore
    return `${formatAmount(row?.total_amount)}`;
  }
  if (row?.amount) {
    return row?.amount;
  }
  return 0;
};

const OrderInformationTableColumn = (
  action: (item: ISubOrder) => void,
  orderType: string,
  currency: string,
  signatureFilterMode: "required" | "not_required" | null,
  hideColumnSelect?: boolean,
  isRowSelectable?: (row: ISubOrder) => boolean,
): readonly ColumnDef<ISubOrder>[] => {
  let columns: ColumnDef<ISubOrder>[];
  if (orderType === "onboarding") {
    columns = [
      ...(hideColumnSelect
        ? []
        : [
            createSelectColumn(
              signatureFilterMode,
              (row) => (row?.assets?.[0] as any)?.signature_requested,
              isRowSelectable,
            ),
          ]),
      {
        header: "Name",
        accessorKey: "full_name",
        cell: ({ row }) => {
          return (
            <div className="flex flex-row items-center gap-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-gray-600 bg-gray-100">{`${row?.original?.employee_first_name?.[0]} ${row?.original?.employee_last_name?.[0]}`}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-gray-900 font-medium text-sm">{`${row?.original?.employee_first_name || ""} ${row?.original?.employee_last_name || ""}`}</p>
                <p className="text-gray-600 text-[12px]">
                  {row?.original?.job_title || ""}
                </p>
              </div>
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
                {row?.original?.address || ""}
              </p>
            </div>
          );
        },
      },

      {
        header: "Total amount",
        accessorKey: "amount",
        cell: ({ row }) => {
          return (
            <div className="flex flex-col">
              <p className="text-gray-600 text-sm">
                {/* @ts-ignore */}
                {row?.original?.currency || ""} {/* @ts-ignore */}
                {formatAmount(row?.original?.total_amount || "") || ""}
              </p>
            </div>
          );
        },
      },

      {
        header: "Order Status",
        accessorKey: "status",
        cell: ({ row }) => {
          const status =
            row?.original.status?.toLocaleLowerCase() as ASSET_ORDER_STATUS;
          return (
            orderStatusMap[status]?.label && (
              <div className="w-fit">
                <Badge
                  className={orderStatusMap[status]?.className}
                  variant={orderStatusMap[status]?.variant as any}
                >
                  {orderStatusMap[status]?.icon}
                  {orderStatusMap[status]?.label}
                </Badge>
              </div>
            )
          );
        },
      },

      {
        header: "Signature",
        accessorKey: "signature_requested",
        cell: ({ row }) => {
          const isSignatureRequested = (row?.original?.assets?.[0] as any)
            ?.signature_requested;
          const badge =
            signatureStatusMap[
              String(isSignatureRequested) as keyof typeof signatureStatusMap
            ] || signatureStatusMap["not_requested"];

          return (
            <div className="w-fit">
              <Badge className={badge.className} variant={badge.variant as any}>
                {badge.label}
              </Badge>
            </div>
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
  } else if (orderType === "offboarding") {
    columns = [
      ...(hideColumnSelect
        ? []
        : [
            createSelectColumn(
              signatureFilterMode,
              (row) => row?.signature_requested as boolean,
              isRowSelectable,
            ),
          ]),
      {
        header: "Collection date",
        accessorKey: "collection_date",
        cell: ({ row }) => {
          return (
            <div className="flex flex-col">
              <p className="text-gray-600 text-sm">
                {row?.original?.collection_date ? (
                  dayjs(row?.original?.collection_date).format("MMM DD, YYYY")
                ) : (
                  <Badge variant="red">Not available</Badge>
                )}
              </p>
            </div>
          );
        },
      },
      // {
      //   header: "Amount",
      //   accessorKey: "amount",
      //   cell: ({ row }) => {
      //     return (
      //       <div className="flex flex-col">
      //         <p className="text-gray-600 text-sm">
      //           {currency}
      //           {/* @ts-ignore */}
      //           {row?.original?.amount && formatAmount(row?.original?.amount)}
      //         </p>
      //       </div>
      //     );
      //   },
      // },
      {
        header: "Action type",
        accessorKey: "type",
        cell: ({ row }) => {
          const actionType = row?.original.type as OrderActionType;
          return (
            <div className="flex flex-col">
              {assetActionType[actionType]?.label && (
                <div className="w-fit">
                  <Badge
                    className={assetActionType[actionType]?.className}
                    variant={assetActionType[actionType]?.variant as any}
                  >
                    {assetActionType[actionType]?.label}
                  </Badge>
                </div>
              )}
            </div>
          );
        },
      },
      {
        header: "Equipment",
        accessorKey: "equipment",
        cell: ({ row }) => {
          return (
            <div className="flex flex-col">
              <p className="text-gray-600 text-sm">
                {row?.original.equipment?.title || ""}
              </p>
            </div>
          );
        },
      },
      {
        header: "Equipment state",
        accessorKey: "equipment",
        cell: ({ row }) => {
          return (
            <div className="flex flex-col">
              <p className="text-gray-600 text-sm">
                {removeUserscore(row?.original?.equipment?.state || "") || (
                  <Badge variant="red">Not available</Badge>
                )}
              </p>
            </div>
          );
        },
      },

      {
        header: "Equipment serial number",
        accessorKey: "equipment",
        cell: ({ row }) => {
          return (
            <div className="flex flex-col">
              <p className="text-gray-600 text-sm">
                {removeUserscore(
                  row?.original?.equipment?.serial_number || "",
                ) || <Badge variant="red">No available serial number</Badge>}
              </p>
            </div>
          );
        },
      },

      {
        header: "Employee Info/Transfer Info",
        accessorKey: "order_type",
        cell: ({ row }) => {
          const actionType = row?.original.type as OrderActionType;
          const orderDetails = row?.original.order_details as any;
          if (actionType === "resale") {
            return (
              <span className="text-sm font-medium">
                {currency || ""}
                {formatAmount(orderDetails?.estimated_price) || (
                  <Badge variant="red">Not available</Badge>
                )}
              </span>
            );
          }
          if (actionType === "storage") {
            return (
              <span className="text-sm font-medium inline-flex">
                {row?.original?.equipment?.assignee ? (
                  <>{row?.original?.equipment?.assignee?.name} </>
                ) : (
                  <Badge variant="red">Not available</Badge>
                )}
              </span>
            );
          }
          if (actionType === "reassign") {
            return (
              <p className="inline-flex flex-row items-center gap-2">
                <span className="font-semibold">
                  {orderDetails?.from?.first_name}
                  {orderDetails?.from?.last_name}
                </span>
                <span>to</span>
                <span className="font-semibold">
                  {orderDetails?.to?.first_name}
                  {orderDetails?.to?.last_name}
                </span>
              </p>
            );
          }
        },
      },

      {
        header: "Order Status",
        accessorKey: "status",
        cell: ({ row }) => {
          const status = row?.original.status as ASSET_ORDER_STATUS;
          return (
            orderStatusMap[status]?.label && (
              <div className="w-fit">
                <Badge
                  className={orderStatusMap[status]?.className}
                  variant={orderStatusMap[status]?.variant as any}
                >
                  {orderStatusMap[status]?.icon}
                  {orderStatusMap[status]?.label}
                </Badge>
              </div>
            )
          );
        },
      },
      {
        header: "Signature",
        accessorKey: "signature_requested",
        cell: ({ row }) => {
          const isSignatureRequested = row?.original?.signature_requested;
          const badge =
            signatureStatusMap[
              String(isSignatureRequested) as keyof typeof signatureStatusMap
            ] || signatureStatusMap["not_requested"];

          return (
            <div className="w-fit">
              <Badge className={badge.className} variant={badge.variant as any}>
                {badge.label}
              </Badge>
            </div>
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
  } else if (orderType == "storage_to_employee") {
    columns = [
      ...(hideColumnSelect
        ? []
        : [
            createSelectColumn(
              signatureFilterMode,
              (row) => row?.signature_requested,
            ),
          ]),
      {
        header: "Name",
        accessorKey: "full_name",
        cell: ({ row }) => {
          return (
            <div className="flex flex-row items-center gap-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-gray-600 bg-gray-100">{`${row?.original?.employee_first_name?.[0]} ${row?.original?.employee_last_name?.[0]}`}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-gray-900 font-medium text-sm">{`${row?.original?.employee_first_name} ${row?.original?.employee_last_name}`}</p>
                <p className="text-gray-600 text-[12px]">
                  {row?.original?.job_title}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        header: "Equipment serial number",
        accessorKey: "equipment",
        cell: ({ row }) => {
          return (
            <div className="flex flex-col">
              <p className="text-gray-600 text-sm">
                {removeUserscore(
                  row?.original?.equipment?.serial_number || "",
                ) || <Badge variant="red">No available serial number</Badge>}
              </p>
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
              <p className="text-gray-600 text-sm">{row?.original.address}</p>
            </div>
          );
        },
      },

      {
        header: "Total amount",
        accessorKey: "amount",
        cell: ({ row }) => {
          return (
            <div className="flex flex-col">
              <p className="text-gray-600 text-sm">
                {currency}
                {formatAmount(row?.original?.equipment?.purchase_price!)}
              </p>
            </div>
          );
        },
      },

      {
        header: "Order Status",
        accessorKey: "status",
        cell: ({ row }) => {
          const status =
            row?.original.status?.toLocaleLowerCase() as ASSET_ORDER_STATUS;
          return (
            orderStatusMap[status]?.label && (
              <div className="w-fit">
                <Badge
                  className={orderStatusMap[status]?.className}
                  variant={orderStatusMap[status]?.variant as any}
                >
                  {orderStatusMap[status]?.icon}
                  {orderStatusMap[status]?.label}
                </Badge>
              </div>
            )
          );
        },
      },
      {
        header: "Signature",
        accessorKey: "signature_requested",
        cell: ({ row }) => {
          const isSignatureRequested = row?.original?.signature_requested;
          const badge =
            signatureStatusMap[
              String(isSignatureRequested) as keyof typeof signatureStatusMap
            ] || signatureStatusMap["not_requested"];

          return (
            <div className="w-fit">
              <Badge className={badge.className} variant={badge.variant as any}>
                {badge.label}
              </Badge>
            </div>
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
  } else if (orderType === "device_refresh") {
    columns = [
      ...(hideColumnSelect
        ? []
        : [
            createSelectColumn(
              signatureFilterMode,
              (row) => (row?.assets?.[0] as any)?.signature_requested,
            ),
          ]),
      {
        header: "Equipment",
        accessorKey: "equipment",
        cell: ({ row }) => {
          return (
            <div className="flex flex-col">
              <p className="text-gray-600 text-sm">
                {row?.original.equipment?.title ||
                  row?.original?.assets?.[0]?.name || (
                    <Badge variant="red">Not available</Badge>
                  )}
              </p>
            </div>
          );
        },
      },
      {
        header: "Assignee name",
        accessorKey: "full_name",
        cell: ({ row }) => {
          return (
            <div className="flex flex-row items-center gap-x-3">
              <div className="flex flex-col">
                <p className="text-gray-900 font-medium text-sm">
                  {getAssigneeName(row?.original)}
                </p>
                <p className="text-gray-600 text-[12px] empty:hidden">
                  {getAssigneeJobTitle(row?.original)}
                </p>
              </div>
            </div>
          );
        },
      },

      // {
      //   header: "Collection date",
      //   accessorKey: "collection_date",
      //   cell: ({ row }) => {
      //     return (
      //       <div className="flex flex-col">
      //         <p className="text-gray-600 text-sm">
      //           {!row?.original?.collection_date ? (
      //             <Badge variant="red">Not available</Badge>
      //           ) : (
      //             dayjs(row?.original?.collection_date).format("MMM DD, YYYY")
      //           )}
      //         </p>
      //       </div>
      //     );
      //   },
      // },
      {
        header: "Amount",
        accessorKey: "total_amount",
        cell: ({ row }) => {
          return (
            <div className="flex flex-col">
              <p className="text-gray-600 text-sm">
                {currency}
                {getOrderAmount(row?.original, currency)}
              </p>
            </div>
          );
        },
      },
      // {
      //   header: "Action type",
      //   accessorKey: "type",
      //   cell: ({ row }) => {
      //     const actionType = row?.original.type as OrderActionType;
      //     return (
      //       <div className="flex flex-col">
      //         {assetActionType[actionType]?.label && (
      //           <div className="w-fit">
      //             <Badge
      //               className={assetActionType[actionType]?.className}
      //               variant={assetActionType[actionType]?.variant as any}
      //             >
      //               {assetActionType[actionType]?.label}
      //             </Badge>
      //           </div>
      //         )}
      //       </div>
      //     );
      //   },
      // },

      // {
      //   header: "Equipment state",
      //   accessorKey: "equipment",
      //   cell: ({ row }) => {
      //     return (
      //       <div className="flex flex-col">
      //         <p className="text-gray-600 text-sm">
      //           {removeUserscore(row?.original?.equipment?.state || "") || (
      //             <Badge variant="red">Not available</Badge>
      //           )}
      //         </p>
      //       </div>
      //     );
      //   },
      // },

      // {
      //   header: "Duration/Transfer Info",
      //   accessorKey: "order_type",
      //   cell: ({ row }) => {
      //     const actionType = row?.original.type as OrderActionType;
      //     const orderDetails = row?.original.order_details as any;
      //     if (actionType === "resale") {
      //       return (
      //         <span className="text-sm font-medium">
      //           {currency || ""}
      //           {formatAmount(orderDetails?.estimated_price) || (
      //             <Badge variant="red">Not available</Badge>
      //           )}
      //         </span>
      //       );
      //     }
      //     if (actionType === "storage") {
      //       return (
      //         <span className="text-sm font-medium">
      //           {orderDetails?.duration || (
      //             <Badge variant="red">Not available</Badge>
      //           )}
      //         </span>
      //       );
      //     }
      //     if (actionType === "reassign") {
      //       return (
      //         <p className="flex flex-row items-center gap-2">
      //           <span className="font-semibold">
      //             {orderDetails?.from?.first_name}
      //             {orderDetails?.from?.last_name}
      //           </span>
      //           to
      //           <span className="font-semibold">
      //             {orderDetails?.to?.first_name}
      //             {orderDetails?.to?.last_name}
      //           </span>
      //         </p>
      //       );
      //     }
      //   },
      // },

      {
        header: "Order Status",
        accessorKey: "status",
        cell: ({ row }) => {
          const status = row?.original.status as ASSET_ORDER_STATUS;
          return (
            orderStatusMap[status]?.label && (
              <div className="w-fit">
                <Badge
                  className={orderStatusMap[status]?.className}
                  variant={orderStatusMap[status]?.variant as any}
                >
                  {orderStatusMap[status]?.icon}
                  {orderStatusMap[status]?.label}
                </Badge>
              </div>
            )
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
  } else {
    columns = [
      ...(hideColumnSelect
        ? []
        : [
            createSelectColumn(
              signatureFilterMode,
              (row) => (row?.assets?.[0] as any)?.signature_requested,
            ),
          ]),
      {
        header: "Equipment Name",
        accessorKey: "equipment_name",
        cell: ({ row }) => {
          return (
            <div className="flex flex-row items-center gap-x-3">
              <div className="flex flex-col">
                <p className="text-gray-900 font-medium text-sm">{`${row?.original?.equipment?.title} ${row?.original?.equipment?.make} ${row?.original?.equipment?.model}`}</p>
                <p
                  title={row?.original?.equipment?.description}
                  className="text-sm"
                >
                  {row?.original?.equipment?.description ? (
                    truncate(row?.original?.equipment?.description, {
                      length: 30,
                    })
                  ) : (
                    <Badge variant="red">Not available</Badge>
                  )}
                </p>
              </div>
            </div>
          );
        },
      },

      {
        header: "Storage Duration",
        accessorKey: "storage_duration",
        cell: ({ row }) => {
          return (
            <div className="flex flex-col">
              <p className="text-gray-600 text-sm">
                {row?.original?.storage_duration ?? (
                  <Badge variant="red">Not available</Badge>
                )}
              </p>
            </div>
          );
        },
      },

      {
        header: "Quantity",
        accessorKey: "quantity",
        cell: ({ row }) => {
          return (
            <div className="flex flex-col">
              <p className="text-gray-600 text-sm">{row?.original?.quantity}</p>
            </div>
          );
        },
      },

      {
        header: "Total Amount",
        accessorKey: "total_amount",
        cell: ({ row }) => {
          return (
            <div className="flex flex-col">
              <p className="text-gray-600 text-sm">
                {currency} {getOrderAmount(row?.original, currency)}
              </p>
            </div>
          );
        },
      },

      {
        header: "Order Status",
        accessorKey: "status",
        cell: ({ row }) => {
          const status =
            row?.original.status?.toLocaleLowerCase() as ASSET_ORDER_STATUS;
          return (
            orderStatusMap[status]?.label && (
              <div className="w-fit">
                <Badge
                  className={orderStatusMap[status]?.className}
                  variant={orderStatusMap[status]?.variant as any}
                >
                  {orderStatusMap[status]?.icon}
                  {orderStatusMap[status]?.label}
                </Badge>
              </div>
            )
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
  }

  return columns;
};

export default OrderInformationTableColumn;
