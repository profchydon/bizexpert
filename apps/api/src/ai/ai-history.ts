export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

export function sanitizeChatHistory(
  raw: ChatTurn[] | undefined,
  limit = 20,
): ChatTurn[] {
  if (!raw?.length) return [];
  return raw
    .filter(
      (row) =>
        (row.role === "user" || row.role === "assistant") &&
        typeof row.content === "string" &&
        row.content.trim().length > 0,
    )
    .map((row) => ({
      role: row.role,
      content: row.content.slice(0, 4000),
    }))
    .slice(-limit);
}
