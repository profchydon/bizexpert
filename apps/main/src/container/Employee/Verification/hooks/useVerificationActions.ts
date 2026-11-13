import { useRouter } from "next/navigation";
import { useConfirmVerificationDataMutation } from "@/api/baseQueries/employeeVerificationApi/confirmVerificationData";
import { useUpdateVerificationDataMutation } from "@/api/baseQueries/employeeVerificationApi/updateVerificationData";
import { trackDeliveryVerified } from "@/lib/employeePortalAnalytics";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { buildAddress } from "../utils";
import type { SaveOverrideData } from "../types";

interface UseVerificationActionsProps {
  resolvedCompanyId: string;
  token: string;
  deliveryNotes: string;
  signatureRequired: boolean;
  recipientName: string;
  phoneNumber: string;
  streetAddress: string;
  apartmentSuite: string;
  city: string;
  state: string;
  zipCode: string;
  setShowSavedBanner: (value: boolean) => void;
  setIsConfirmOpen: (value: boolean) => void;
  refetch: () => Promise<unknown>;
}

const useVerificationActions = ({
  resolvedCompanyId,
  token,
  deliveryNotes,
  signatureRequired,
  recipientName,
  phoneNumber,
  streetAddress,
  apartmentSuite,
  city,
  state,
  zipCode,
  setShowSavedBanner,
  setIsConfirmOpen,
  refetch,
}: UseVerificationActionsProps) => {
  const router = useRouter();
  const [updateVerificationData, { isLoading: isUpdating }] =
    useUpdateVerificationDataMutation();
  const [confirmVerificationData, { isLoading: isConfirming }] =
    useConfirmVerificationDataMutation();

  const handleSave = async (
    override?: SaveOverrideData,
    updatePersonalProfile = false,
  ) => {
    const resolvedStreetAddress = override?.streetAddress ?? streetAddress;
    const resolvedCity = override?.city ?? city;
    const resolvedState = override?.state ?? state;
    const resolvedZipCode = override?.zipCode ?? zipCode;
    const resolvedNearestLandmark = override?.apartmentSuite ?? apartmentSuite;

    try {
      await updateVerificationData({
        companyId: resolvedCompanyId,
        token,
        payload: {
          recipient_name: override?.recipientName ?? recipientName,
          phone_number: override?.phoneNumber ?? phoneNumber,
          delivery_address: buildAddress(
            resolvedStreetAddress,
            resolvedCity,
            resolvedState,
            resolvedZipCode,
          ),
          street_address: resolvedStreetAddress,
          delivery_notes: deliveryNotes || undefined,
          city: resolvedCity || undefined,
          state: resolvedState || undefined,
          postal_code: resolvedZipCode || undefined,
          zip_code: resolvedZipCode || undefined,
          update_personal_profile: updatePersonalProfile,
          nearest_landmark: resolvedNearestLandmark || undefined,
          signature_required: signatureRequired,
        },
      }).unwrap();

      setShowSavedBanner(true);
      setTimeout(() => setShowSavedBanner(false), 3500);
      displaySuccessMessage(
        "Delivery details saved",
        "Your delivery details have been saved.",
      );
      refetch();
    } catch (error: any) {
      displayErrorMessage(
        error?.data?.message || "Failed to save delivery details.",
      );
    }
  };

  const handleConfirm = async () => {
    try {
      await confirmVerificationData({
        companyId: resolvedCompanyId,
        token,
        payload: {
          delivery_note: deliveryNotes || undefined,
        },
      }).unwrap();
      trackDeliveryVerified();
      displaySuccessMessage(
        "Delivery details confirmed",
        "Your confirmation has been recorded.",
      );
      setIsConfirmOpen(false);
      refetch();
      router.push("/employee");
    } catch (error: any) {
      displayErrorMessage(
        error?.data?.message || "Failed to confirm delivery details.",
      );
    }
  };

  return {
    handleSave,
    handleConfirm,
    isUpdating,
    isConfirming,
  };
};

export default useVerificationActions;
