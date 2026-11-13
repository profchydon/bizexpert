import React, { useEffect, useRef } from "react";
import { formatDateLabel } from "./chatHelpers";
import { ChatBubble } from "./ChatBubble";
import { TypingDots } from "./TypingDots";
import { ChatMessage } from "./types";

function ChatMessageList({
  messages,
  isTyping,
  typingName,
  onReply,
  onCopy,
  onEdit,
}: {
  messages: ChatMessage[];
  isTyping?: boolean;
  typingName?: string;
  onReply?: (msg: ChatMessage) => void;
  onCopy?: (msg: ChatMessage) => void;
  onEdit?: (msg: ChatMessage) => void;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTyping]);

  return (
    <div className="h-full w-full overflow-y-auto px-4 py-4 md:px-6">
      <div className="flex flex-col gap-4">
        {messages.map((msg, i) => {
          const dateKey = new Date(msg.epoch).toDateString();
          const showDivider =
            i === 0 ||
            dateKey !== new Date(messages[i - 1].epoch).toDateString();
          return (
            <div key={msg.id}>
              {showDivider && (
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="shrink-0 text-sm font-medium text-gray-500">
                    {formatDateLabel(msg.epoch)}
                  </span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>
              )}
              <ChatBubble
                msg={msg}
                onReply={onReply}
                onCopy={onCopy}
                onEdit={onEdit}
              />
            </div>
          );
        })}
        {isTyping && (
          <div>
            <TypingDots senderName={typingName ?? "Someone"} />
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}

export { ChatMessageList };
