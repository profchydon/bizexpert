import type { ImportRow } from "../types";
import { mapRowColumns, normalizeAssetType } from "./csvSpecMap";

const MAX_ROWS = 500;

function parseLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (const c of line) {
    if (c === '"') quoted = !quoted;
    else if (c === "," && !quoted) {
      out.push(cur.trim());
      cur = "";
    } else cur += c;
  }
  out.push(cur.trim());
  return out;
}

function colIndex(headers: string[], ...terms: string[]): number {
  return headers.findIndex((h) => terms.some((t) => h.includes(t)));
}

export interface ParseResult {
  rows: ImportRow[];
  error?: string;
}

export function parseCsv(text: string): ParseResult {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0);
  if (lines.length < 2)
    return {
      rows: [],
      error:
        "We couldn't read this file. Use the Open Fleet template and keep it under 500 rows.",
    };
  const data = lines.slice(1);
  if (data.length > MAX_ROWS)
    return {
      rows: [],
      error: `That file has ${data.length} rows. Keep it under ${MAX_ROWS} rows.`,
    };

  const rawHeaders = parseLine(lines[0]);
  const headers = rawHeaders.map((h) => h.toLowerCase());
  const si = colIndex(headers, "serial");
  const di = colIndex(headers, "name"); // device name
  let ai = colIndex(headers, "asset");
  if (ai < 0)
    ai = headers.findIndex((h) => h === "type" || h.includes("device type"));
  const ni = colIndex(headers, "note");
  const specCols = rawHeaders
    .map((h, i) => ({ h, i }))
    .filter(({ i }) => i !== si && i !== ai && i !== ni && i !== di);

  const rows = data.map((line, idx) => {
    const c = parseLine(line);
    const assetType = ai >= 0 ? normalizeAssetType(c[ai] ?? "") : null;
    const columns = specCols.map(({ h, i }) => ({
      header: h,
      value: c[i] ?? "",
    }));
    const { specs, extendedSpecs } = mapRowColumns(assetType, columns);
    const deviceName =
      (di >= 0 ? (c[di] ?? "").trim() : "") ||
      (typeof specs.model_name === "string" ? specs.model_name : "");
    return {
      id: `csv-${idx}`,
      deviceName,
      assetType,
      serial: si >= 0 ? (c[si] ?? "") : "",
      specs,
      extendedSpecs,
      notes: ni >= 0 ? c[ni] : undefined,
    };
  });
  return { rows };
}

/** Map of rowId → list of validation errors (rows without errors are absent). */
export function validateRows(rows: ImportRow[]): Map<string, string[]> {
  const issues = new Map<string, string[]>();
  const counts = new Map<string, number>();
  for (const r of rows) {
    const key = r.serial.trim().toLowerCase();
    if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  for (const r of rows) {
    const errs: string[] = [];
    if (!r.deviceName.trim()) errs.push("Device name required");
    if (!r.serial.trim()) errs.push("Serial required");
    if (!r.assetType) errs.push("Asset type required");
    const key = r.serial.trim().toLowerCase();
    if (key && (counts.get(key) ?? 0) > 1) errs.push("Duplicate serial");
    if (errs.length) issues.set(r.id, errs);
  }
  return issues;
}

export function downloadTemplate() {
  if (typeof window === "undefined") return;
  const csv =
    [
      "Device Name,Serial,Asset Type,Brand,Model,Condition,RAM (GB),Storage,Screen Size (in)",
      "MacBook Pro 14,C02ABC123,Laptop,Apple,MacBook Pro 14-inch (2024),Used - Good,16,512GB SSD,14",
      "Dell UltraSharp U2723,SN-DELL-001,Monitor,Dell,UltraSharp U2723,New,,,27",
      "Logitech MX Keys S,SN-LOG-77,Keyboard,Logitech,MX Keys S,Used - Good,,,",
    ].join("\n") + "\n";
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "open-fleet-import-template.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
