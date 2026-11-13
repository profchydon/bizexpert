import React from "react";
import { Paperclip } from "lucide-react";
import { ChatFile } from "./types";

const HIGHLIGHT_CLASSES = ["ring-2", "ring-primary-300", "rounded-lg"];

function findScrollable(node: HTMLElement): HTMLElement | null {
  let current: HTMLElement | null = node.parentElement;
  while (current) {
    if (current.scrollHeight > current.clientHeight + 1) return current;
    current = current.parentElement;
  }
  return null;
}

function ReplyQuote({
  id,
  senderName,
  message,
  file,
}: {
  id: string;
  senderName: string;
  message: string;
  file?: ChatFile;
}) {
  function handleClick() {
    const el = document.querySelector(
      `[data-msg-id="${id}"]`,
    ) as HTMLElement | null;
    if (!el) return;
    const scroller = findScrollable(el);
    if (scroller) {
      const scrollerRect = scroller.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const elTopInScroller =
        elRect.top - scrollerRect.top + scroller.scrollTop;
      const target =
        elTopInScroller - scroller.clientHeight / 2 + el.offsetHeight / 2;
      scroller.scrollTop = Math.max(0, target);
    }
    requestAnimationFrame(() => {
      el.classList.add(...HIGHLIGHT_CLASSES);
      setTimeout(() => el.classList.remove(...HIGHLIGHT_CLASSES), 1500);
    });
  }

  const preview = message || (file ? file.name : "");

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex w-full cursor-pointer items-center gap-2 rounded-md border-l-2 border-primary-600 bg-gray-100 px-2.5 py-1.5 text-left transition-colors hover:bg-gray-50"
    >
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-primary-600">{senderName}</p>
        <p className="flex items-center gap-1 text-xs text-gray-500">
          {file && <Paperclip className="inline size-3 shrink-0" />}
          <span className="line-clamp-1">
            {file && !message ? file.name : preview}
          </span>
        </p>
      </div>
    </button>
  );
}

export { ReplyQuote };
