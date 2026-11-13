export type AiChatRole = "user" | "assistant";

export type AiChatMessage = {
  id: string;
  role: AiChatRole;
  content: string;
};

export function aiChatStorageKey(businessId: string): string {
  return `bizexpert.ai-chat.${businessId}`;
}

export function parseAiChatMessages(raw: string | null): AiChatMessage[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as AiChatMessage[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (row) =>
        row &&
        (row.role === "user" || row.role === "assistant") &&
        typeof row.content === "string" &&
        typeof row.id === "string",
    );
  } catch {
    return [];
  }
}

export function readAiChatMessages(businessId: string): AiChatMessage[] {
  if (typeof window === "undefined") return [];
  return parseAiChatMessages(
    window.sessionStorage.getItem(aiChatStorageKey(businessId)),
  );
}

export function writeAiChatMessages(
  businessId: string,
  messages: AiChatMessage[],
): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(
    aiChatStorageKey(businessId),
    JSON.stringify(messages.slice(-40)),
  );
}

export const AI_CHAT_PROMPTS = [
  "How much did I sell today?",
  "Which products need restocking?",
  "What is my inventory value?",
];
