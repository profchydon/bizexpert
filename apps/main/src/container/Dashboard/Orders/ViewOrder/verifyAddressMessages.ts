import { VerifyModalState } from "./verificationContexts";

export const buildVerifyToast = (modal: VerifyModalState) => {
  const isBulk = modal?.type === "bulk";
  const isAllPending =
    modal?.type === "bulk" && modal.bulkMode === "all_pending";

  if (!isBulk) {
    return {
      title: "Address verified",
      description:
        "The selected verification details for this order have been verified.",
    };
  }

  return {
    title: "Addresses verified",
    description: isAllPending
      ? "All pending verification details for this order have been verified."
      : "The pending verification details for the selected rows have been verified.",
  };
};
