import React, { useEffect, useRef, useState } from "react";
import { Paperclip, Send, X } from "lucide-react";
import { FileTypeIcon } from "./FileTypeIcon";
import { ChatMessage } from "./types";

interface ChatComposerProps {
  onSend: (message: string, files?: File[]) => void;
  replyTo?: ChatMessage | null;
  editingMessage?: ChatMessage | null;
  onCancelReply?: () => void;
  onCancelEdit?: () => void;
  onEditSave?: (msgId: string, newText: string) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getExt(name: string): string {
  return name.split(".").pop()?.toUpperCase() ?? "";
}

function ChatComposer({
  onSend,
  replyTo,
  editingMessage,
  onCancelReply,
  onCancelEdit,
  onEditSave,
}: ChatComposerProps) {
  const [text, setText] = useState("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingMessage) {
      setText(editingMessage.message);
      inputRef.current?.focus();
    } else {
      setText("");
    }
  }, [editingMessage]);

  useEffect(() => {
    if (replyTo) inputRef.current?.focus();
  }, [replyTo]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length) setPendingFiles((prev) => [...prev, ...files]);
    e.target.value = "";
    inputRef.current?.focus();
  }

  function removeFile(index: number) {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed && !pendingFiles.length) return;
    if (editingMessage) {
      onEditSave?.(editingMessage.id, trimmed);
      setText("");
      return;
    }
    onSend(trimmed, pendingFiles.length ? pendingFiles : undefined);
    setText("");
    setPendingFiles([]);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === "Escape") {
      if (editingMessage) onCancelEdit?.();
      else if (replyTo) onCancelReply?.();
    }
  }

  const banner = editingMessage ?? replyTo;
  const bannerLabel = editingMessage ? "Editing message" : replyTo?.senderName;
  const replyPreview = replyTo?.message || replyTo?.files?.[0]?.name;

  return (
    <div className="w-full shrink-0 border-t border-gray-200 shadow-[0_-6px_12px_-2px_rgba(16,24,40,0.1)]">
      {banner && (
        <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-primary-600">
              {bannerLabel}
            </p>
            <p className="flex items-center gap-1 truncate text-xs text-gray-500">
              {!editingMessage && replyTo?.files?.length ? (
                <Paperclip className="inline size-3 shrink-0" />
              ) : null}
              {editingMessage ? editingMessage.message : replyPreview}
            </p>
          </div>
          <button
            type="button"
            onClick={editingMessage ? onCancelEdit : onCancelReply}
            className="shrink-0 text-gray-400 hover:text-gray-700"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
      {pendingFiles.map((file, index) => (
        <div
          key={`${file.name}-${index}`}
          className="flex items-center gap-3 border-b border-gray-200 px-6 py-2"
        >
          <FileTypeIcon ext={getExt(file.name)} className="size-8 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-gray-900">
              {file.name}
            </p>
            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={() => removeFile(index)}
            className="shrink-0 text-gray-400 hover:text-gray-700"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
      <div className="flex items-center gap-2 px-6 py-4">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex size-11 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700"
        >
          <Paperclip className="size-5" />
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={editingMessage ? "Edit message..." : "Message"}
          className="h-11 min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          type="button"
          disabled={!text.trim() && !pendingFiles.length}
          onClick={handleSend}
          className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white shadow-sm transition-opacity disabled:opacity-40"
        >
          <Send className="size-5" />
        </button>
      </div>
    </div>
  );
}

export { ChatComposer };
