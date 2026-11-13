import { ChatMessage } from "./types";

export function formatDateLabel(epoch: number): string {
  const d = new Date(epoch);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function displayTimestamp(msg: ChatMessage): string {
  const isToday =
    new Date(msg.epoch).toDateString() === new Date().toDateString();
  if (isToday) return msg.timestamp.split(",")[0].trim();
  return msg.timestamp;
}

export const URL_RE = /(https?:\/\/[^\s]+)/gi;

export function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
}
