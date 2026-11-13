import type { Dispatch, SetStateAction } from "react";
import type { CustomDeviceRequest } from "../types";
import RequestDecisionModal from "./RequestDecisionModal";
import RequestRejectModal from "./RequestRejectModal";
import {
  selectedAvailableRfqDeviceIds,
  shouldIgnoreQuoteSubmit,
} from "./rfqDecisionState";
import { canActOnRfqQuote } from "../rfqExpiration";

interface RFQDecisionModalsProps {
  isAcceptingQuote: boolean;
  isRejectingQuote: boolean;
  onAccept: (
    request: CustomDeviceRequest,
    selectedDeviceIds: string[],
  ) => Promise<boolean>;
  onClose: () => void;
  onDecline: (
    request: CustomDeviceRequest,
    rejectionReason?: string,
  ) => Promise<boolean>;
  otherReason: string;
  request: CustomDeviceRequest;
  selectedDevices: Set<number>;
  setIsAcceptingQuote: Dispatch<SetStateAction<boolean>>;
  setIsRejectingQuote: Dispatch<SetStateAction<boolean>>;
  setOtherReason: Dispatch<SetStateAction<string>>;
  setSelectedDevices: Dispatch<SetStateAction<Set<number>>>;
  setShowConfirmModal: Dispatch<SetStateAction<boolean>>;
  setShowRejectModal: Dispatch<SetStateAction<boolean>>;
  showConfirmModal: boolean;
  showRejectModal: boolean;
}

export function RFQDecisionModals({
  isAcceptingQuote,
  isRejectingQuote,
  onAccept,
  onClose,
  onDecline,
  otherReason,
  request,
  selectedDevices,
  setIsAcceptingQuote,
  setIsRejectingQuote,
  setOtherReason,
  setSelectedDevices,
  setShowConfirmModal,
  setShowRejectModal,
  showConfirmModal,
  showRejectModal,
}: RFQDecisionModalsProps) {
  const handleConfirm = async () => {
    if (
      shouldIgnoreQuoteSubmit(isAcceptingQuote) ||
      !canActOnRfqQuote(request)
    ) {
      return;
    }

    const selectedDeviceIds = selectedAvailableRfqDeviceIds(
      request,
      selectedDevices,
    );

    setIsAcceptingQuote(true);
    try {
      const isAccepted = await onAccept(request, selectedDeviceIds);
      if (!isAccepted) return;
      setShowConfirmModal(false);
      onClose();
    } finally {
      setIsAcceptingQuote(false);
    }
  };

  const handleReject = async () => {
    setIsRejectingQuote(true);
    try {
      const isDeclined = await onDecline(request, otherReason || undefined);
      if (!isDeclined) return;
      setShowRejectModal(false);
      onClose();
    } finally {
      setIsRejectingQuote(false);
    }
  };

  return (
    <>
      <RequestDecisionModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        isSubmitting={isAcceptingQuote}
        onConfirm={handleConfirm}
        request={request}
        selectedDevices={selectedDevices}
        setSelectedDevices={setSelectedDevices}
      />

      <RequestRejectModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        isSubmitting={isRejectingQuote}
        onConfirm={handleReject}
        otherReason={otherReason}
        requestId={request.id}
        setOtherReason={setOtherReason}
      />
    </>
  );
}
