import React, { FC, useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ASSET_ORDER_STATUS, orderStatusMap } from "@/utils/orderStatusMap";
import { signatureStatusMap } from "@/utils/signatureStatusMap";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image_wrap from "@/assets/images/Image_wrap.png";
import Mackbook from "@/assets/images/mackbook.png";
import { ISubOrder } from "@/types/orders";
import { Check, RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IAsset } from "@/types/assets";
import formatAmount from "@/utils/formatAmount";
import { OrderNoteActivity } from "./OrderNoteActivity";
import { hasAccess, IUserRole } from "@/utils/hasAccess";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { Switch } from "@/components/ui/switch";
import {
  useRemoveSubOrderSignatureMutation,
  useAddSubOrderSignatureMutation,
} from "@/api/baseQueries/companiesApi/ordersApi/updateOrderSignature";
import SignatureRequiredDialog from "@/components/Offboarding/OrderSummary/SignatureRequiredDialog";
import SignatureUpdateConfirmationDialog from "@/components/Orders/SignatureUpdateConfirmationDialog";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import displayErrorMessage from "@/utils/displayErrorMessage";

interface Props {
  subOrderDetail?: ISubOrder;
  actionType?: string;
  onView: (asset: IAsset) => void;
  orderId: string;
  onClose?: () => void;
  onOpen?: (detail: ISubOrder) => void;
  focusedNoteIndex?: number | null;
}
const OnboardingInstance: FC<Props> = ({
  subOrderDetail,
  onView,
  actionType,
  orderId,
  onClose,
  onOpen,
  focusedNoteIndex,
}) => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const { getUserDetails } = useAuthUserDetail();
  const userRole = getUserDetails()?.role as IUserRole;
  const companyId = useWorkspaceCompanyId();
  const orderStatus =
    subOrderDetail?.status?.toLocaleLowerCase() as ASSET_ORDER_STATUS;

  const NON_UPDATABLE_SIGNATURE_STATUSES = [
    "completed",
    "awaiting",
    "delivered",
    "order_delivered",
    "collection_completed",
    "picked_up",
    "sold",
    "in_storage",
  ];
  const isOrderStatusLocked = NON_UPDATABLE_SIGNATURE_STATUSES.includes(
    subOrderDetail?.status?.toLowerCase() || "",
  );

  // Store subOrderDetail in a ref to preserve it when drawer closes
  const subOrderRef = useRef<ISubOrder | undefined>(subOrderDetail);

  // Update ref when subOrderDetail changes
  useEffect(() => {
    if (subOrderDetail) {
      subOrderRef.current = subOrderDetail;
    }
  }, [subOrderDetail]);

  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [showAddConfirmation, setShowAddConfirmation] = useState(false);
  const [removeSubOrderSignature, { isLoading: isRemoving }] =
    useRemoveSubOrderSignatureMutation();
  const [addSubOrderSignature, { isLoading: isAdding }] =
    useAddSubOrderSignatureMutation();

  const getEmployeeId = () => {
    // Use ref as fallback when subOrderDetail is undefined (drawer closed)
    const detail = subOrderDetail || subOrderRef.current;
    return detail?.employee_id || "";
  };

  const handleToggle = (checked: boolean) => {
    if (isOrderStatusLocked) {
      displayErrorMessage(
        "Signature requirement cannot be updated for this order status.",
      );
      return;
    }
    if (checked) {
      setShowAddConfirmation(true);
      onClose?.();
    } else {
      setShowRemoveConfirmation(true);
      onClose?.();
    }
  };

  const handleConfirmAdd = async () => {
    if (!companyId || !orderId) return;

    const employeeId = getEmployeeId();
    if (!employeeId) {
      displayErrorMessage("No valid employee ID found");
      setShowAddConfirmation(false);
      return;
    }

    try {
      await addSubOrderSignature({
        companyId,
        orderId,
        employee_ids: [employeeId],
      }).unwrap();

      setShowAddConfirmation(false);
      displaySuccessMessage(
        "Signature requirement enabled",
        "Signature on delivery has been enabled. Delivery will be attempted when the recipient is available, but this cannot always be guaranteed.",
      );

      // Close the drawer after successful update
      if (onClose) {
        onClose();
      }
    } catch (error: any) {
      displayErrorMessage(
        error?.data?.message || "Failed to enable signature requirement",
      );
      setShowAddConfirmation(false);
    }
  };

  const handleCancelAdd = () => {
    setShowAddConfirmation(false);
    if (onOpen && subOrderRef.current) {
      onOpen(subOrderRef.current);
    }
  };

  const handleConfirmRemove = async () => {
    if (!companyId || !orderId) return;

    const employeeId = getEmployeeId();
    if (!employeeId) {
      displayErrorMessage("No valid employee ID found");
      setShowRemoveConfirmation(false);
      return;
    }

    try {
      await removeSubOrderSignature({
        companyId,
        orderId,
        employee_ids: [employeeId],
      }).unwrap();

      setShowRemoveConfirmation(false);
      displaySuccessMessage("Signature requirement removed successfully.");

      // Close the drawer after successful update
      if (onClose) {
        onClose();
      }
    } catch (error: any) {
      displayErrorMessage(
        error?.data?.message || "Failed to remove signature requirement",
      );
      setShowRemoveConfirmation(false);
    }
  };

  const handleCancelRemove = () => {
    setShowRemoveConfirmation(false);
    if (onOpen && subOrderRef.current) {
      onOpen(subOrderRef.current);
    }
  };

  return (
    <>
      <div className="-mx-6 -mt-5 mb-12">
        <div className="relative">
          <img
            className="h-[160px] w-full object-cover"
            src={Image_wrap.src}
            alt="..."
          />
          <div className="absolute bottom-0 left-6 translate-y-1/2">
            <Button
              className="bg-white rounded-full border-0 px-0 border-stone-200"
              data-testid="onboardinginstance-button"
            >
              <Avatar className="w-20 h-20 border-4 border-[#FFFFFF]">
                <AvatarFallback
                  className="text-3xl text-black bg-[#F2F4F7] font-semibold"
                  delayMs={600}
                >
                  <span>
                    {subOrderDetail?.employee_first_name?.[0]}{" "}
                    {subOrderDetail?.employee_last_name?.[0]}
                  </span>
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col pt-4 pb-6 border-b border-gray-200 space-y-2">
        <span className="text-2xl text-black font-semibold">
          {subOrderDetail?.employee_first_name || ""}{" "}
          {subOrderDetail?.employee_last_name || ""}
        </span>
        <span className="text-sm font-medium ">
          {subOrderDetail?.job_title || ""}
        </span>
      </div>
      <div className="flex flex-col flex-grow overflow-auto">
        <div className="py-4 grid  place-content-start my-auto h-full w-full">
          <div className="flex gap-x-6">
            <div className="flex flex-col ">
              <span className="text-sm font-medium">Total amount</span>

              <span className="text-sm font-medium">
                {/* @ts-ignore */}
                {subOrderDetail?.currency || ""} {/* @ts-ignore */}
                {formatAmount(subOrderDetail?.total_amount)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Order status</span>
              {orderStatusMap?.[orderStatus]?.label && (
                <div className="w-fit">
                  <Badge
                    className={orderStatusMap?.[orderStatus]?.className}
                    variant={orderStatusMap?.[orderStatus]?.variant as any}
                  >
                    {orderStatusMap?.[orderStatus]?.label === "Completed" ? (
                      <Check className="text-success-700 h-4 mr-1" />
                    ) : (
                      <RefreshCcw
                        className={`${orderStatusMap?.[orderStatus]?.className} h-4 mr-1`}
                      />
                    )}
                    {orderStatusMap?.[orderStatus]?.label}
                  </Badge>
                </div>
              )}
            </div>
            {!["storage_to_employee"].includes(actionType as string) && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">Signature</span>
                <div className="w-fit">
                  {(() => {
                    const isSignatureRequested = (
                      subOrderDetail?.assets?.[0] as any
                    )?.signature_requested;
                    const badge =
                      signatureStatusMap[
                        String(
                          isSignatureRequested,
                        ) as keyof typeof signatureStatusMap
                      ] || signatureStatusMap["not_requested"];
                    return (
                      <Badge
                        className={badge.className}
                        variant={badge.variant as any}
                      >
                        {badge.label}
                      </Badge>
                    );
                  })()}
                </div>
              </div>
            )}
            {["storage_to_employee"].includes(actionType as string) && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">Signature</span>
                <div className="w-fit">
                  {(() => {
                    const isSignatureRequested = (subOrderDetail as any)
                      ?.signature_requested;
                    const badge =
                      signatureStatusMap[
                        String(
                          isSignatureRequested,
                        ) as keyof typeof signatureStatusMap
                      ] || signatureStatusMap["not_requested"];
                    return (
                      <Badge
                        className={badge.className}
                        variant={badge.variant as any}
                      >
                        {badge.label}
                      </Badge>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col border-b pb-6">
          <span className="text-sm medium">Address</span>
          <span className="text-sm font-medium">{subOrderDetail?.address}</span>
        </div>
      </div>
      <div>
        <div className="flex flex-col border-b pt-5 pb-6">
          <span className="text-sm font-medium">Items</span>
          <span className="text-sm font-normal">
            The following items are included in this order
          </span>
        </div>
      </div>

      <div className="">
        <div className="py-6 flex flex-col space-y-2">
          {["onboarding", "device_refresh"].includes(actionType as string) &&
            Array.isArray(subOrderDetail?.assets) &&
            subOrderDetail.assets.map((asset) => (
              <div
                key={asset.id}
                className="flex flex-row space-y-2 gap-x-2 border-b pb-4 items-center justify-between"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={asset?.images?.[0] || Mackbook.src}
                    alt="asset_image"
                  />
                </Avatar>
                <div className="text-xs flex flex-col gap-y-1">
                  <span className="text-sm font-semibold pt-1">
                    {asset.name} {asset.make} - {asset.model}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-600">
                      Tracking number:
                    </span>
                    {(asset as any)?.tracking_no ? (
                      <a
                        href={`/track/${(asset as any)?.tracking_no}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline cursor-pointer transition-colors"
                      >
                        {(asset as any)?.tracking_no}
                      </a>
                    ) : (
                      <Badge variant="red">Not available</Badge>
                    )}
                  </div>

                  {asset.status === "Available" && (
                    <Badge variant="success">Available</Badge>
                  )}
                </div>
                <button
                  className="text-sm font-semibold text-sky-600 cursor-pointer bg-transparent border-0 p-0"
                  onClick={() => onView(asset)}
                >
                  View
                </button>
              </div>
            ))}

          {!["onboarding", "offboarding"].includes(actionType as string) &&
            subOrderDetail?.equipment && (
              <div className="flex flex-row space-y-2 gap-x-2 border-b pb-4 items-center">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={subOrderDetail.equipment.image_url || Mackbook.src}
                    alt="asset_image"
                  />
                  <AvatarFallback
                    className="text-3xl text-black bg-[#F2F4F7] font-semibold"
                    delayMs={600}
                  />
                </Avatar>
                <div className="text-xs flex flex-col gap-y-1">
                  <span className="text-sm font-semibold pt-1">
                    {subOrderDetail.equipment.title}{" "}
                    {subOrderDetail.equipment.make} -{" "}
                    {subOrderDetail.equipment.model}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-600">
                      Tracking number:
                    </span>
                    {(subOrderDetail as any)?.tracking_no ? (
                      <a
                        href={`/track/${(subOrderDetail as any)?.tracking_no}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline cursor-pointer transition-colors"
                      >
                        {(subOrderDetail as any)?.tracking_no}
                      </a>
                    ) : (
                      <Badge variant="red">Not available</Badge>
                    )}
                  </div>

                  {subOrderDetail.equipment.status === "Available" && (
                    <Badge variant="success">Available</Badge>
                  )}
                </div>
              </div>
            )}

          {(subOrderDetail as any)?.note?.length > 0 && (
            <div className="flex flex-col mt-10 pb-6 border-t border-gray-200">
              <OrderNoteActivity
                notes={(subOrderDetail as any)?.note}
                focusedNoteIndex={focusedNoteIndex}
              />
            </div>
          )}

          {!["storage_to_employee"].includes(actionType as string) && (
            <div className="mt-6 pt-6">
              <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5">
                <Switch
                  checked={
                    (subOrderDetail?.assets?.[0] as any)?.signature_requested ||
                    false
                  }
                  onCheckedChange={handleToggle}
                  disabled={isAdding || isRemoving || isOrderStatusLocked}
                  className="mt-0.5"
                />
                <div className="flex flex-col gap-1.5">
                  <span className="text-base font-semibold text-gray-900">
                    Signature Required
                  </span>
                  <span className="text-sm leading-relaxed text-gray-600">
                    Delivery will be attempted only when employee is available
                    to receive. However, this will not always be guaranteed
                  </span>
                </div>
              </div>
            </div>
          )}
          {["storage_to_employee"].includes(actionType as string) && (
            <div className="mt-6 pt-6">
              <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5">
                <Switch
                  checked={
                    (subOrderDetail as any)?.signature_requested || false
                  }
                  onCheckedChange={handleToggle}
                  disabled={isAdding || isRemoving || isOrderStatusLocked}
                  className="mt-0.5"
                />
                <div className="flex flex-col gap-1.5">
                  <span className="text-base font-semibold text-gray-900">
                    Signature Required
                  </span>
                  <span className="text-sm leading-relaxed text-gray-600">
                    Delivery will be attempted only when employee is available
                    to receive. However, this will not always be guaranteed
                  </span>
                </div>
              </div>
            </div>
          )}

          <SignatureUpdateConfirmationDialog
            open={showAddConfirmation}
            onOpenChange={setShowAddConfirmation}
            onCancel={handleCancelAdd}
            onConfirm={handleConfirmAdd}
            failedSubOrders={[]}
            successSubOrders={[]}
            updatedCount={1}
            totalCount={1}
            isLoading={isAdding}
          />

          <SignatureRequiredDialog
            open={showRemoveConfirmation}
            onOpenChange={setShowRemoveConfirmation}
            onCancel={handleCancelRemove}
            onConfirm={handleConfirmRemove}
          />
        </div>
      </div>
    </>
  );
};

export default OnboardingInstance;
