import type {
  DeliveryInfo,
  EmployeeVerificationData,
} from "@/types/employeeVerification";

export const isPickupContext = (data?: EmployeeVerificationData | null) =>
  data?.verification_context === "pickup";

export const getActiveVerificationInfo = (
  data?: EmployeeVerificationData | null,
): DeliveryInfo | undefined => {
  if (!data) return undefined;
  const contextual = isPickupContext(data)
    ? data.pickup_info
    : data.delivery_info;
  return contextual || data.delivery_info || data.pickup_info;
};

export const getActiveVerificationNotes = (
  data?: EmployeeVerificationData | null,
) => {
  if (!data) return "";
  const notes = isPickupContext(data) ? data.pickup_note : data.delivery_notes;
  return notes || "";
};

export const getExpectedDate = (data?: EmployeeVerificationData | null) =>
  data?.expected_delivery || data?.expected_pickup || "";
