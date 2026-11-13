import Link from "next/link";
import { storageAppRoutes } from "../storageAppRoutes";
import type { StorageEquipmentDetailView } from "../types/equipmentDetail";
import { formatDate } from "../utils/deriveDevice";
import { CountryFlag } from "./CountryFlag";
import { LifecycleTimeline } from "./DeviceTimeline";
import { Fact, Section } from "./DrawerPrimitives";
import { SourceBadge, StatusBadge, WipeBadge } from "./StorageBadges";

export function DrawerTrackingTab({
  detail,
}: {
  detail: StorageEquipmentDetailView;
}) {
  const { device, lifecycle } = detail;

  return (
    <div className="flex flex-col gap-5">
      <Section title="Tracking">
        <Fact label="Status">
          <StatusBadge
            status={device.status}
            label={device.storageStatusLabel}
          />
        </Fact>
        <Fact label="Location">
          <span className="flex items-center justify-end gap-2">
            <CountryFlag
              country={device.country}
              countryCode={device.countryCode}
            />
            {device.country}
          </span>
        </Fact>
        <Fact label="Source">
          <SourceBadge source={device.entrySource} label={device.sourceLabel} />
        </Fact>
        <Fact label="Wipe status">
          {device.wipeStatus ? (
            <WipeBadge status={device.wipeStatus} label={device.wipeLabel} />
          ) : (
            <span className="text-sm text-quaternary">—</span>
          )}
        </Fact>
        {device.sourceOrderId && (
          <Fact label="Source order">
            <Link
              href={storageAppRoutes.orderDetails(device.sourceOrderId)}
              className="font-medium text-brand-secondary hover:underline"
            >
              {device.sourceOrderNumber ?? `#${device.sourceOrderId}`}
            </Link>
          </Fact>
        )}
        <Fact label="Storage intake date">{formatDate(device.entryDate)}</Fact>
        <Fact label="Days in storage">{device.daysInStorage ?? 0} days</Fact>
      </Section>
      <Section title="Lifecycle">
        <LifecycleTimeline events={lifecycle} />
      </Section>
    </div>
  );
}
