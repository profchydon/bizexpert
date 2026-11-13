import React from "react";
import { Copy, CornerUpLeft, Pencil } from "lucide-react";
import { ChatMessage } from "./types";

function ActionBtn({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className="flex size-6 items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
    >
      {icon}
    </button>
  );
}

function MessageActions({
  msg,
  onReply,
  onCopy,
  onEdit,
}: {
  msg: ChatMessage;
  onReply: (msg: ChatMessage) => void;
  onCopy: (msg: ChatMessage) => void;
  onEdit?: (msg: ChatMessage) => void;
}) {
  return (
    <div className="flex items-center gap-0.5 rounded-md border border-gray-200 bg-white p-0.5 shadow-sm">
      <ActionBtn
        icon={<CornerUpLeft className="size-3.5" />}
        label="Reply"
        onClick={() => onReply(msg)}
      />
      <ActionBtn
        icon={<Copy className="size-3.5" />}
        label="Copy"
        onClick={() => onCopy(msg)}
      />
      {msg.sender === "customer" && onEdit && (
        <ActionBtn
          icon={<Pencil className="size-3.5" />}
          label="Edit"
          onClick={() => onEdit(msg)}
        />
      )}
    </div>
  );
}

export { MessageActions };
