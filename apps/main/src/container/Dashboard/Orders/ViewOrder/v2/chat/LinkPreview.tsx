import React from "react";
import { ExternalLink } from "lucide-react";
import { ChatLink } from "./types";

function LinkPreview({ link }: { link: ChatLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 overflow-hidden rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:bg-gray-50"
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50">
        <ExternalLink className="size-4 text-gray-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">
          {link.title}
        </p>
        {link.description && (
          <p className="truncate text-xs text-gray-500">{link.description}</p>
        )}
      </div>
    </a>
  );
}

export { LinkPreview };
