import { SOURCE_LABEL } from "../data/storageMeta";
import type {
  OrderDirection,
  RequestKind,
  StorageOrder,
  StorageRequest,
  StoredDevice,
} from "../types/storage";

const DIRECTION_BY_KIND: Record<RequestKind, OrderDirection> = {
  deployment: "outbound",
  disposal: "outbound",
  device_check: "service",
  open_fleet_import: "inbound",
};

/** Resolve the device a request refers to, by id first then serial number. */
function linkDevice(
  request: StorageRequest,
  byId: Map<string, StoredDevice>,
  bySerial: Map<string, StoredDevice>,
) {
  if (request.deviceId) return byId.get(request.deviceId);
  if (request.serialNumber) return bySerial.get(request.serialNumber);
  return undefined;
}

/**
 * Merge customer action records (StorageRequest) with synthesized inbound
 * "intake" rows from each device's entry data into one ordered movement log.
 * Open Fleet devices are skipped here — their bulk import request already
 * represents the inbound movement.
 */
export function buildStorageOrders(
  devices: StoredDevice[],
  requests: StorageRequest[],
): StorageOrder[] {
  const byId = new Map(devices.map((d) => [d.id, d]));
  const bySerial = new Map(
    devices.filter((d) => d.serialNumber).map((d) => [d.serialNumber, d]),
  );

  const fromRequests: StorageOrder[] = requests.map((r) => {
    const device = linkDevice(r, byId, bySerial);
    return {
      id: r.id,
      kind: r.kind,
      direction: DIRECTION_BY_KIND[r.kind],
      status: r.status,
      deviceId: r.deviceId ?? device?.id,
      deviceName: r.deviceName,
      serialNumber: r.serialNumber,
      assetType: r.assetType ?? device?.assetType,
      image: r.image ?? device?.image,
      country: r.country,
      createdAt: r.createdAt,
      note: r.note,
      importId: r.importId,
      recipientName: r.recipientName,
      recipientCountry: r.recipientCountry,
      entrySource: device?.entrySource,
      sourceOrderId: device?.sourceOrderId,
      device,
    };
  });

  const intakes: StorageOrder[] = devices
    .filter((d) => d.entrySource !== "open_fleet")
    .map((d) => ({
      id: `INTK-${d.id}`,
      kind: "intake",
      direction: "inbound",
      status: "completed",
      deviceId: d.id,
      deviceName: d.deviceName,
      serialNumber: d.serialNumber,
      assetType: d.assetType,
      image: d.image,
      country: d.country,
      createdAt: d.entryDate,
      note: `${SOURCE_LABEL[d.entrySource]} · ${d.warehouse}, ${d.country}`,
      entrySource: d.entrySource,
      sourceOrderId: d.sourceOrderId,
      device: d,
    }));

  return [...fromRequests, ...intakes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
