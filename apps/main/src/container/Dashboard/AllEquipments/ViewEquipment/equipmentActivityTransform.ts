import { IActivityItem, RawActivity } from "@/types/activity";
import { hasAccess, IUserRole } from "@/utils/hasAccess";
import { removeUserscore } from "@/utils/underScoreTransformer";

export const transformEquipmentActivities = (
  data: RawActivity[],
  userRole: IUserRole,
): IActivityItem[] => {
  return data?.map((item): IActivityItem => {
    const userInitials = item?.actor
      ? item.actor
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "NA";

    let action = "";
    let details = "";
    let note = "";
    let attachment:
      | {
          name: string;
          size?: string;
          type: "pdf" | "png" | "jpg" | undefined;
        }
      | undefined;
    let assigneeName = item?.assignee?.name;

    switch (item?.event_type) {
      case "equipment_added":
        action = "added equipment";
        details = `${item?.equipment}`;
        break;
      case "equipment_updated":
        action = "updated equipment";
        details = `${item?.equipment}`;
        break;
      case "document_added":
        action = "Added";
        attachment = {
          name: item?.payload?.document_name || "",
          type: item?.payload?.document_extention as
            | "pdf"
            | "png"
            | "jpg"
            | undefined,
        };
        details = `${item?.payload?.document_name ?? "System"}${item?.payload?.document_extention ? `.${item?.payload?.document_extention}` : ""} for ${item?.equipment}`;
        break;
      case "note_added":
        action = "Left a note";
        if (hasAccess(userRole, ["Super Administrator", "Administrator"])) {
          note = `${item?.payload?.note}`;
        }
        break;
      case "assigned":
        action = "assigned equipment";
        details = `${item?.equipment} to ${assigneeName ?? "Unknown"}`;
        break;
      case "unassigned":
        action = "unassigned equipment";
        details = `${item?.equipment} from ${item?.payload?.previous_assignee ?? "Unknown"}`;
        assigneeName = `${item?.payload?.previous_assignee}`;
        break;
      default:
        action = removeUserscore(item?.event_type)?.toLowerCase();
        details = `${item?.equipment}`;
    }

    return {
      id: item?.id,
      userInitials,
      userName: item?.actor ?? "System",
      action,
      details,
      equipment: item?.equipment,
      assigneeName,
      timestamp: item?.event_date,
      note,
      attachment,
    };
  });
};
