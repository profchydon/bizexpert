"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStorageFixtures } from "../hooks/useStorageFixtures";
import { useStorageInventory } from "../hooks/useStorageInventory";
import type { RequestStatus } from "../types/storage";
import { pushStorageNotification } from "../utils/storageNotifications";
import type { SupportedCountry } from "./data/supportedCountries";
import type { ImportCollection, ImportRow, OpenFleetImport } from "./types";
import { buildReceipt, receivedRows, rowToDevice } from "./utils/intake";

export function useImportPageFlow() {
  const params = useSearchParams();
  const {
    imports,
    createImport,
    updateImport,
    createRequest,
    addStoredDevices,
    resolveImportRequest,
  } = useStorageInventory();
  const { intakeOutcome, forceSubmitError } = useStorageFixtures();
  const [alert, setAlert] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [resolved, setResolved] = useState(false);
  const ranIntake = useRef<Set<string>>(new Set());

  const notify = (title: string, description: string) =>
    setAlert({ title, description });

  const receiptImport = params.get("receipt")
    ? imports.find((i) => i.id === params.get("receipt"))
    : null;
  const activeImport = activeId ? imports.find((i) => i.id === activeId) : null;

  useEffect(() => {
    if (
      !receiptImport ||
      receiptImport.status !== "pending" ||
      ranIntake.current.has(receiptImport.id)
    )
      return;
    ranIntake.current.add(receiptImport.id);
    const receipt = buildReceipt(receiptImport.devices, intakeOutcome);
    addStoredDevices(
      receivedRows(receiptImport.devices, receipt).map((r) =>
        rowToDevice(r, receiptImport.country, receiptImport.warehouse),
      ),
    );
    updateImport(receiptImport.id, { status: "intake_complete", receipt });
    pushStorageNotification({
      title: "Open Fleet intake complete",
      description: `${receipt.received} of ${receipt.expected} devices received in ${receiptImport.country}. View your Inventory Receipt Report.`,
    });
    if (receipt.variance !== "none") {
      pushStorageNotification({
        type: "approval",
        title: "Open Fleet variance flagged",
        description: `Your ${receiptImport.country} intake needs your attention.`,
      });
    }
  }, [receiptImport, intakeOutcome, addStoredDevices, updateImport]);

  const submit = (
    country: SupportedCountry,
    rows: ImportRow[],
    collection: ImportCollection,
  ) => {
    if (forceSubmitError) {
      return notify(
        "Something went wrong",
        "We couldn't submit your import request. Please try again — your details are saved.",
      );
    }
    const id = `IMP-${Date.now().toString(36).slice(-6)}`;
    const imp: OpenFleetImport = {
      id,
      country: country.country,
      warehouse: country.warehouse,
      devices: rows,
      collection,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    createImport(imp);
    createRequest({
      kind: "open_fleet_import",
      status: "in_progress",
      importId: id,
      deviceName: `${rows.length} device${rows.length === 1 ? "" : "s"}`,
      country: country.country,
      note: `${country.warehouse}${collection.window ? ` · collection ${collection.window}` : ""}`,
    });
    pushStorageNotification({
      title: "Import request submitted",
      description: `${rows.length} device${rows.length === 1 ? "" : "s"} in ${country.country} — we'll arrange collection.`,
    });
    notify(
      "Import request submitted",
      "We'll arrange collection and let you know when your devices arrive.",
    );
    setActiveId(id);
  };

  const resolve = (
    status: RequestStatus,
    title: string,
    description: string,
  ) => {
    if (receiptImport) resolveImportRequest(receiptImport.id, status);
    setResolved(true);
    notify(title, description);
  };

  const acceptWrongItem = () => {
    const line = receiptImport?.receipt?.lines.find(
      (l) => l.status === "quarantined",
    );
    const row = line && receiptImport?.devices.find((d) => d.id === line.id);
    if (row && receiptImport) {
      addStoredDevices([
        rowToDevice(row, receiptImport.country, receiptImport.warehouse),
      ]);
    }
    resolve(
      "completed",
      "Device accepted",
      "The device has been added to your storage.",
    );
  };

  return {
    alert,
    setAlert,
    receiptImport,
    activeImport,
    resolved,
    notify,
    submit,
    resolve,
    acceptWrongItem,
  };
}
