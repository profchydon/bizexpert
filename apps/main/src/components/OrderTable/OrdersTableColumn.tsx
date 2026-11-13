import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { IOrder, ISubOrder } from "@/types/orders";
import dayjs from "dayjs";
import ReactCountryFlag from "react-country-flag";
import formatAmount from "@/utils/formatAmount";
import { OrderFlowType, orderFlowTypeCheck } from "@/types/offboarding";
import { ASSET_ORDER_STATUS, orderStatusMap } from "@/utils/orderStatusMap";
import { getUniqueCountries } from "@/utils/getUniqueCountries";
import CustomTooltip from "../CustomTooltip";
import { signatureStatusMap } from "@/utils/signatureStatusMap";

const OrdersTableColumn = (
  action: (item: IOrder) => void,
  hideOnboardedEmployees?: boolean,
  hideCountry?: boolean,
  onOrderIdClick?: (orderId: string) => void,
): readonly ColumnDef<IOrder>[] => {
  const columns: ColumnDef<IOrder>[] = [
    {
      header: "Order ID",
      accessorKey: "orderId",
      cell: ({ row }) => {
        const orderId = row?.original?.id;
        return (
          <button
            type="button"
            onClick={() => orderId && onOrderIdClick?.(orderId)}
            className="text-left text-sm font-bold text-gray-900 transition-colors hover:text-primary-700 hover:underline"
          >
            {row?.original.order_number}
          </button>
        );
      },
    },
    {
      header: "Order date",
      accessorKey: "date",
      cell: ({ row }) => {
        return (
          <div className="text-sm">
            {dayjs(row?.original.order_date).format("MMM DD, YYYY")}
          </div>
        );
      },
    },
    {
      header: "Order status",
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
      header: "Total amount",
      accessorKey: "amount",
      cell: ({ row }) => {
        return (
          <div className="text-sm">
            {/* @ts-ignore */}
            {row?.original?.currency}
            {formatAmount(row?.original.total_amount)}
          </div>
        );
      },
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: ({ row }) => {
        const orderType = row?.original.type as unknown as OrderFlowType;
        if (!orderType) return null;

        const config = orderFlowTypeCheck[orderType];

        return (
          <>
            {config?.label ? (
              <div className="w-fit">
                <Badge
                  className={config.className}
                  variant={config.variant as any}
                >
                  {config.label}
                </Badge>
              </div>
            ) : (
              <div className="w-fit">
                <Badge
                  className="w-fit border-gray-400 text-gray-600"
                  variant="outline"
                >
                  {String(orderType)
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </Badge>
              </div>
            )}
          </>
        );
      },
    },
    {
      header: "Signature",
      accessorKey: "signature_requested",
      cell: ({ row }) => {
        const signatureRequired = (row?.original as any).signature_requested;
        const badge =
          signatureStatusMap[
            signatureRequired as keyof typeof signatureStatusMap
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

  // Conditionally add the "Onboarded employees" column
  if (!hideOnboardedEmployees) {
    columns.splice(4, 0, {
      header: "Employees",
      accessorKey: "onboardedEmployees",
      cell: ({ row }) => {
        return <div className="text-sm">{row?.original.employee_count}</div>;
      },
    });
  }

  // Conditionally add the "Country" column
  if (!hideCountry) {
    columns.splice(-1, 0, {
      header: "Countries",
      // accessorKey: "sub_orders",
      cell: ({ row }) => {
        const orderType = row?.original.type as unknown as OrderFlowType;
        //@ts-ignore
        const rawSubOrders = row?.original?.sub_orders?.data as any;

        let subOrders: ISubOrder[] = [];
        if (Array.isArray(rawSubOrders)) {
          subOrders = rawSubOrders as ISubOrder[];
        } else if (Array.isArray(rawSubOrders?.data)) {
          subOrders = rawSubOrders?.data as ISubOrder[];
        }

        const combinedCountries = new Map<string, any>();
        subOrders?.forEach((subOrder: any) => {
          const defaultCountry = {
            name: subOrder?.equipment?.country as string,
            code: subOrder?.equipment?.country_code as string,
          };

          const countries = getUniqueCountries(defaultCountry);
          countries.forEach((country) => {
            const key = `${country.name}-${country.code}`;
            if (!combinedCountries.has(key)) {
              combinedCountries.set(key, country);
            }
          });
        });

        const uniqueCountries = Array.from(combinedCountries.values());
        if (orderType === "offboarding") {
          if (uniqueCountries.length === 1) {
            return (
              <div className="flex items-center gap-x-2">
                <ReactCountryFlag
                  countryCode={uniqueCountries[0]?.code}
                  svg
                  style={{ width: "20px", height: "20px" }}
                />
                <span className="text-sm">{uniqueCountries[0]?.name}</span>
              </div>
            );
          }

          if (uniqueCountries.length > 1) {
            return (
              <div className="flex items-center gap-x-2">
                {uniqueCountries.slice(0, 3).map((item) => (
                  <div
                    key={`${item?.code}-${item?.name}`}
                    className="w-auto h-auto first:-ml-0 -ml-2"
                  >
                    <CustomTooltip
                      content={
                        <div className="flex flex-col text-white gap-3">
                          <p>{item?.name}</p>
                        </div>
                      }
                    >
                      <ReactCountryFlag
                        countryCode={item?.code}
                        svg
                        style={{ width: "20px", height: "20px" }}
                      />
                    </CustomTooltip>
                  </div>
                ))}
                {uniqueCountries.length > 3 && (
                  <p className="text-xs text-gray-500">
                    +{uniqueCountries.length - 3}
                  </p>
                )}
              </div>
            );
          }

          return <span className="text-xs text-gray-500">0 countries</span>;
        }
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
    });
  }
  return columns;
};

export default OrdersTableColumn;
