import React from "react";
import { RaydaAvatar } from "./RaydaAvatar";

function TypingDots({ senderName }: { senderName: string }) {
  return (
    <div className="flex max-w-[312px] items-start gap-3">
      <RaydaAvatar size={40} />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="text-sm font-medium text-gray-700">{senderName}</span>
        <div className="inline-flex items-center gap-1 py-1">
          <span
            className="size-1.5 animate-bounce rounded-full bg-primary-600"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="size-1.5 animate-bounce rounded-full bg-primary-600"
            style={{ animationDelay: "160ms" }}
          />
          <span
            className="size-1.5 animate-bounce rounded-full bg-primary-600"
            style={{ animationDelay: "320ms" }}
          />
        </div>
      </div>
    </div>
  );
}

export { TypingDots };
