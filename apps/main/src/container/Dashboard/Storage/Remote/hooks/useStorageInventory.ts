"use client";

import { useCallback, useMemo } from "react";
import { useSessionPersistedState } from "@/hooks/useSessionPersistedState";
import { storageInventorySeed } from "../data/storageInventorySeed";
import {
  donatedDevicesSeed,
  storageRequestsSeed,
} from "../data/storageRequestsSeed";
import type { OpenFleetImport } from "../import/types";
import type {
  DonatedDevice,
  Grade,
  RequestKind,
  RequestStatus,
  StorageRequest,
  StorageStatus,
  StoredDevice,
} from "../types/storage";
import { buildStorageOrders } from "../utils/buildStorageOrders";
import { needsAction } from "../utils/deriveDevice";

let requestSeq = 0;

export interface StorageSummary {
  total: number;
  countries: number;
  topCountry: string;
  byGrade: Record<Grade, number>;
  pendingAction: number;
  donatedCount: number;
  ewasteKg: number;
  beneficiaries: number;
  activeRequests: number;
}

export interface NewRequestInput {
  kind: RequestKind;
  status?: RequestStatus;
  deviceId?: string;
  deviceName: string;
  serialNumber?: string;
  assetType?: string;
  image?: string;
  country: string;
  note?: string;
  importId?: string;
  recipientName?: string;
  recipientCountry?: string;
}

export function useStorageInventory() {
  const [storedDevices, setDevices] = useSessionPersistedState<StoredDevice[]>(
    "rr-storage-inventory-v5",
    storageInventorySeed,
  );
  const [requests, setRequests] = useSessionPersistedState<StorageRequest[]>(
    "rr-storage-requests-v3",
    storageRequestsSeed,
  );

  const devices = useMemo(() => {
    const seedById = new Map(storageInventorySeed.map((d) => [d.id, d]));
    return storedDevices.map((d) => {
      const seed = seedById.get(d.id);
      return seed && d.sourceOrderId === undefined
        ? { ...d, sourceOrderId: seed.sourceOrderId }
        : d;
    });
  }, [storedDevices]);
  const [donated] = useSessionPersistedState<DonatedDevice[]>(
    "rr-storage-donated-v1",
    donatedDevicesSeed,
  );
  const [imports, setImports] = useSessionPersistedState<OpenFleetImport[]>(
    "rr-storage-imports-v1",
    [],
  );

  const setDeviceStatus = useCallback(
    (id: string, status: StorageStatus) =>
      setDevices((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status } : d)),
      ),
    [setDevices],
  );

  const addStoredDevices = useCallback(
    (newDevices: StoredDevice[]) =>
      setDevices((prev) => [...newDevices, ...prev]),
    [setDevices],
  );

  const createRequest = useCallback(
    (input: NewRequestInput) =>
      setRequests((prev) => [
        {
          id: `REQ-${Date.now().toString().slice(-5)}-${(requestSeq++).toString(36)}`,
          status: input.status ?? "requested",
          createdAt: new Date().toISOString(),
          kind: input.kind,
          deviceId: input.deviceId,
          deviceName: input.deviceName,
          serialNumber: input.serialNumber,
          assetType: input.assetType,
          image: input.image,
          country: input.country,
          note: input.note,
          importId: input.importId,
          recipientName: input.recipientName,
          recipientCountry: input.recipientCountry,
        },
        ...prev,
      ]),
    [setRequests],
  );

  const resolveImportRequest = useCallback(
    (importId: string, status: RequestStatus) =>
      setRequests((prev) =>
        prev.map((r) => (r.importId === importId ? { ...r, status } : r)),
      ),
    [setRequests],
  );

  const createImport = useCallback(
    (imp: OpenFleetImport) => setImports((prev) => [imp, ...prev]),
    [setImports],
  );

  const updateImport = useCallback(
    (id: string, patch: Partial<OpenFleetImport>) =>
      setImports((prev) =>
        prev.map((i) => (i.id === id ? { ...i, ...patch } : i)),
      ),
    [setImports],
  );

  const summary = useMemo<StorageSummary>(() => {
    const live = devices.filter(
      (d) => d.status !== "disposed" && d.status !== "donated",
    );
    const byCountry = new Map<string, number>();
    const byGrade: Record<Grade, number> = { A: 0, B: 0, C: 0, D: 0 };
    for (const d of live) {
      byCountry.set(d.country, (byCountry.get(d.country) ?? 0) + 1);
      if (d.grade) byGrade[d.grade] += 1;
    }
    const top = [...byCountry.entries()].sort((a, b) => b[1] - a[1])[0];
    return {
      total: live.length,
      countries: byCountry.size,
      topCountry: top ? `${top[0]} (${top[1]})` : "—",
      byGrade,
      pendingAction: live.filter(needsAction).length,
      donatedCount: donated.length,
      ewasteKg:
        Math.round(donated.reduce((sum, d) => sum + d.ewasteKg, 0) * 10) / 10,
      beneficiaries: donated.length * 3,
      activeRequests: requests.filter(
        (r) =>
          r.status === "in_progress" ||
          r.status === "requested" ||
          r.status === "action_required",
      ).length,
    };
  }, [devices, donated, requests]);

  const orders = useMemo(
    () => buildStorageOrders(devices, requests),
    [devices, requests],
  );

  return {
    devices,
    requests,
    orders,
    donated,
    imports,
    summary,
    setDeviceStatus,
    addStoredDevices,
    createRequest,
    createImport,
    updateImport,
    resolveImportRequest,
  };
}
