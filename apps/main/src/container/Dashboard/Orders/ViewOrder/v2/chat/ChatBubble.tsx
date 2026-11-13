import React, { type ReactNode } from "react";
import { URL_RE, displayTimestamp } from "./chatHelpers";
import { ChatFileCard } from "./ChatFileCard";
import { LinkPreview } from "./LinkPreview";
import { MessageActions } from "./MessageActions";
import { RaydaAvatar } from "./RaydaAvatar";
import { ReplyQuote } from "./ReplyQuote";
import { ChatMessage } from "./types";

function linkify(text: string, isOutgoing: boolean): ReactNode[] {
  const parts = text.split(URL_RE);
  return parts.map((part, i) =>
    URL_RE.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className={
          isOutgoing
            ? "underline hover:text-white/80"
            : "text-primary-600 underline hover:text-primary-700"
        }
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}

export interface ChatBubbleProps {
  msg: ChatMessage;
  onReply?: (msg: ChatMessage) => void;
  onCopy?: (msg: ChatMessage) => void;
  onEdit?: (msg: ChatMessage) => void;
}

function ChatBubble({ msg, onReply, onCopy, onEdit }: ChatBubbleProps) {
  const isOutgoing = msg.sender === "customer";
  const hasActions = onReply && onCopy;

  const actions = hasActions ? (
    <div className="pointer-events-none invisible shrink-0 group-hover/msg:pointer-events-auto group-hover/msg:visible">
      <MessageActions
        msg={msg}
        onReply={onReply}
        onCopy={onCopy}
        onEdit={onEdit}
      />
    </div>
  ) : null;

  const reply = msg.replyTo ? (
    <ReplyQuote
      id={msg.replyTo.id}
      senderName={msg.replyTo.senderName}
      message={msg.replyTo.message}
      file={msg.replyTo.file}
    />
  ) : null;
  const edited = msg.edited ? (
    <span className="text-[11px] italic text-gray-400">edited</span>
  ) : null;
  const fileCard = msg.files?.length ? (
    <div className="flex flex-col gap-1.5">
      {msg.files.map((file) => (
        <ChatFileCard key={file.url ?? file.name} file={file} />
      ))}
    </div>
  ) : null;
  const linkCards = msg.links?.length ? (
    <div className="flex flex-col gap-1.5">
      {msg.links.map((link) => (
        <LinkPreview key={link.url} link={link} />
      ))}
    </div>
  ) : null;

  if (isOutgoing) {
    return (
      <div
        data-msg-id={msg.id}
        className="group/msg flex items-start justify-end gap-1.5"
      >
        {actions}
        <div className="flex max-w-[75%] min-w-0 flex-col items-end gap-1">
          <div className="flex w-full items-center gap-2">
            <span className="min-w-0 flex-1 truncate text-right text-sm font-medium text-gray-700">
              {msg.senderName}
            </span>
            <span className="shrink-0 text-xs text-gray-500">
              {displayTimestamp(msg)}
            </span>
          </div>
          {reply}
          {msg.message && (
            <div className="max-w-full break-words rounded-tl-lg rounded-br-lg rounded-bl-lg bg-primary-600 px-3.5 py-2.5 text-sm leading-5 text-white">
              {linkify(msg.message, true)}
            </div>
          )}
          {fileCard}
          {edited}
          {linkCards}
        </div>
      </div>
    );
  }

  return (
    <div data-msg-id={msg.id} className="group/msg flex items-start gap-3">
      <RaydaAvatar size={40} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-700">
            {msg.senderName}
          </span>
          <span className="shrink-0 text-xs text-gray-500">
            {displayTimestamp(msg)}
          </span>
        </div>
        {reply}
        {msg.message && (
          <div className="w-fit max-w-full break-words rounded-tr-lg rounded-br-lg rounded-bl-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm leading-5 text-gray-900">
            {linkify(msg.message, false)}
          </div>
        )}
        {fileCard}
        {edited}
        {linkCards}
      </div>
      {actions}
    </div>
  );
}

export { ChatBubble };
