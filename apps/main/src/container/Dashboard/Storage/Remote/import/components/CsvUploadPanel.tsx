"use client";

import { useState } from "react";
import { Download01 } from "@untitledui/icons";
import { FileListItemProgressBar } from "@/components/application/file-upload/file-upload-base";
import { FileUpload } from "@/components/application/file-upload/file-upload-drop-zone";
import { Button } from "@/components/base/buttons/button";
import type { ImportRow } from "../types";
import { downloadTemplate, parseCsv } from "../utils/csv";

export function CsvUploadPanel({
  onAppend,
}: {
  onAppend: (rows: ImportRow[]) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    name: string;
    size: number;
    count: number;
  } | null>(null);

  const handleFiles = (files: FileList) => {
    setError(null);
    const file = files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const parsed = parseCsv(String(e.target?.result ?? ""));
      if (parsed.error) {
        setResult(null);
        return setError(parsed.error);
      }
      const stamped = parsed.rows.map((r, i) => ({
        ...r,
        id: `csv-${Date.now().toString(36)}-${i}`,
      }));
      onAppend(stamped);
      setResult({ name: file.name, size: file.size, count: stamped.length });
    };
    reader.onerror = () =>
      setError(
        "We couldn't read this file. Use the Open Fleet template and keep it under 500 rows.",
      );
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-secondary bg-secondary p-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-secondary">
            Bulk upload with a CSV
          </span>
          <span className="text-xs text-tertiary">
            Columns: Device Name, Serial, Asset Type, Brand, Model, Condition —
            plus any spec columns (e.g. RAM, Storage). Extra columns map to
            specs automatically.
          </span>
        </div>
        <Button
          size="sm"
          color="secondary"
          iconLeading={Download01}
          onClick={downloadTemplate}
          data-testid="csvuploadpanel-button"
        >
          Download template
        </Button>
      </div>

      {result ? (
        <div className="flex flex-col gap-2">
          <FileListItemProgressBar
            name={result.name}
            size={result.size}
            progress={100}
            type={result.name.split(".").pop() ?? "csv"}
            onDelete={() => setResult(null)}
          />
          <p className="text-sm text-success-primary">
            Added {result.count} device{result.count === 1 ? "" : "s"} — review
            and fix any flagged below. Upload another file to add more.
          </p>
        </div>
      ) : (
        <FileUpload.DropZone
          accept=".csv,text/csv"
          allowsMultiple={false}
          hint="CSV only, up to 500 rows"
          onDropFiles={handleFiles}
        />
      )}
      {error && (
        <p className="rounded-lg border border-utility-error-200 bg-utility-error-50 p-2.5 text-sm text-utility-error-700">
          {error}
        </p>
      )}
    </div>
  );
}
