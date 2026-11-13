import React from "react";
import {
  HardDrive,
  Headphones,
  Keyboard,
  Laptop,
  Monitor,
  Package,
  Smartphone,
  Tablet,
  type LucideIcon,
} from "lucide-react";
import CustomTooltip from "@/components/CustomTooltip";
import { IOrder, ISubOrder } from "@/types/orders";

const MAX_VISIBLE = 4;

const ICON_BY_TYPE: { match: RegExp; icon: LucideIcon; tint: string }[] = [
  {
    match: /laptop|macbook/i,
    icon: Laptop,
    tint: "bg-primary-50 text-primary-700",
  },
  {
    match: /desktop|imac|pc/i,
    icon: Monitor,
    tint: "bg-purple-50 text-purple-700",
  },
  {
    match: /phone|iphone|android/i,
    icon: Smartphone,
    tint: "bg-secondary-100 text-secondary-700",
  },
  {
    match: /tablet|ipad/i,
    icon: Tablet,
    tint: "bg-primary-50 text-primary-700",
  },
  {
    match: /monitor|display|screen/i,
    icon: Monitor,
    tint: "bg-success-50 text-success-700",
  },
  {
    match: /keyboard|mouse|input/i,
    icon: Keyboard,
    tint: "bg-purple-50 text-purple-700",
  },
  {
    match: /headphone|audio|headset/i,
    icon: Headphones,
    tint: "bg-error-50 text-error-700",
  },
  {
    match: /dock|drive|storage/i,
    icon: HardDrive,
    tint: "bg-gray-100 text-gray-700",
  },
];

const NEUTRAL_TINT = "bg-gray-100 text-gray-600";

function resolveIcon(label: string) {
  return ICON_BY_TYPE.find((entry) => entry.match.test(label));
}

function summarizeDevices(order: IOrder) {
  const raw = (order?.sub_orders as any)?.data ?? order?.sub_orders;
  let subOrders: ISubOrder[] = [];
  if (Array.isArray(raw)) {
    subOrders = raw as ISubOrder[];
  } else if (Array.isArray(raw?.data)) {
    subOrders = raw.data as ISubOrder[];
  }

  const counts = new Map<string, number>();
  subOrders.forEach((sub) => {
    const assets = sub.assets ?? [];
    if (assets.length > 0) {
      assets.forEach((asset) => {
        const label = asset?.category || asset?.type || "Accessory";
        // Assets in the array are usually single instances, but we'll use sub.quantity if it's acting as a multiplier,
        // though typically sub.assets.length implies multiple distinct items. We'll add 1 per asset.
        counts.set(label, (counts.get(label) ?? 0) + 1);
      });
      return;
    }
    if (sub.equipment) {
      const label =
        sub.equipment.type ||
        `${sub.equipment.make || ""} ${sub.equipment.model || ""}`.trim() ||
        "Device";
      counts.set(label, (counts.get(label) ?? 0) + (sub.quantity ?? 1));
    } else if (
      (sub as any).equipment_id ||
      (sub as any).asset_id ||
      sub.order_details?.equipment_id ||
      sub.order_details?.asset_id
    ) {
      counts.set("Device", (counts.get("Device") ?? 0) + (sub.quantity ?? 1));
    }
  });

  return Array.from(counts.entries())
    .map(([label, quantity]) => ({ label, quantity }))
    .sort((a, b) => b.quantity - a.quantity);
}

const OrderDevicesCell: React.FC<{ order: IOrder }> = ({ order }) => {
  const devices = summarizeDevices(order);
  if (devices.length === 0) {
    return <span className="text-sm text-gray-500">—</span>;
  }

  const visible = devices.slice(0, MAX_VISIBLE);
  const overflow = devices.length - MAX_VISIBLE;

  const tooltip = (
    <div className="flex min-w-[160px] flex-col gap-1.5 text-white">
      {devices.map(({ label, quantity }) => (
        <div key={label} className="flex items-center gap-2">
          <span className="text-xs font-semibold">{label}</span>
          <span className="ml-auto text-xs text-gray-300">×{quantity}</span>
        </div>
      ))}
    </div>
  );

  return (
    <CustomTooltip content={tooltip}>
      <div className="flex -space-x-1.5">
        {visible.map(({ label }) => {
          const resolved = resolveIcon(label);
          const Icon = resolved?.icon ?? Package;
          return (
            <span
              key={label}
              className={`relative flex size-7 shrink-0 items-center justify-center rounded-full ring-2 ring-white ${resolved?.tint ?? NEUTRAL_TINT}`}
            >
              <Icon className="size-3.5" />
            </span>
          );
        })}
        {overflow > 0 && (
          <span
            className={`relative flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium ring-2 ring-white ${NEUTRAL_TINT}`}
          >
            +{overflow}
          </span>
        )}
      </div>
    </CustomTooltip>
  );
};

export default OrderDevicesCell;
