import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import formatAmount from "@/utils/formatAmount";
import dayjs from "dayjs";
import { ColumnDef } from "@tanstack/react-table";
import { IAllTransaction } from "@/types/transactions";

const TransactionsHistoryTableColumn = (
  action: (item: IAllTransaction) => void,
): readonly ColumnDef<IAllTransaction>[] => [
  {
    header: "Reference",
    accessorKey: "reference",
    cell: ({ row }) => {
      return (
        <p className=" font-medium">
          {row.getValue("reference") || (
            <Badge variant="red">Not available</Badge>
          )}
        </p>
      );
    },
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: ({ row }) => {
      return (
        <p className="text-gray-900 font-normal flex flex-row items-center">
          {row?.original.currency_symbol}
          {formatAmount(row.getValue("amount")) || (
            <Badge variant="red">Not available</Badge>
          )}
        </p>
      );
    },
  },
  {
    header: "Payment",
    accessorKey: "payment",
    cell: ({ row }) => {
      if (row.getValue("payment") !== "Cash") {
        return (
          <p className="text-primary-600 font-normal">
            {row.getValue("payment")}
          </p>
        );
      }
      return (
        <p className="text-success-700 font-normal">
          {row.getValue("payment")}
        </p>
      );
    },
  },
  {
    header: "No. of Equipment",
    accessorKey: "number_of_equipments",
    cell: ({ row }) => {
      return (
        <p className="w-fit h-auto py-1 rounded-full bg-primary-50 text-primary-700 px-2 font-normal">
          {row.getValue("number_of_equipments") || 0}
        </p>
      );
    },
  },
  {
    header: "Method",
    accessorKey: "method",
    cell: ({ row }) => {
      return (
        <p className="font-normal">{row.getValue("method") || "--- ---"}</p>
      );
    },
  },
  {
    header: "Date",
    accessorKey: "date",
    cell: ({ row }) => {
      return (
        <p className="font-normal">
          {dayjs(row?.getValue("date")).format("MMM DD, YYYY") || "--- ---"}
        </p>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      type Status =
        | "Pending"
        | "Awaiting Payment"
        | "Successful"
        | "Failed"
        | "Canceled"
        | "Refunded"
        | "Partial Refund"
        | "Disputed"
        | "Fulfilled";
      const statusMap: Record<
        Status,
        { className: string; variant?: string; label: string }
      > = {
        Pending: {
          className: "w-fit bg-warning-50 text-warning-700",
          variant: "pending",
          label: "Pending",
        },
        "Awaiting Payment": {
          className: "w-fit bg-warning-50 text-warning-700",
          label: "Awaiting Payment",
        },
        Successful: {
          className: "w-fit text-success-700",
          variant: "success",
          label: "Successful",
        },
        Failed: {
          className: "w-fit bg-error-50 text-error-700",
          variant: "destructive",
          label: "Failed",
        },
        Canceled: {
          className: "w-fit text-gray-700",
          variant: "destructive",
          label: "Canceled",
        },
        Refunded: {
          className: "w-fit text-primary-700 bg-primary-25",
          label: "Refunded",
        },
        "Partial Refund": {
          className: "w-fit bg-purple-50 text-purple-700",
          label: "Partial Refund",
        },
        Disputed: {
          className: "w-fit bg-warning-50 text-warning-700",
          label: "Disputed",
        },
        Fulfilled: {
          className: "w-fit text-success-700",
          variant: "success",
          label: "Completed",
        },
      };

      const status = row?.original.status as Status;

      return (
        statusMap[status]?.label && (
          <div className="w-fit">
            <Badge
              className={cn("font-light", statusMap[status]?.className)}
              variant={statusMap[status]?.variant as any}
            >
              {statusMap[status]?.label}
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

export default TransactionsHistoryTableColumn;
