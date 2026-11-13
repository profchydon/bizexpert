"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AiChatMarkdown } from "./AiChatMarkdown";
import { AI_CHAT_PROMPTS, type AiChatMessage } from "./aiChatStorage";
import {
  aiChatBodyClass,
  aiChatBubbleAssistantClass,
  aiChatBubbleUserClass,
  aiChatComposerClass,
  aiChatHeaderClass,
  aiChatPanelClass,
  aiChatPromptClass,
} from "./aiChatClasses";

type Props = {
  messages: AiChatMessage[];
  draft: string;
  isPending: boolean;
  onDraftChange: (value: string) => void;
  onSend: (text: string) => void;
  onClose: () => void;
};

export function AiChatPanel({
  messages,
  draft,
  isPending,
  onDraftChange,
  onSend,
  onClose,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages, isPending]);

  return (
    <div
      className={aiChatPanelClass}
      role="dialog"
      aria-label="BizExpert assistant"
    >
      <div className={aiChatHeaderClass}>
        <div>
          <p className="text-sm font-semibold text-gray-900">
            BizExpert assistant
          </p>
          <p className="text-xs text-gray-500">
            Sales, stock, receipts, transfers
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Close chat"
          onClick={onClose}
        >
          <X className="size-4" />
        </Button>
      </div>
      <div className={aiChatBodyClass}>
        {messages.length === 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Ask about sales, low stock, inventory value, or preview a sale /
              receipt / transfer. Confirm with the action ID when you are ready.
            </p>
            <div className="flex flex-wrap gap-2">
              {AI_CHAT_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className={aiChatPromptClass}
                  onClick={() => onSend(prompt)}
                  disabled={isPending}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        {messages.map((row) =>
          row.role === "user" ? (
            <p key={row.id} className={aiChatBubbleUserClass}>
              {row.content}
            </p>
          ) : (
            <div key={row.id} className={aiChatBubbleAssistantClass}>
              <AiChatMarkdown text={row.content} />
            </div>
          ),
        )}
        {isPending ? (
          <p className={aiChatBubbleAssistantClass}>Thinking…</p>
        ) : null}
        <div ref={bottomRef} />
      </div>
      <form
        className={aiChatComposerClass}
        onSubmit={(event) => {
          event.preventDefault();
          onSend(draft);
        }}
      >
        <textarea
          className="min-h-11 flex-1 resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-primary-600/30"
          rows={2}
          placeholder="Ask BizExpert…"
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSend(draft);
            }
          }}
        />
        <Button
          type="submit"
          size="md"
          isLoading={isPending}
          disabled={!draft.trim()}
        >
          Send
        </Button>
      </form>
    </div>
  );
}
