import NoteLogItem from "@/components/NoteLogItem";
import React, { FC, useEffect, useMemo, useRef } from "react";

interface Props {
  notes: any[];
  focusedNoteIndex?: number | null;
}

const normalizeFocusedNoteIndex = (
  value: number | null | undefined,
  notesLength: number,
): number | null => {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return null;
  }

  const rawIndex = Math.trunc(value);
  if (rawIndex >= 0 && rawIndex < notesLength) {
    return rawIndex;
  }

  const oneBasedIndex = rawIndex - 1;
  if (oneBasedIndex >= 0 && oneBasedIndex < notesLength) {
    return oneBasedIndex;
  }

  return null;
};

export const OrderNoteActivity: FC<Props> = ({ notes, focusedNoteIndex }) => {
  const noteRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const transformActivityItems = (data: any[]): any[] => {
    return data?.map((item) => {
      const userInitials = item?.author
        ? item.author
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
        : "NA";

      return {
        id: item?.id,
        userInitials,
        userName: item?.author ?? "System",
        action: "Added a note",
        timestamp: item?.date_added,
        note: item?.note,
      };
    });
  };

  const resolvedFocusedNoteIndex = useMemo(
    () => normalizeFocusedNoteIndex(focusedNoteIndex, notes?.length || 0),
    [focusedNoteIndex, notes?.length],
  );

  useEffect(() => {
    if (resolvedFocusedNoteIndex === null) return;

    const targetNote = noteRefs.current[resolvedFocusedNoteIndex];
    if (!targetNote) return;

    const timeout = globalThis.setTimeout(() => {
      // Collect all scrollable ancestors so we can use the outermost one
      // (i.e. DrawerRight's content div), rather than a closer inner container
      // that intercepts scrollIntoView without visually moving.
      const scrollableAncestors: HTMLElement[] = [];
      let current: HTMLElement | null = targetNote.parentElement;
      while (current && current !== document.body) {
        const style = getComputedStyle(current);
        if (
          current.scrollHeight > current.clientHeight &&
          (style.overflowY === "auto" || style.overflowY === "scroll")
        ) {
          scrollableAncestors.push(current);
        }
        current = current.parentElement;
      }

      // Prefer the outermost scrollable container (DrawerRight's scroll div)
      const container = scrollableAncestors.at(-1) ?? scrollableAncestors[0];

      if (container) {
        const containerRect = container.getBoundingClientRect();
        const noteRect = targetNote.getBoundingClientRect();
        const scrollTo =
          container.scrollTop +
          noteRect.top -
          containerRect.top -
          containerRect.height / 2 +
          noteRect.height / 2;
        container.scrollTo({ top: Math.max(0, scrollTo), behavior: "smooth" });
      } else {
        targetNote.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 500);

    return () => {
      globalThis.clearTimeout(timeout);
    };
  }, [resolvedFocusedNoteIndex]);

  const activityList = useMemo(
    () =>
      transformActivityItems(notes)?.map((activity, index) => (
        <div
          key={activity?.id || index}
          ref={(element) => {
            noteRefs.current[index] = element;
          }}
        >
          <NoteLogItem
            activity={activity}
            isLast={index === notes?.length - 1}
            isHighlighted={index === resolvedFocusedNoteIndex}
          />
        </div>
      )),
    [notes, resolvedFocusedNoteIndex],
  );

  return (
    <div className="flex flex-col gap-3 mt-8">
      <span className="text-sm font-medium">Asset Updates</span>
      <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4">
        {activityList}
      </div>
    </div>
  );
};
