import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  file_pdf,
  file_png,
  file_jpeg,
  zip_icon,
  verify_double_icon,
  laptop02,
  logomark,
} from "@/assets/icons";
import { OrderActivity } from "@/api/baseQueries/companiesApi/ordersApi/getOrderActivities";
import { ASSET_ORDER_STATUS, orderStatusMap } from "@/utils/orderStatusMap";

interface ActivityItemProps {
  activity: OrderActivity;
  isLast: boolean;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, isLast }) => {
  const AVATAR_SIZE = 40;

  const getTextValue = (value: unknown): string => {
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    if (value && typeof value === "object") {
      const candidate = value as Record<string, unknown>;
      if (typeof candidate.text === "string") return candidate.text;
      if (typeof candidate.value === "string") return candidate.value;
      if (
        typeof candidate.author === "string" &&
        typeof candidate.text === "string"
      ) {
        return `${candidate.author}: ${candidate.text}`;
      }
    }
    return "";
  };

  const displayTitle =
    getTextValue(activity.title?.text) ||
    getTextValue(activity.source?.name) ||
    getTextValue(activity.description);
  const displayTimestamp = activity.formatted_timestamp || activity.timestamp;

  const formatSnakeCasePhrase = (value: string) =>
    value
      .split("_")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  const formatReadableText = (rawText: string) => {
    if (!rawText) return "";

    const withFormattedSnakeCase = rawText.replaceAll(
      /\b[a-z]+(?:_[a-z]+)+\b/gi,
      (match) => formatSnakeCasePhrase(match),
    );

    return withFormattedSnakeCase
      .replaceAll(/([a-z])([A-Z])/g, "$1 $2")
      .replaceAll(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
      .replaceAll(/\s+/g, " ")
      .trim();
  };

  const normalizeForComparison = (value: string) =>
    formatReadableText(value).replaceAll(/\s+/g, " ").trim().toLowerCase();

  const formattedTitle = formatReadableText(displayTitle);

  const renderAvatar = () => {
    const imageUrl = activity.actor?.avatar || activity.source?.image;

    if (imageUrl) {
      return (
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0 z-10">
          <Image
            src={imageUrl}
            alt={activity.actor?.name || activity.source?.name || "avatar"}
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            className="object-cover w-full h-full"
          />
        </div>
      );
    }

    if (!activity.actor?.name && activity.entity === "order") {
      return (
        <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-50 flex items-center justify-center flex-shrink-0 z-10">
          <Image src={logomark} alt="order" width={32} height={32} />
        </div>
      );
    }

    if (activity.entity === "suborder") {
      return (
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0 z-10">
          <Image src={laptop02} alt="device" width={32} height={32} />
        </div>
      );
    }

    if (activity.icon?.type === "logo") {
      return (
        <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0 z-10">
          <Image src={verify_double_icon} alt="system" width={32} height={32} />
        </div>
      );
    }

    const initials =
      activity.actor?.initials ||
      activity.actor?.name
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() ||
      "SC";

    return (
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-500 flex-shrink-0 z-10">
        {initials}
      </div>
    );
  };

  const activityStatus = (activity.status || "").toLowerCase();

  const isAssetOrderStatus = (status: string): status is ASSET_ORDER_STATUS =>
    status in orderStatusMap;

  const getBadgeVariant = (badgeType?: string | null) => {
    const badgeText = getTextValue(activity.badge?.text).toLowerCase();

    if (badgeText.includes("delivered") || badgeText.includes("completed")) {
      return "success";
    }
    if (badgeText.includes("in transit") || badgeText.includes("awaiting")) {
      return "pending";
    }
    if (badgeText.includes("not required")) {
      return "gray";
    }
    if (
      badgeText.includes("signature required") ||
      badgeText.includes("product setup")
    ) {
      return "blue";
    }

    switch (badgeType) {
      case "success":
        return "success";
      case "warning":
        return "pending";
      case "error":
        return "destructive";
      case "info":
      default:
        return "blue";
    }
  };

  const renderStatusBadge = () => {
    if (isAssetOrderStatus(activityStatus)) {
      const statusMeta = orderStatusMap[activityStatus];
      return (
        <Badge
          className={statusMeta.className}
          variant={(statusMeta.variant || "default") as any}
        >
          {statusMeta.icon}
          {statusMeta.label}
        </Badge>
      );
    }

    const badgeText = getTextValue(activity.badge?.text);
    if (!badgeText) return null;

    return (
      <Badge variant={getBadgeVariant(activity.badge?.type) as any}>
        {badgeText}
      </Badge>
    );
  };

  const renderSubtitle = () => {
    const prefix = getTextValue(activity.subtitle?.prefix);
    const highlight = getTextValue(activity.subtitle?.highlight);
    const highlightLink = activity.subtitle?.highlight_link;

    if (!prefix && !highlight) return null;

    return (
      <p className="text-sm text-gray-600 mt-0.5">
        {prefix && <span>{prefix} </span>}
        {highlight && highlightLink ? (
          <Link href={highlightLink} className="text-[#0948B5] font-medium">
            {highlight}
          </Link>
        ) : (
          <span className="text-[#0948B5] font-medium">{highlight}</span>
        )}
      </p>
    );
  };

  const renderDescription = () => {
    const prefix = getTextValue(activity.description_display?.prefix);
    const rawText =
      getTextValue(activity.description_display?.text) ||
      getTextValue(activity.description);
    const text = formatReadableText(rawText);
    const linkText = getTextValue(activity.description_display?.link_text);
    const link = activity.description_display?.link;

    const normalizedTitle = normalizeForComparison(formattedTitle);
    const normalizedDescription = normalizeForComparison(text);
    const isDuplicateWithTitle =
      Boolean(normalizedDescription) &&
      Boolean(normalizedTitle) &&
      (normalizedDescription === normalizedTitle ||
        normalizedDescription.includes(normalizedTitle) ||
        normalizedTitle.includes(normalizedDescription));

    if (!prefix && !text && !linkText) return null;
    if (isDuplicateWithTitle && !prefix && !linkText) return null;

    return (
      <p className="text-[16px] leading-6 text-gray-600">
        {prefix && <span>{prefix} </span>}
        {text && !isDuplicateWithTitle && <span>{text} </span>}
        {linkText && link ? (
          <Link href={link} className="text-[#0948B5] font-medium">
            {linkText}
          </Link>
        ) : (
          linkText && <span>{linkText}</span>
        )}
      </p>
    );
  };

  const renderDocument = () => {
    const document = activity.document;
    const docName = getTextValue(activity.document?.name);
    if (!docName) return null;

    const extensionFromName = docName?.split(".")?.pop()?.toLowerCase();
    const extension = (
      document?.extension ||
      extensionFromName ||
      ""
    ).toLowerCase();

    let docIcon = file_pdf;
    if (extension === "zip") {
      docIcon = zip_icon;
    } else if (extension === "png") {
      docIcon = file_png;
    } else if (extension === "jpg" || extension === "jpeg") {
      docIcon = file_jpeg;
    }

    const content = (
      <>
        <Image src={docIcon} alt="file" width={40} height={40} />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">{docName}</span>
          {getTextValue(document?.size) && (
            <span className="text-xs text-gray-500">
              {getTextValue(document?.size)}
            </span>
          )}
        </div>
      </>
    );

    return (
      <div className="flex items-center gap-x-3 mt-3">
        {document?.url ? (
          <Link href={document.url} className="flex items-center gap-x-3">
            {content}
          </Link>
        ) : (
          content
        )}
      </div>
    );
  };

  const hasUnreadIndicator = activity.is_read === false;

  const titleLink = activity.title?.is_clickable ? activity.title?.link : null;

  const renderTitle = () => {
    if (!formattedTitle) return null;

    if (titleLink) {
      return (
        <Link
          href={titleLink}
          className="font-medium text-gray-600 hover:underline"
        >
          {formattedTitle}
        </Link>
      );
    }

    return <span className="font-medium text-gray-700">{formattedTitle}</span>;
  };

  const renderComment = () => {
    const commentText = getTextValue(activity.comment);
    if (!commentText) return null;

    return (
      <div className="mt-3 p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm">
        &quot;{commentText}&quot;
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="flex py-2">
        <div className="relative min-h-[72px]">
          <div className="mr-4">{renderAvatar()}</div>
          {!isLast && (
            <div className="absolute top-10 bottom-0 left-5 w-[2px] bg-gray-200 -z-0" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-gray-700 mb-0.5 font-medium">
                {renderTitle()}{" "}
                <span className="text-gray-600 text-sm font-normal">
                  {displayTimestamp}
                </span>
              </p>
              {renderSubtitle()}
              {renderDescription()}
              {renderComment()}
              {renderStatusBadge() && (
                <div className="mt-2">{renderStatusBadge()}</div>
              )}
              {renderDocument()}
            </div>
            {hasUnreadIndicator && (
              <div className="w-2 h-2 rounded-full bg-[#12B76A] ml-4 flex-shrink-0 mt-2" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
