"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle } from "@untitledui/icons";
import { Tabs } from "@/components/application/tabs/tabs";
import { cx } from "@/utils/cx";
import type { ImportRow } from "../types";
import { CsvUploadPanel } from "./CsvUploadPanel";
import { ManualDeviceRows } from "./ManualDeviceRows";

interface Props {
  rows: ImportRow[];
  issues: Map<string, string[]>;
  validCount: number;
  invalidCount: number;
  onChange: (rows: ImportRow[]) => void;
}

const TABS = [
  { id: "manual", label: "Manual entry" },
  { id: "csv", label: "CSV upload" },
];

export function AddDevicesStep({
  rows,
  issues,
  validCount,
  invalidCount,
  onChange,
}: Props) {
  const [mode, setMode] = useState("manual");
  const hasIssues = invalidCount > 0;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold text-primary">
          Add the devices to import
        </h2>
        <p className="mt-1 text-sm text-tertiary">
          Add devices one by one with their spec sheet, or bulk-upload a CSV.
          Only valid rows are imported — flagged rows can be fixed inline or
          removed.
        </p>
      </div>

      <Tabs selectedKey={mode} onSelectionChange={(k) => setMode(String(k))}>
        <Tabs.List type="button-border" items={TABS} className="self-start">
          {(i) => <Tabs.Item id={i.id}>{i.label}</Tabs.Item>}
        </Tabs.List>
      </Tabs>

      {mode === "csv" && (
        <CsvUploadPanel onAppend={(r) => onChange([...rows, ...r])} />
      )}

      {rows.length > 0 && (
        <div
          className={cx(
            "flex items-center gap-2 rounded-lg border p-3 text-sm",
            hasIssues
              ? "border-utility-warning-200 bg-utility-warning-50"
              : "border-utility-success-200 bg-utility-success-50",
          )}
        >
          {hasIssues ? (
            <AlertTriangle className="size-4 shrink-0 text-utility-warning-600" />
          ) : (
            <CheckCircle className="size-4 shrink-0 text-utility-success-600" />
          )}
          <span
            className={
              hasIssues
                ? "text-utility-warning-700"
                : "text-utility-success-700"
            }
          >
            <span className="font-semibold">{validCount} ready to import</span>
            {hasIssues ? ` · ${invalidCount} need fixing` : ""}
          </span>
        </div>
      )}

      <ManualDeviceRows rows={rows} issues={issues} onChange={onChange} />
    </div>
  );
}
