import React from "react";
import { cn } from "@/lib/utils";

const EXT_COLORS: Record<string, string> = {
  PDF: "bg-error-500",
  DOC: "bg-primary-500",
  DOCX: "bg-primary-500",
  XLS: "bg-success-500",
  XLSX: "bg-success-500",
  CSV: "bg-success-500",
  PNG: "bg-purple-500",
  JPG: "bg-purple-500",
  JPEG: "bg-purple-500",
  ZIP: "bg-warning-500",
};

function FileTypeIcon({ ext, className }: { ext: string; className?: string }) {
  const label = (ext || "FILE").slice(0, 4);
  const color = EXT_COLORS[ext?.toUpperCase()] || "bg-gray-500";
  return (
    <div
      className={cn(
        "relative flex items-end justify-center overflow-hidden rounded-md border border-gray-200 bg-white",
        className,
      )}
    >
      <span
        className={cn(
          "mb-1 rounded px-1 py-0.5 text-[9px] font-bold leading-none text-white",
          color,
        )}
      >
        {label}
      </span>
    </div>
  );
}

export { FileTypeIcon };
