import React from "react";
import { Download } from "lucide-react";
import { FileTypeIcon } from "./FileTypeIcon";
import { ChatFile } from "./types";

function ChatFileCard({ file }: { file: ChatFile }) {
  return (
    <a
      href={file.url ?? "#"}
      download={file.name}
      target={file.url ? "_blank" : undefined}
      rel="noopener noreferrer"
      onClick={(e) => {
        if (!file.url) e.preventDefault();
      }}
      className="group/file flex max-w-64 items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 transition-colors hover:bg-gray-50"
    >
      <FileTypeIcon ext={file.ext} className="size-10 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">
          {file.name}
        </p>
        <p className="text-xs text-gray-500">{file.size}</p>
      </div>
      <Download className="size-5 shrink-0 text-gray-400 transition-colors group-hover/file:text-primary-600" />
    </a>
  );
}

export { ChatFileCard };
