import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import Loader from "@/components/Loader";
import DrawerRight from "@/components/DrawerRight";
import type { CustomDeviceRequest } from "../types";
import RequestDetailsCard from "./RequestDetailsCard";
import RequestStatusBanner from "./RequestStatusBanner";
import RequestedDevicesCard from "./RequestedDevicesCard";
import StatusBadge from "./StatusBadge";
import VendorNoteCard from "./VendorNoteCard";
import { RFQDecisionModals } from "./RFQDecisionModals";
import { RFQDetailsFooter } from "./RFQDetailsFooter";
import {
  rfqDecisionStateKey,
  rfqDetailsDrawerPaddingClass,
} from "./rfqDecisionState";

function getAvailableSelection(request: CustomDeviceRequest) {
  return request.devices.reduce((selected, device, index) => {
    if (device.vendorResponse?.type !== "unavailable") {
      selected.add(index);
    }
    return selected;
  }, new Set<number>());
}

function getDefaultExpandedDevice(request: CustomDeviceRequest): number | null {
  const count = request.devices.length;

  if (count === 0) return null;
  if (count === 1) return 0;

  return count - 1;
}

interface RFQDetailsSidebarProps {
  isOpen: boolean;
  isLoadingDetails?: boolean;
  request: CustomDeviceRequest;
  onClose: () => void;
  onAccept: (
    request: CustomDeviceRequest,
    selectedDeviceIds: string[],
  ) => Promise<boolean>;
  onDecline: (
    request: CustomDeviceRequest,
    rejectionReason?: string,
  ) => Promise<boolean>;
  showApprovalRequestRedirect?: boolean;
}

export default function RFQDetailsSidebar({
  isOpen,
  isLoadingDetails = false,
  request,
  onClose,
  onAccept,
  onDecline,
  showApprovalRequestRedirect = true,
}: Readonly<RFQDetailsSidebarProps>) {
  const [expandedDevice, setExpandedDevice] = useState<number | null>(() =>
    getDefaultExpandedDevice(request),
  );
  const [otherReason, setOtherReason] = useState("");
  const [selectedDevices, setSelectedDevices] = useState<Set<number>>(() =>
    getAvailableSelection(request),
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isAcceptingQuote, setIsAcceptingQuote] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isRejectingQuote, setIsRejectingQuote] = useState(false);
  const requestStateKey = rfqDecisionStateKey(request);

  useEffect(() => {
    setExpandedDevice(getDefaultExpandedDevice(request));
    setOtherReason("");
    setSelectedDevices(getAvailableSelection(request));
    setShowConfirmModal(false);
    setIsAcceptingQuote(false);
    setShowRejectModal(false);
    setIsRejectingQuote(false);
  }, [requestStateKey]);

  const computedVendorTotal = request.devices.reduce((sum, device) => {
    if (
      device.vendorResponse?.type === "quoted" &&
      typeof device.vendorResponse.quotedPrice === "number"
    ) {
      return sum + device.vendorResponse.quotedPrice * device.quantity;
    }

    if (
      device.vendorResponse?.type === "alternative" &&
      device.vendorResponse.alternative
    ) {
      return sum + device.vendorResponse.alternative.price * device.quantity;
    }

    return sum;
  }, 0);

  const vendorTotal =
    typeof request.requiredBudget === "number"
      ? request.requiredBudget
      : computedVendorTotal;

  const hasVendorResponse = Boolean(request.responseId);

  const hasUnavailableItems = request.devices.some(
    (device) => device.vendorResponse?.type === "unavailable",
  );

  const drawerTitle =
    isLoadingDetails || !request.id
      ? "Request details"
      : `Request #${request.id}`;

  return (
    <>
      <DrawerRight
        isOpen={isOpen}
        onClose={onClose}
        onCancel={onClose}
        hideDefaultFooterBtn
        enableOverlay
        className={rfqDetailsDrawerPaddingClass(
          request,
          showApprovalRequestRedirect,
        )}
        data-testid="rfqdetailssidebar-drawerright"
        headerIcon={<ShoppingBag className="size-5 text-gray-500" />}
        drawerTitle={drawerTitle}
        drawerDescription={<StatusBadge status={request.status} />}
      >
        {isLoadingDetails ? (
          <div className="grid min-h-[420px] place-content-center py-20">
            <Loader />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              <RequestStatusBanner
                hasUnavailableItems={hasUnavailableItems}
                request={request}
              />

              <RequestedDevicesCard
                expandedDevice={expandedDevice}
                hasVendorResponse={hasVendorResponse}
                onToggleDevice={(index) =>
                  setExpandedDevice((previous) =>
                    previous === index ? null : index,
                  )
                }
                request={request}
                vendorTotal={vendorTotal}
              />

              {request.status !== "pending" && request.vendorNote && (
                <VendorNoteCard note={request.vendorNote} />
              )}

              <RequestDetailsCard request={request} />
            </div>

            <RFQDetailsFooter
              isSubmitting={isAcceptingQuote || isRejectingQuote}
              onClose={onClose}
              onConfirmOrder={() => setShowConfirmModal(true)}
              onRejectQuote={() => setShowRejectModal(true)}
              request={request}
              showApprovalRequestRedirect={showApprovalRequestRedirect}
            />
          </>
        )}
      </DrawerRight>

      <RFQDecisionModals
        isAcceptingQuote={isAcceptingQuote}
        isRejectingQuote={isRejectingQuote}
        onAccept={onAccept}
        onClose={onClose}
        onDecline={onDecline}
        otherReason={otherReason}
        request={request}
        selectedDevices={selectedDevices}
        setIsAcceptingQuote={setIsAcceptingQuote}
        setIsRejectingQuote={setIsRejectingQuote}
        setOtherReason={setOtherReason}
        setSelectedDevices={setSelectedDevices}
        setShowConfirmModal={setShowConfirmModal}
        setShowRejectModal={setShowRejectModal}
        showConfirmModal={showConfirmModal}
        showRejectModal={showRejectModal}
      />
    </>
  );
}
