import React, { useCallback, useEffect, useState } from "react";
import { ChatComposer } from "./ChatComposer";
import { ChatMessageList } from "./ChatMessageList";
import { ChatMessage } from "./types";

interface OrderChatPanelProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  onSend: (text: string, files?: File[], quotedMessageId?: string) => void;
  onEditSave: (msgId: string, newText: string) => Promise<boolean>;
  onFirstView?: () => void;
}

function OrderChatPanel({
  messages,
  isLoading,
  onSend,
  onEditSave,
  onFirstView,
}: OrderChatPanelProps) {
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(
    null,
  );

  useEffect(() => {
    onFirstView?.();
  }, [onFirstView]);

  const handleSend = useCallback(
    (text: string, files?: File[]) => {
      onSend(text, files, replyTo?.id);
      setReplyTo(null);
    },
    [replyTo, onSend],
  );

  const handleCopy = useCallback((msg: ChatMessage) => {
    navigator.clipboard.writeText(msg.message);
  }, []);

  const handleEditSave = useCallback(
    async (msgId: string, newText: string) => {
      const ok = await onEditSave(msgId, newText);
      if (ok) setEditingMessage(null);
    },
    [onEditSave],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.1),0px_1px_2px_rgba(16,24,40,0.06)]">
      <div className="px-6 pt-5">
        <p className="text-lg font-semibold text-gray-900">Chat</p>
      </div>
      <div className="mt-4 h-px w-full bg-gray-200" />
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1">
          {isLoading && messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              Loading conversation...
            </div>
          ) : (
            <ChatMessageList
              messages={messages}
              onReply={(msg) => {
                setEditingMessage(null);
                setReplyTo(msg);
              }}
              onCopy={handleCopy}
              onEdit={(msg) => {
                setReplyTo(null);
                setEditingMessage(msg);
              }}
            />
          )}
        </div>
        <ChatComposer
          onSend={handleSend}
          replyTo={replyTo}
          editingMessage={editingMessage}
          onCancelReply={() => setReplyTo(null)}
          onCancelEdit={() => setEditingMessage(null)}
          onEditSave={handleEditSave}
        />
      </div>
    </div>
  );
}

export { OrderChatPanel };
