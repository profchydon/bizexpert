import { useState } from "react";
import { X } from "lucide-react";
import DrawerRight from "@/components/DrawerRight";
import CustomTooltip from "@/components/CustomTooltip";
import { Switch } from "@/components/ui/switch";
import { IAsset } from "@/types/assets";
import { IOrder, ISubOrder } from "@/types/orders";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  useAddSubOrderSignatureMutation,
  useRemoveSubOrderSignatureMutation,
} from "@/api/baseQueries/companiesApi/ordersApi/updateOrderSignature";
import displayErrorMessage from "@/utils/displayErrorMessage";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { OrderNotesSection } from "@/container/Dashboard/Orders/ViewOrder/v2/OrderNotesSection";
import { collectSubOrderNoteGroups } from "@/container/Dashboard/Orders/ViewOrder/v2/orderNotes";
import ReferenceSlideoutHeader from "./ReferenceSlideoutHeader";
import ReferenceSlideoutItems from "./ReferenceSlideoutItems";
import ReferenceSlideoutRecipient from "./ReferenceSlideoutRecipient";
import ReferenceSlideoutWindow from "./ReferenceSlideoutWindow";
import ReferenceSlideoutTracking from "./ReferenceSlideoutTracking";
import { ReferenceVerificationProgress } from "./ReferenceVerificationProgress";
import { buildSlideoutData, relatedOffboardingSubOrders } from "./slideoutData";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  subOrderDetail?: ISubOrder;
  order?: IOrder;
  orderId: string;
  orderNumber: string;
  currency?: string;
  actionType?: string;
  onView: (asset: IAsset) => void;
  onSignatureUpdated?: () => void;
}

export default function ReferenceEmployeeSlideout({
  isOpen,
  onClose,
  subOrderDetail,
  order,
  orderId,
  orderNumber,
  currency = "",
  actionType,
  onView,
  onSignatureUpdated,
}: Readonly<Props>) {
  const companyId = useWorkspaceCompanyId();
  const [isSaving, setIsSaving] = useState(false);
  const [addSubOrderSignature] = useAddSubOrderSignatureMutation();
  const [removeSubOrderSignature] = useRemoveSubOrderSignatureMutation();
  const relatedSubOrders = relatedOffboardingSubOrders(
    order ?? {},
    subOrderDetail,
  );
  const data = buildSlideoutData(
    subOrderDetail,
    actionType,
    currency,
    relatedSubOrders,
    order,
  );
  const noteGroups = collectSubOrderNoteGroups(
    subOrderDetail ? [subOrderDetail] : [],
  );
  const signatureLocked = data.isStorageAction && !data.signatureRequested;
  const signatureDisabled = isSaving || signatureLocked;
  const signatureDisabledReason = signatureLocked
    ? "Storage items are handled by Rayda and don't require a recipient signature."
    : null;

  const handleSignatureToggle = async (checked: boolean) => {
    const employeeId = data.signatureEmployeeId;
    if (!companyId || !orderId || !employeeId) return;
    setIsSaving(true);
    try {
      const payload = {
        companyId,
        orderId,
        employee_ids: [employeeId],
      };
      if (checked) await addSubOrderSignature(payload).unwrap();
      else await removeSubOrderSignature(payload).unwrap();
      displaySuccessMessage(
        checked
          ? "Signature requirement enabled"
          : "Signature requirement removed",
      );
      onSignatureUpdated?.();
    } catch (error) {
      displayErrorMessage(
        (error as { data?: { message?: string } })?.data?.message ||
          "Failed to update signature requirement",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DrawerRight
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      hideHeader
      hideCloseButton
      hideSaveButton
      cancelText="Close"
      enableOverlay
      width="440"
      className="px-0 pt-0"
      data-testid="referenceemployeeslideout-drawerright"
    >
      <div className="flex flex-col">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#eaecf0] bg-white px-6 py-4">
          <p className="text-xl font-semibold text-[#101828]">{orderNumber}</p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#717680] hover:bg-[#f9fafb]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ReferenceSlideoutHeader
          data={data}
          status={data.status}
          avatarImage={data.items[0]?.image}
        />

        <div className="border-b border-[#eaecf0] px-6 py-4">
          <p className="text-xs font-medium text-[#475467]">Address</p>
          <p className="mt-1 text-sm text-[#475467]">{data.address}</p>
        </div>

        {data.recipient && (
          <ReferenceSlideoutRecipient recipient={data.recipient} />
        )}

        <ReferenceSlideoutWindow data={data} />

        <ReferenceSlideoutTracking
          trackingNo={data.trackingNo}
          externalTrackingLink={data.externalTrackingLink}
          courierName={data.courierName}
        />

        <div className="border-b border-[#eaecf0] px-6 py-4">
          <p className="mb-3 text-sm font-medium text-[#344054]">
            {data.progressLabel}
          </p>
          <ReferenceVerificationProgress
            status={data.status}
            isOffboarding={data.isOffboarding}
            isOffice={data.isOffice}
          />
        </div>

        <ReferenceSlideoutItems items={data.items} onView={onView} />

        <OrderNotesSection groups={noteGroups} className="mx-6" />

        <div className="mx-6 my-4 rounded-xl border border-[#e9eaeb] p-4">
          <div className="flex items-start gap-3">
            {signatureDisabledReason ? (
              <CustomTooltip content={signatureDisabledReason}>
                <span className="mt-0.5 inline-flex">
                  <Switch
                    checked={data.signatureRequested}
                    disabled
                    className="pointer-events-none h-5 w-9 data-[state=checked]:bg-[#0b5de8] data-[state=unchecked]:bg-[#d0d5dd] [&>span]:h-4 [&>span]:w-4 data-[state=checked]:[&>span]:translate-x-4 data-[state=unchecked]:[&>span]:translate-x-0"
                  />
                </span>
              </CustomTooltip>
            ) : (
              <Switch
                checked={data.signatureRequested}
                onCheckedChange={handleSignatureToggle}
                disabled={signatureDisabled}
                className="mt-0.5 h-5 w-9 data-[state=checked]:bg-[#0b5de8] data-[state=unchecked]:bg-[#d0d5dd] [&>span]:h-4 [&>span]:w-4 data-[state=checked]:[&>span]:translate-x-4 data-[state=unchecked]:[&>span]:translate-x-0"
              />
            )}
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-[#414651]">
                Signature Required
              </p>
              <p className="text-sm text-[#535862]">
                Delivery will be attempted only when employee is available to
                receive.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DrawerRight>
  );
}
