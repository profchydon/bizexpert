import React from "react";
import { AlertTriangle, CheckCircle, Package } from "lucide-react";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import { SafeImage } from "@/components/SafeImage";
import { IOrder } from "@/types/orders";
import OrderStatusBadgeV2 from "../../v2/components/OrderStatusBadgeV2";
import {
  buildOffboardContentLines,
  OffboardContentLine,
} from "./offboardContentLines";

const HEADINGS = ["Device", "Fulfillment", "Wipe", "Device Check"];

const WipeCell: React.FC<{ wipe: string | null }> = ({ wipe }) =>
  wipe ? (
    <span className="text-sm text-gray-700">{wipe}</span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full border border-warning-300 bg-warning-50 px-2 py-0.5 text-xs font-medium text-warning-700">
      <AlertTriangle className="size-3.5" />
      Do not wipe
    </span>
  );

const DeviceCheckCell: React.FC<{ included: boolean }> = ({ included }) =>
  included ? (
    <span className="inline-flex items-center gap-1 rounded-full border border-success-200 bg-success-50 px-2 py-0.5 text-xs font-medium text-success-700">
      <CheckCircle className="size-3.5" />
      Included
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600">
      Not included
    </span>
  );

const DeviceRow: React.FC<{ line: OffboardContentLine }> = ({ line }) => {
  const subtitle = [line.type, line.serial, line.dispositionLabel]
    .filter(Boolean)
    .join(" · ");
  return (
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
            <p className="max-w-[320px] truncate text-sm font-medium text-gray-900">
              {line.name}
            </p>
            {subtitle && (
              <p className="truncate text-xs text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <OrderStatusBadgeV2 status={line.status} />
      </td>
      <td className="px-6 py-4">
        <WipeCell wipe={line.wipe} />
      </td>
      <td className="px-6 py-4">
        <DeviceCheckCell included={line.deviceCheckIncluded} />
      </td>
    </tr>
  );
};

const OffboardContentsV2: React.FC<{ order: IOrder }> = ({ order }) => {
  const lines = buildOffboardContentLines(order);

  return (
    <div className="relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-gray-200">
      <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">Order contents</h3>
        {lines.length > 0 && (
          <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-200">
            {lines.length} {lines.length === 1 ? "device" : "devices"}
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
                {HEADINGS.map((heading) => (
                  <th
                    key={heading}
                    className="px-6 py-3 text-xs font-semibold text-gray-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <DeviceRow key={line.id} line={line} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OffboardContentsV2;
