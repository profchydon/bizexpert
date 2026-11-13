import { ISubOrder } from "@/types/orders";
import React, { FC, useState, useRef, useEffect } from "react";
import Image from "next/image";
import Image_wrap from "@/assets/images/Image_wrap.png";
import { ASSET_ORDER_STATUS, orderStatusMap } from "@/utils/orderStatusMap";
import { signatureStatusMap } from "@/utils/signatureStatusMap";
import { Badge } from "@/components/ui/badge";
import formatAmount from "@/utils/formatAmount";
import { assetActionType, OrderActionType } from "@/types/offboarding";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/utils/getInitials";
import truncate from "lodash/truncate";
import { Separator } from "@/components/ui/separator";
import { formatCollectionWindow } from "./formatCollectionWindow";
import { OrderNoteActivity } from "./OrderNoteActivity";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { SafeImage } from "@/components/SafeImage";
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
  currency: string;
  orderId: string;
  onClose?: () => void;
  onOpen?: (detail: ISubOrder) => void;
  focusedNoteIndex?: number | null;
}
const OffboardingInstance: FC<Props> = ({
  subOrderDetail,
  currency,
  orderId,
  onClose,
  onOpen,
  focusedNoteIndex,
}) => {
  const companyId = useWorkspaceCompanyId();
  const orderStatus =
    subOrderDetail?.status?.toLocaleLowerCase() as ASSET_ORDER_STATUS;
  const actionType = subOrderDetail?.type as OrderActionType;
  const isStorageAction = actionType === "storage";
  const orderDetails = subOrderDetail?.order_details as any;
  const collectionWindow = formatCollectionWindow(subOrderDetail);

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
    const type = detail?.type as OrderActionType;
    const details = detail?.order_details as any;

    if (type === "reassign") {
      return (details?.to?.id || "") as string;
    }
    if (type === "storage") {
      return detail?.equipment?.assignee?.id || "";
    }
    return detail?.employee_id || "";
  };

  const handleEnableSignature = () => {
    setShowAddConfirmation(true);
    onClose?.();
  };

  const handleDisableSignature = () => {
    setShowRemoveConfirmation(true);
    onClose?.();
  };

  const handleToggle = (checked: boolean) => {
    if (isOrderStatusLocked) {
      displayErrorMessage(
        "Signature requirement cannot be updated for this order status.",
      );
      return;
    }
    if (isStorageAction && checked) return;
    if (checked) {
      handleEnableSignature();
    } else {
      handleDisableSignature();
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
      <div className="flex flex-col items-center flex-grow mb-24">
        <div className="absolute w-full size-fit right-0 left-0 top-[60px] ">
          <Image
            src={Image_wrap}
            alt="Order header background"
            className="w-full"
            sizes="100vw"
            priority
          />
          <div className="absolute top-[80px] pt-5 pl-6">
            <div className="rounded-full w-[60px] flex flex-col justify-center items-center h-[60px] bg-gray-100">
              <SafeImage
                src={subOrderDetail?.equipment?.image_url}
                alt="Equipment image"
                className="w-full object-fill rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col pt-16 pb-6 border-b border-gray-200 space-y-2">
        <p className="text-gray-900 font-medium text-lg w-[30ch] truncate">
          {truncate(
            `${subOrderDetail?.equipment?.title} ${subOrderDetail?.equipment?.make} (${subOrderDetail?.equipment?.year})`,
            {
              length: 30,
            },
          )}
        </p>
      </div>
      <div className="flex flex-col flex-grow overflow-auto">
        <div className="py-4 grid  place-content-start my-auto h-full w-full">
          <div className="flex gap-x-12">
            <div className="flex flex-col ">
              <span className="text-sm font-medium">Amount</span>

              <span className="text-sm font-medium">
                {currency || ""}
                {/* @ts-ignore */}
                {formatAmount(subOrderDetail?.amount)}
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
                    {orderStatusMap?.[orderStatus]?.label}
                  </Badge>
                </div>
              )}
            </div>
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
          </div>
        </div>
        <div className="flex flex-col border-b pb-6 mb-4">
          <span className="text-sm medium">Tracking number</span>
          {(subOrderDetail as any)?.tracking_no ? (
            <a
              href={`/track/${(subOrderDetail as any)?.tracking_no}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline cursor-pointer transition-colors"
            >
              {(subOrderDetail as any)?.tracking_no}
            </a>
          ) : (
            <Badge variant="red">Not available</Badge>
          )}
        </div>
        <div className="flex flex-col border-b pb-6 mb-4">
          <span className="text-sm medium">Collection date</span>
          <span className="text-sm font-medium">
            {collectionWindow ? (
              collectionWindow
            ) : (
              <Badge variant="red">Not available</Badge>
            )}
          </span>
        </div>
        <div className="flex flex-col border-b pb-6 mb-4">
          <span className="text-sm medium">Action type</span>
          {assetActionType[actionType]?.label && (
            <div className="w-fit">
              <Badge
                className={assetActionType[actionType]?.className}
                variant={assetActionType[actionType]?.variant as any}
              >
                {assetActionType[actionType]?.label}
              </Badge>
            </div>
          )}
        </div>
        {actionType === "reassign" && (
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-row items-center gap-x-3 sm:gap-x-6">
              <Avatar className="h-[4rem] w-[4rem] border-2 border-white shadow-md">
                <AvatarFallback className="text-gray-600 bg-gray-100">
                  {getInitials(
                    `${orderDetails?.from?.first_name} ${orderDetails?.from?.last_name}`,
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1">
                <p className="text-gray-900 font-semibold text-2xl truncate">
                  {truncate(
                    `${orderDetails?.from?.first_name} ${orderDetails?.from?.last_name}`,
                    {
                      length: 20,
                    },
                  )}
                </p>
                <p className="text-gray-900 font-medium text-sm truncate">
                  {orderDetails?.from?.email}
                </p>
                {orderDetails?.from?.address ? (
                  <p className="text-gray-600 font-medium text-sm truncate">
                    {truncate(`${orderDetails?.from?.address}`, {
                      length: 36,
                    })}
                  </p>
                ) : (
                  <Badge variant="red">Not available</Badge>
                )}
              </div>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Separator className="w-[110px]" />
              <p className="text-gray-600 font-semibold text-sm">
                Transferred to
              </p>
              <Separator className="w-[110px]" />
            </div>
            <div className="flex flex-row items-center gap-x-3 sm:gap-x-6 w-full">
              <Avatar className="h-[4rem] w-[4rem] border-2 border-white shadow-md">
                <AvatarFallback className="text-gray-600 bg-gray-100">
                  {getInitials(
                    `${orderDetails?.to?.first_name} ${orderDetails?.to?.last_name}`,
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1">
                <p className="text-gray-900 font-semibold text-2xl truncate">
                  {truncate(
                    `${orderDetails?.to?.first_name} ${orderDetails?.to?.last_name}`,
                    { length: 14 },
                  )}
                </p>
                <p className="text-gray-900 font-medium text-sm truncate">
                  {truncate(`${orderDetails?.to?.email}`, {
                    length: 20,
                  })}
                </p>
                {orderDetails?.to?.address ? (
                  <p className="text-gray-600 font-medium text-sm truncate">
                    {truncate(`${orderDetails?.to?.address}`, {
                      length: 36,
                    })}
                  </p>
                ) : (
                  <Badge variant="red" className="w-[96px]">
                    Not available
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}

        {actionType === "storage" && subOrderDetail?.equipment?.assignee && (
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-row items-center gap-x-3 sm:gap-x-6">
              <Avatar className="h-[4rem] w-[4rem] border-2 border-white shadow-md">
                <AvatarFallback className="text-gray-600 bg-gray-100">
                  {getInitials(
                    `${subOrderDetail?.equipment?.assignee?.name || ""}`,
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1">
                <p className="text-gray-900 font-semibold text-2xl truncate">
                  {truncate(
                    `${subOrderDetail?.equipment?.assignee?.name || ""}`,
                    {
                      length: 20,
                    },
                  )}
                </p>
                <p className="text-gray-900 font-medium text-sm truncate">
                  {subOrderDetail?.equipment?.assignee?.email}
                </p>
                <p className="text-gray-900 font-medium text-sm truncate">
                  {truncate(
                    `${(subOrderDetail?.equipment?.assignee as any)?.address || ""}`,
                    {
                      length: 36,
                    },
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
        {actionType === "resale" && (
          <div className="flex flex-col border-b pb-6 mb-4">
            <span className="text-sm medium">Estimated price</span>
            <span className="text-sm font-medium">
              {currency || ""}
              {formatAmount(orderDetails?.estimated_price) || (
                <Badge variant="red">Not available</Badge>
              )}
            </span>
          </div>
        )}

        {(subOrderDetail as any)?.note?.length > 0 && (
          <OrderNoteActivity
            notes={(subOrderDetail as any)?.note}
            focusedNoteIndex={focusedNoteIndex}
          />
        )}

        <div className="mt-6 pt-6">
          <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5">
            <Switch
              checked={(subOrderDetail as any)?.signature_requested || false}
              onCheckedChange={handleToggle}
              disabled={
                isAdding ||
                isRemoving ||
                isOrderStatusLocked ||
                (isStorageAction &&
                  !((subOrderDetail as any)?.signature_requested || false))
              }
              className="mt-0.5"
            />
            <div className="flex flex-col gap-1.5">
              <span className="text-base font-semibold text-gray-900">
                Signature Required
              </span>
              <span className="text-sm leading-relaxed text-gray-600">
                Delivery will be attempted only when employee is available to
                receive. However, this will not always be guaranteed
              </span>
            </div>
          </div>
        </div>

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
    </>
  );
};

export default OffboardingInstance;
