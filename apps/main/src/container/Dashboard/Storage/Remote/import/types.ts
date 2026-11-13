import type { ExtendedSpecRow } from "@/components/application/spec-fields/ExtendedSpecsList";
import { type SpecValues, createEmptySpecValues } from "@/lib/spec-schema";

export interface ImportRow {
  id: string;
  deviceName: string;
  assetType: string | null;
  serial: string;
  specs: SpecValues; // brand, model_name, condition + asset-type-specific fields
  extendedSpecs: ExtendedSpecRow[];
  notes?: string;
}

export function createEmptyRow(id: string): ImportRow {
  return {
    id,
    deviceName: "",
    assetType: null,
    serial: "",
    specs: createEmptySpecValues(),
    extendedSpecs: [],
    notes: "",
  };
}

export interface RowIssue {
  rowId: string;
  errors: string[];
}

export interface ImportCollection {
  address: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  window: string;
  employeeId?: string; // set when collecting from an employee in the directory
}

export type IntakeOutcome = "none" | "shortfall" | "surplus" | "wrong_item";

export type LineStatus = "received" | "missing" | "surplus" | "quarantined";

export interface ReceiptLine {
  id: string;
  deviceName: string;
  serial: string;
  deviceType: string;
  status: LineStatus;
  grade?: string;
}

export interface ImportReceipt {
  expected: number;
  received: number;
  variance: IntakeOutcome;
  lines: ReceiptLine[];
}

export interface OpenFleetImport {
  id: string;
  country: string;
  warehouse: string;
  devices: ImportRow[];
  collection: ImportCollection;
  status: "pending" | "intake_complete";
  createdAt: string;
  receipt?: ImportReceipt;
}
