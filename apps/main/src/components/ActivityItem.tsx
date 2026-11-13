import { file_image, file_pdf } from "@/assets/icons";
import { IActivityItem } from "@/types/activity";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface Props {
  activity: IActivityItem;
  isLast?: boolean;
}

const ActivityItem: React.FC<Props> = ({ activity, isLast }) => {
  const getFileIcon = (type?: "pdf" | "png" | "jpg") => {
    // if (!type) return null;

    switch (type) {
      case "pdf":
        return <Image src={file_pdf} alt="file" width={40} height={40} />;
      case "png":
        return <Image src={file_image} alt="file" width={40} height={40} />;
      case "jpg":
        return <Image src={file_image} alt="file" width={40} height={40} />;
      default:
        return <Image src={file_pdf} alt="file" width={40} height={40} />;
    }
  };

  const renderFilewrapper = (
    type: "pdf" | "png" | "jpg" | undefined,
    activity: IActivityItem,
  ) => {
    return (
      <div className="flex items-center gap-x-1 mt-3">
        <div className="w-12 flex-shrink-0">{getFileIcon(type)}</div>
        <div className="flex-1 flex flex-col gap-y-1">
          <span className="text-sm text-gray-700 font-medium">
            {activity?.attachment?.name}
            {type ? `.${type}` : ""}
          </span>
          <span className="text-gray-600 text-sm">
            {activity?.attachment?.size}
          </span>
        </div>
      </div>
    );
  };

  // Function to render text with blue links
  // const renderTextWithLinks = (text: string) => {
  //   const parts = text.split(/(Samsung Phone|to \w+ \w+)/g);

  //   return parts.map((part, index) => {
  //     if (part.startsWith("to ") && part.split(" ").length === 3) {
  //       const name = part.substring(3);
  //       return (
  //         <span key={index}>
  //           to{" "}
  //           <Link href="#" className="text-primary-600 hover:underline">
  //             {name}
  //           </Link>
  //         </span>
  //       );
  //     } else if (part === "Samsung Phone") {
  //       return (
  //         <Link key={index} href="#" className="text-blue-600 hover:underline">
  //           {part}
  //         </Link>
  //       );
  //     } else {
  //       return <span key={index}>{part}</span>;
  //     }
  //   });
  // };

  type Highlight = {
    value: string;
    className?: string;
  };

  const renderTextWithHighlights = (text: string, highlights: Highlight[]) => {
    if (!text) return null;

    // Sort by length to avoid substring conflicts (e.g., "Mac" inside "Macbook")
    const sorted = highlights
      .filter((h) => h?.value)
      .sort((a, b) => b?.value?.length - a?.value?.length);

    // Escape regex-sensitive characters
    const escapeRegex = (str: string) =>
      str?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(
      `(${sorted?.map((h) => escapeRegex(h?.value)).join("|")})`,
      "gi",
    );

    const parts = text?.split(regex);

    return parts.map((part, index) => {
      const highlight = sorted.find(
        (h) => h.value.toLowerCase() === part.toLowerCase(),
      );

      if (highlight) {
        return (
          <span
            key={index}
            className={highlight.className ?? "text-[#0948B5] font-medium"}
          >
            {part}
          </span>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="relative">
      <div className="flex py-1">
        <div className="relative min-h-[72px]">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-base font-medium text-gray-500 mr-4 flex-shrink-0 z-10">
            {activity.userInitials}
          </div>
          {/* <div className="absolute top-12 bottom-0 left-6 w-[3px] bg-gray-200 -z-0"></div> */}
          {!isLast && (
            <div className="absolute top-12 bottom-0 left-6 w-[2px] bg-gray-200 -z-0"></div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-normal text-gray-900">{activity.userName}</p>
              <p className="text-gray-600">
                {renderTextWithHighlights(
                  `${activity.action} ${activity.details}`,
                  [
                    { value: activity.equipment ?? "" },
                    { value: activity.assigneeName ?? "" },
                  ],
                )}
              </p>
              {activity.note && (
                <div className="mt-2 p-3 border rounded-md text-gray-700 bg-gray-50">
                  {activity.note}
                </div>
              )}
              {activity.attachment &&
                renderFilewrapper(activity.attachment.type, activity)}
            </div>
            <span className="text-sm text-gray-500 whitespace-nowrap ml-2">
              {activity?.timestamp &&
                dayjs(activity?.timestamp).format("MMMM D, YYYY h:mm A")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
