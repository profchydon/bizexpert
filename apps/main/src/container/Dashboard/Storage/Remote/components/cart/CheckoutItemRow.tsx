"use client";

import type { FC, ReactNode } from "react";
import {
  ArrowRight,
  PackageSearch,
  Send01,
  ShieldTick,
  Trash01,
  Trash02,
} from "@untitledui/icons";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { CountryFlag } from "../CountryFlag";
import { DeviceAvatar } from "../DeviceAvatar";
import type { CheckoutItem } from "../../hooks/useStorageCheckout";
import type { StoredDevice } from "../../types/storage";
import { formatMoney } from "../../utils/storagePricing";

function disposition(it: CheckoutItem): {
  Icon: FC<{ className?: string }>;
  tint: string;
  content: ReactNode;
} {
  if (it.kind === "deployment") {
    const fresh = it.checkNote?.toLowerCase().includes("fresh")
      ? " · fresh check"
      : "";
    const wipe = it.wipeRequested ? " · wipe before ship" : "";
    const to = `${it.recipientName ?? "employee"}${it.recipientCountry ? `, ${it.recipientCountry}` : ""}`;
    return {
      Icon: Send01,
      tint: "bg-brand-50 text-brand-700",
      content: `Ship to ${to}${fresh}${wipe}`,
    };
  }
  if (it.kind === "disposal") {
    if (it.disposalMethod === "destroy") {
      return {
        Icon: Trash01,
        tint: "bg-error-50 text-error-700",
        content: "Certificate of destruction",
      };
    }
    if (it.erasureWaived) {
      return {
        Icon: ShieldTick,
        tint: "bg-secondary text-tertiary",
        content: "Erasure waived · certificate on file",
      };
    }
    return {
      Icon: ShieldTick,
      tint: "bg-success-50 text-success-700",
      content: (
        <>
          Certified erasure
          <ArrowRight className="size-3 shrink-0" />
          Impact Program
        </>
      ),
    };
  }
  return {
    Icon: PackageSearch,
    tint: "bg-secondary text-tertiary",
    content: it.checkNote || "Re-grade check",
  };
}

interface Props {
  item: CheckoutItem;
  device?: StoredDevice;
  displayFee?: number;
  onRemove?: (id: string) => void;
}

export function CheckoutItemRow({ item, device, displayFee, onRemove }: Props) {
  const { Icon, tint, content } = disposition(item);

  return (
    <li className="flex items-center gap-3 py-3">
      <DeviceAvatar
        image={item.image ?? device?.image}
        assetType={item.assetType ?? device?.assetType ?? "other"}
        name={item.deviceName}
        size="md"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="truncate text-sm font-medium text-primary">
          {item.deviceName}
        </span>
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <span className="inline-flex min-w-0 items-center gap-1.5 text-xs text-tertiary">
            <CountryFlag
              country={item.country}
              className="size-3.5 shrink-0 rounded-full"
            />
            <span className="truncate">
              {item.country} · {item.serialNumber}
            </span>
          </span>
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium whitespace-nowrap ${tint}`}
          >
            <Icon className="size-3 shrink-0" />
            {content}
          </span>
        </div>
      </div>
      <span className="shrink-0 text-sm font-semibold text-primary">
        {formatMoney(displayFee ?? 0, item.currency)}
      </span>
      {onRemove ? (
        <ButtonUtility
          size="sm"
          color="tertiary"
          icon={Trash02}
          tooltip="Remove"
          onClick={() => onRemove(item.id)}
        />
      ) : null}
    </li>
  );
}
