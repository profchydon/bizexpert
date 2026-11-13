"use client";

import { MessageCircle } from "lucide-react";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import { aiChatFabClass } from "./aiChatClasses";
import { AiChatPanel } from "./AiChatPanel";
import { useAiChat } from "./useAiChat";

export function AiChatWidget() {
  const { businessId } = useBizExpertBusiness();
  const chat = useAiChat(businessId);

  if (!businessId) return null;

  return (
    <>
      {chat.open ? (
        <AiChatPanel
          messages={chat.messages}
          draft={chat.draft}
          isPending={chat.isPending}
          onDraftChange={chat.setDraft}
          onSend={chat.send}
          onClose={() => chat.setOpen(false)}
        />
      ) : null}
      <button
        type="button"
        className={aiChatFabClass}
        aria-label={chat.open ? "Hide assistant" : "Open assistant"}
        aria-expanded={chat.open}
        onClick={() => chat.setOpen(!chat.open)}
      >
        <MessageCircle className="size-6" />
      </button>
    </>
  );
}
