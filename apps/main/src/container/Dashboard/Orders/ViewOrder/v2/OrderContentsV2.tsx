import React from "react";
import { Package } from "lucide-react";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import { SafeImage } from "@/components/SafeImage";
import formatAmount from "@/utils/formatAmount";
import { IOrder } from "@/types/orders";
import { buildOrderContentLines, OrderContentLine } from "./orderContentLines";

const priceText = (value: number | null, symbol: string) =>
  value === null ? "—" : `${symbol}${formatAmount(value)}`;

const ContentRow: React.FC<{ line: OrderContentLine }> = ({ line }) => (
  <tr className="border-b border-gray-200 last:border-0">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
          {line.image ? (
            <SafeImage
              src={line.image}
              alt={line.name}
              width={40}
              height={40}
              className="size-full object-contain"
            />
          ) : (
            <Package className="size-5 text-gray-400" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500">{line.type}</p>
          <p className="max-w-[320px] truncate text-sm font-medium text-gray-900">
            {line.name}
          </p>
          {line.serialNumber ? (
            <p className="text-xs text-gray-500">Serial: {line.serialNumber}</p>
          ) : null}
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-200">
        {line.type}
      </span>
    </td>
    <td className="px-6 py-4 text-sm tabular-nums text-gray-700">
      {line.quantity}
    </td>
    <td className="px-6 py-4 text-sm tabular-nums text-gray-700">
      {priceText(line.unitPrice, line.currencySymbol)}
    </td>
    <td className="px-6 py-4 text-sm font-medium tabular-nums text-gray-900">
      {priceText(line.amount, line.currencySymbol)}
    </td>
  </tr>
);

const OrderContentsV2: React.FC<{ order: IOrder }> = ({ order }) => {
  const lines = buildOrderContentLines(order);
  const totalItems = lines.reduce((sum, line) => sum + line.quantity, 0);
  const typesCount = new Set(lines.map((line) => line.type)).size;

  return (
    <div className="relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-gray-200">
      <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">Order contents</h3>
        {totalItems > 0 && (
          <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-200">
            {totalItems} {totalItems === 1 ? "item" : "items"} · {typesCount}{" "}
            {typesCount === 1 ? "type" : "types"}
          </span>
        )}
      </div>
      {lines.length === 0 ? (
        <EmptyTableInstance
          title="No devices"
          description="This order has no device contents to display."
        />
      ) : (
        <div className="w-full overflow-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200">
                {["Item", "Type", "Qty", "Unit price", "Amount"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-6 py-3 text-xs font-semibold text-gray-500"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <ContentRow key={line.id} line={line} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderContentsV2;
