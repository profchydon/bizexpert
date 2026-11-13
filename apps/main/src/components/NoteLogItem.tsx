import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { IActivityItem } from "@/types/activity";
import { file_image, file_pdf } from "@/assets/icons";
import ExpandableText from "./ExpandableText";

dayjs.extend(relativeTime);

interface Props {
  activity: IActivityItem;
  isLast?: boolean;
  isHighlighted?: boolean;
}

const NoteLogItem: React.FC<Props> = ({ activity, isLast, isHighlighted }) => {
  const getFileIcon = (type?: "pdf" | "png" | "jpg") => {
    switch (type) {
      case "pdf":
        return <Image src={file_pdf} alt="file" width={40} height={40} />;
      case "png":
      case "jpg":
        return <Image src={file_image} alt="file" width={40} height={40} />;
      default:
        return <Image src={file_pdf} alt="file" width={40} height={40} />;
    }
  };

  const renderFileWrapper = (
    type: "pdf" | "png" | "jpg" | undefined,
    activity: IActivityItem,
  ) => (
    <div className="flex items-center gap-x-3 mt-3 bg-gray-50 p-3 rounded-md border">
      <div className="w-12 h-12 flex-shrink-0">{getFileIcon(type)}</div>
      <div className="flex-1 flex flex-col text-sm text-gray-700">
        <span className="font-medium">
          {activity?.attachment?.name}
          {type ? `.${type}` : ""}
        </span>
        <span className="text-xs text-gray-500">
          {activity?.attachment?.size}
        </span>
      </div>
    </div>
  );

  const renderTextWithHighlights = (
    text: string,
    highlights: { value: string; className?: string }[],
  ) => {
    if (!text) return null;

    const sorted = highlights
      .filter((h) => h?.value)
      .sort((a, b) => b.value.length - a.value.length);

    const escapeRegex = (str: string) =>
      str?.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);

    const regex = new RegExp(
      `(${sorted.map((h) => escapeRegex(h.value)).join("|")})`,
      "gi",
    );

    const partsCounter: Record<string, number> = {};

    return text.split(regex).map((part) => {
      partsCounter[part] = (partsCounter[part] || 0) + 1;
      const highlight = sorted.find(
        (h) => h.value.toLowerCase() === part.toLowerCase(),
      );
      return (
        <span
          key={`${part}-${partsCounter[part]}`}
          className={highlight?.className || "text-primary-700 font-medium"}
        >
          {part}
        </span>
      );
    });
  };

  return (
    <div className="relative">
      <div className="flex py-1">
        <div className="relative min-h-[72px] pr-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-base font-semibold text-gray-600 z-10">
            {activity.userInitials}
          </div>
          {!isLast && (
            <div className="absolute top-12 bottom-0 left-6 w-[2px] bg-gray-200 -z-0"></div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                {activity.userName}
              </p>
              <p className="text-sm text-gray-700 leading-snug">
                {renderTextWithHighlights(
                  `${activity.action} ${activity.details || ""}`,
                  [
                    { value: activity.equipment ?? "" },
                    { value: activity.assigneeName ?? "" },
                  ],
                )}
              </p>
              {activity.attachment &&
                renderFileWrapper(activity.attachment.type, activity)}
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap ml-4 mt-1">
              {activity?.timestamp &&
                dayjs(activity?.timestamp).format("MMM D, YYYY h:mm A")}
            </span>
          </div>
          {activity.note && (
            <ExpandableText
              text={activity.note}
              className={`mt-3 px-3 py-2 border rounded-md text-sm text-gray-700 ${
                isHighlighted
                  ? "bg-primary-25 border-primary-200 ring-1 ring-primary-100"
                  : "bg-gray-50"
              }`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteLogItem;
