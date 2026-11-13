import type {
  OrderMessage,
  OrderMessageAttachment,
} from "@/types/orderMessage";
import { formatTime } from "./chatHelpers";
import type { ChatFile, ChatLink, ChatMessage } from "./types";

export const isAdminSender = (sender?: OrderMessage["sender"]): boolean => {
  const type = sender?.type?.toLowerCase();
  return type === "admin" || type === "adminuser";
};

function fileExt(name: string): string {
  return (name.split(".").pop() ?? "FILE").toUpperCase();
}

function formatFileSize(bytes?: number | null): string {
  if (!bytes || bytes < 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function extFromAttachment(att: OrderMessageAttachment): string {
  if (att.title?.includes(".")) return fileExt(att.title);
  return (att.mime_type?.split("/").pop() ?? "FILE").toUpperCase();
}

function toChatFile(att: OrderMessageAttachment): ChatFile {
  return {
    name: att.title ?? "Attachment",
    size: formatFileSize(att.size),
    ext: extFromAttachment(att),
    url: att.url ?? undefined,
    isImage: Boolean(att.mime_type?.startsWith("image/")),
  };
}

function toChatLink(att: OrderMessageAttachment): ChatLink {
  return { url: att.url ?? "", title: att.title ?? att.url ?? "" };
}

export function mapMessages(messages: OrderMessage[]): ChatMessage[] {
  return [...messages]
    .map((m): ChatMessage => {
      const attachments = m.attachments ?? [];
      const files = attachments
        .filter((a) => a.type === "file")
        .map(toChatFile);
      const links = attachments
        .filter((a) => a.type === "link")
        .map(toChatLink);
      const isAdmin = isAdminSender(m.sender);
      const quoted = m.quoted_message;
      return {
        id: m.id,
        sender: isAdmin ? "rayda" : "customer",
        senderName: isAdmin ? "Rayda Operations" : (m.sender?.name ?? "You"),
        message: m.body ?? "",
        timestamp: formatTime(m.created_at),
        epoch: new Date(m.created_at).getTime(),
        isOptimistic: m.id.startsWith("optimistic-"),
        edited: Boolean(m.is_edited),
        files: files.length ? files : undefined,
        links: links.length ? links : undefined,
        replyTo: quoted
          ? {
              id: quoted.id,
              senderName: quoted.sender?.name ?? "Message",
              message: quoted.body ?? "",
            }
          : undefined,
      };
    })
    .sort((a, b) => a.epoch - b.epoch);
}
