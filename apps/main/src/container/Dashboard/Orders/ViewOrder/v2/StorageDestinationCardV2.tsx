import React from "react";
import ReactCountryFlag from "react-country-flag";
import {
  Building2,
  CalendarCheck,
  MapPin,
  Timer,
  type LucideIcon,
} from "lucide-react";
import { IOrder } from "@/types/orders";
import { buildOrderContentLines, getSubOrders } from "./orderContentLines";
import { getExpectedDateField } from "./orderSidebarFields";
import { OrderNotesSection } from "./OrderNotesSection";
import { collectSubOrderNoteGroups } from "./orderNotes";
import { getStorageSummary } from "./orderStorageSummary";
import StorageOrderNotesV2 from "./StorageOrderNotesV2";

interface StatTile {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
}

const FALLBACK = <span className="text-gray-400">Not available</span>;

interface Props {
  order: IOrder;
  subOrderId?: string | null;
  focusedNoteIndex?: number | null;
}

const StorageDestinationCardV2: React.FC<Props> = ({
  order,
  subOrderId,
  focusedNoteIndex,
}) => {
  const lines = buildOrderContentLines(order);
  const totalItems = lines.reduce((sum, line) => sum + line.quantity, 0);
  const typesCount = new Set(lines.map((line) => line.type)).size;
  const summary = getStorageSummary(order);
  const expected = getExpectedDateField(order);
  const noteGroups = collectSubOrderNoteGroups(getSubOrders(order));

  const tiles: StatTile[] = [
    {
      icon: Building2,
      label: "Destination warehouse",
      value: summary.warehouse ?? FALLBACK,
    },
    {
      icon: MapPin,
      label: "Country",
      value: order.country ? (
        <span className="flex items-center gap-2">
          <ReactCountryFlag
            countryCode={order.country_code || ""}
            svg
            style={{ width: "20px", height: "20px" }}
          />
          {order.country}
        </span>
      ) : (
        FALLBACK
      ),
    },
    {
      icon: CalendarCheck,
      label: expected?.label ?? "Expected at warehouse",
      value: expected?.value ?? FALLBACK,
    },
    {
      icon: Timer,
      label: "Storage duration",
      value: summary.duration ?? FALLBACK,
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-gray-200">
      <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Order information
        </h3>
        {totalItems > 0 && (
          <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-200">
            {totalItems} {totalItems === 1 ? "item" : "items"} · {typesCount}{" "}
            {typesCount === 1 ? "type" : "types"}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-5 px-6 py-5">
        <p className="text-sm text-gray-500">
          Devices ship directly to a Rayda warehouse — no employee delivery is
          required for this order.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {tiles.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white">
                <Icon className="size-5" />
              </span>
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="text-sm font-medium text-gray-600">{label}</p>
                <div className="text-base font-semibold text-gray-900">
                  {value}
                </div>
              </div>
            </div>
          ))}
        </div>
        <StorageOrderNotesV2
          order={order}
          subOrderId={subOrderId}
          focusedNoteIndex={focusedNoteIndex}
        />
        <OrderNotesSection groups={noteGroups} listClassName="max-h-96" />
      </div>
    </div>
  );
};

export default StorageDestinationCardV2;
