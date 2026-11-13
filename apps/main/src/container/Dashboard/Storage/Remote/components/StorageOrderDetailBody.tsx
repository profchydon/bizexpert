import Link from "next/link";
import { storageAppRoutes } from "../storageAppRoutes";
import type { StorageOrder } from "../types/storage";
import { buildTimeline } from "../utils/buildDeviceDetail";
import { formatDate } from "../utils/deriveDevice";
import { CountryFlag } from "./CountryFlag";
import { DeviceAvatar } from "./DeviceAvatar";
import { LifecycleTimeline } from "./DeviceTimeline";
import { Fact, Section } from "./DrawerPrimitives";
import {
  GradeBadge,
  MovementBadge,
  OrderTypeBadge,
  SourceBadge,
} from "./StorageBadges";

export function StorageOrderDetailBody({ order }: { order: StorageOrder }) {
  const device = order.device;
  return (
    <div className="flex flex-col gap-5">
      <Section title="Device">
        <div className="flex items-center gap-3">
          <DeviceAvatar
            image={order.image}
            assetType={order.assetType ?? "other"}
            name={order.deviceName}
            size="md"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-primary">
              {order.deviceName}
            </span>
            <span className="text-xs text-tertiary">
              {order.serialNumber ?? "No serial"}
            </span>
          </div>
        </div>
        {order.assetType && (
          <Fact label="Asset type">
            <span className="capitalize">{order.assetType}</span>
          </Fact>
        )}
        <Fact label="Location">
          <span className="flex items-center justify-end gap-2">
            <CountryFlag
              country={order.country}
              countryCode={order.countryCode}
            />
            {order.country}
          </span>
        </Fact>
      </Section>

      <Section title="Order">
        <Fact label="Order ID">{order.orderNumber ?? order.id}</Fact>
        <Fact label="Type">
          <OrderTypeBadge
            kind={order.kind}
            entrySource={order.entrySource}
            flowLabel={order.flowLabel}
          />
        </Fact>
        <Fact label="Movement">
          <MovementBadge
            direction={order.direction}
            directionLabel={order.directionLabel}
          />
        </Fact>
        <Fact label="Date raised">{formatDate(order.createdAt)}</Fact>
      </Section>

      {(order.sourceOrderId ||
        (order.entrySource && order.kind !== "intake")) && (
        <Section title="Source order">
          {order.entrySource && order.kind !== "intake" && (
            <Fact label="Entered via">
              <SourceBadge source={order.entrySource} />
            </Fact>
          )}
          {order.sourceOrderId && (
            <Fact label="Order">
              <Link
                href={storageAppRoutes.orderDetails(order.sourceOrderId)}
                className="font-medium text-brand-secondary hover:underline"
              >
                #{order.sourceOrderId}
              </Link>
            </Fact>
          )}
        </Section>
      )}

      {order.kind === "deployment" && (
        <Section title="Recipient">
          <Fact label="Name">{order.recipientName ?? "—"}</Fact>
          {order.recipientCountry && (
            <Fact label="Destination">{order.recipientCountry}</Fact>
          )}
          {order.note && <p className="text-sm text-tertiary">{order.note}</p>}
        </Section>
      )}

      {order.kind === "disposal" && order.note && (
        <Section title="Disposal">
          <p className="text-sm text-secondary">{order.note}</p>
        </Section>
      )}

      {order.kind === "device_check" && (
        <Section title="Device check">
          {order.note && <p className="text-sm text-secondary">{order.note}</p>}
          {device?.grade && (
            <Fact label="Latest grade">
              <GradeBadge grade={device.grade} label={device.gradeLabel} />
            </Fact>
          )}
          {device?.grade && device?.lastCheckDate && (
            <Fact label="Last checked">
              {formatDate(device.lastCheckDate)}
              {device.gradeLabel ? ` · ${device.gradeLabel}` : ""}
            </Fact>
          )}
        </Section>
      )}

      {order.kind === "open_fleet_import" && (
        <Section title="Import">
          {order.note && <p className="text-sm text-secondary">{order.note}</p>}
          {order.importId && (
            <Link
              href={`${storageAppRoutes.storageImport}?receipt=${order.importId}`}
              className="text-sm font-semibold text-brand-secondary hover:text-brand-secondary_hover"
            >
              View report
            </Link>
          )}
        </Section>
      )}

      {device && (
        <Section title="Lifecycle">
          <LifecycleTimeline events={buildTimeline(device)} />
        </Section>
      )}
    </div>
  );
}
