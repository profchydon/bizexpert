"use client";

import { FileIcon } from "@untitledui/file-icons";
import { Building02 } from "@untitledui/icons";
import dayjs from "dayjs";
import { Avatar } from "@/components/base/avatar/avatar";
import { IActivityItem } from "@/types/activity";
import { cx } from "@/utils/cx";

type Highlight = {
  value: string;
  className?: string;
};

const renderTextWithHighlights = (text: string, highlights: Highlight[]) => {
  if (!text) return null;

  const sorted = highlights
    .filter((h) => h?.value)
    .sort((a, b) => b.value.length - a.value.length);

  const escapeRegex = (str: string) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const regex = new RegExp(
    `(${sorted.map((h) => escapeRegex(h.value)).join("|")})`,
    "gi",
  );

  const parts = text.split(regex);

  return parts.map((part, index) => {
    const highlight = sorted.find(
      (h) => h.value.toLowerCase() === part.toLowerCase(),
    );

    if (highlight) {
      return (
        <span
          key={index}
          className={
            highlight.className ?? "font-semibold text-brand-secondary"
          }
        >
          {part}
        </span>
      );
    }

    return <span key={index}>{part}</span>;
  });
};

const fileType = (name: string): "pdf" | "png" | "empty" => {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (ext === "png") return "png";
  return "empty";
};

type Props = {
  activity: IActivityItem;
  isLast?: boolean;
};

const EquipmentActivityItem = ({ activity, isLast }: Props) => {
  const isSystem = activity.userName.toLowerCase() === "system";
  const actionText = [activity.action, activity.details]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    <li className="flex gap-3">
      <div className="flex flex-col items-center">
        {isSystem ? (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 outline-1 -outline-offset-1 outline-avatar-contrast-border">
            <Building02 className="size-5" aria-hidden />
          </span>
        ) : (
          <Avatar
            size="md"
            initials={activity.userInitials}
            alt={activity.userName}
          />
        )}
        {!isLast ? (
          <span
            aria-hidden
            className="mt-1.5 w-px flex-1 bg-border-secondary"
          />
        ) : null}
      </div>

      <div
        className={cx(
          "flex min-w-0 flex-1 flex-col gap-1.5",
          isLast ? "pb-0" : "pb-6",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-primary">
            {activity.userName}
          </p>
          {activity.timestamp ? (
            <span className="shrink-0 text-xs text-tertiary">
              {dayjs(activity.timestamp).format("MMMM D, YYYY h:mm A")}
            </span>
          ) : null}
        </div>

        {actionText ? (
          <p className="text-sm text-tertiary">
            {renderTextWithHighlights(actionText, [
              { value: activity.equipment ?? "" },
              { value: activity.assigneeName ?? "" },
            ])}
          </p>
        ) : null}

        {activity.note ? (
          <div className="mt-1 rounded-lg border border-secondary bg-primary px-3.5 py-2.5 text-sm text-tertiary">
            {activity.note}
          </div>
        ) : null}

        {activity.attachment ? (
          <div className="mt-1 flex max-w-sm items-center gap-2.5 rounded-lg border border-secondary px-3 py-2">
            <FileIcon
              className="size-8 shrink-0"
              type={fileType(activity.attachment.name)}
              theme="light"
            />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-primary">
                {activity.attachment.name}
                {activity.attachment.type ? `.${activity.attachment.type}` : ""}
              </p>
              {activity.attachment.size ? (
                <p className="text-xs text-tertiary">
                  {activity.attachment.size}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </li>
  );
};

export default EquipmentActivityItem;
