"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { readSettingsApiError } from "@/container/Dashboard/BizExpertSettings/settingsApiError";
import {
  readAiChatMessages,
  writeAiChatMessages,
  type AiChatMessage,
} from "./aiChatStorage";

function nextId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useAiChat(businessId: string | null) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<AiChatMessage[]>([]);

  useEffect(() => {
    if (!businessId) {
      setMessages([]);
      return;
    }
    setMessages(readAiChatMessages(businessId));
  }, [businessId]);

  const persist = (next: AiChatMessage[]) => {
    setMessages(next);
    if (businessId) writeAiChatMessages(businessId, next);
  };

  const mutation = useMutation({
    mutationFn: async (content: string) => {
      if (!businessId) throw new Error("No business selected");
      const history = messages.map((row) => ({
        role: row.role,
        content: row.content,
      }));
      const res = await bizexpertApi.post(`/businesses/${businessId}/ai/chat`, {
        message: content,
        history,
      });
      return res.data as { reply: string };
    },
    onError: (err) => {
      toast.error(readSettingsApiError(err, "Could not send that message"));
    },
  });

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || mutation.isPending) return;
    const userMessage: AiChatMessage = {
      id: nextId(),
      role: "user",
      content,
    };
    persist([...messages, userMessage]);
    setDraft("");
    try {
      const data = await mutation.mutateAsync(content);
      persist([
        ...messages,
        userMessage,
        { id: nextId(), role: "assistant", content: data.reply },
      ]);
    } catch {
      persist(messages);
      setDraft(content);
    }
  };

  return {
    open,
    setOpen,
    draft,
    setDraft,
    messages,
    isPending: mutation.isPending,
    send,
  };
}
