import { UNASSIGNED_ORDER_SUMMARY_KEY } from "@/utils/getInitials";

export const canPerformAction = (
  status: string,
  action: "transfer" | "store" | "sell" | "dispose",
) => {
  switch (action) {
    case "transfer":
      return status === "assigned" || status === "unassigned";
    case "store":
      return status === "assigned";
    case "dispose":
      return status === "assigned";
    case "sell":
      return (
        status === "assigned" ||
        status === UNASSIGNED_ORDER_SUMMARY_KEY ||
        status === "in_storage"
      );
    default:
      return false;
  }
};
