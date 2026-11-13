import React from "react";
import { X } from "lucide-react";
import { fullBleedBorderBottomSectionClass } from "@/components/application/dividers/fullBleedDividerClasses";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/getInitials";
import OrderStatusBadgeV2 from "@/container/Dashboard/Orders/v2/components/OrderStatusBadgeV2";
import OrderSignatureBadgeV2 from "@/container/Dashboard/Orders/v2/components/OrderSignatureBadgeV2";
import { OrderNoteActivity } from "../IndividualEmployee/OrderNoteActivity";
import ReferenceItemTimeline from "./ReferenceItemTimeline";
import ItemInfoField from "./ItemInfoField";
import { ItemSlideoutData } from "./itemSlideoutData";

interface Props {
  data: ItemSlideoutData;
  orderNumber: string;
  status?: string;
  canRequestCancel: boolean;
  notes?: unknown[];
  canSeeNotes: boolean;
  focusedNoteIndex?: number | null;
  onClose: () => void;
  onRequestCancel: () => void;
}

const ReferenceItemContent: React.FC<Props> = ({
  data,
  orderNumber,
  status,
  canRequestCancel,
  notes,
  canSeeNotes,
  focusedNoteIndex,
  onClose,
  onRequestCancel,
}) => (
  <div className="flex flex-col pt-6">
    <div className="flex flex-col gap-6 px-6">
      <div className="flex items-start gap-2">
        <p className="flex-1 text-xl font-semibold text-[#101828]">
          {orderNumber}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="flex size-10 items-center justify-center rounded-lg text-[#717680] hover:bg-[#f9fafb]"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="flex items-center gap-5">
        <Avatar className="size-24 shrink-0 border-4 border-white bg-[#f2f4f7] shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)]">
          <AvatarImage src={data.image || ""} className="object-contain" />
          <AvatarFallback className="bg-[#f2f4f7] text-xl font-medium text-[#475467]">
            {getInitials(data.title)}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="truncate text-2xl font-semibold text-[#101828]">
            Order item #{data.index + 1}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <OrderStatusBadgeV2 status={status} />
            <OrderSignatureBadgeV2
              signatureRequested={data.signatureRequested}
            />
          </div>
          {canRequestCancel && (
            <Button
              variant="outline"
              size="sm"
              className="mt-1 h-8 w-fit border-error-200 px-3 text-error-600 hover:bg-error-50 hover:text-error-700"
              onClick={onRequestCancel}
              data-testid="referenceitemcontent-button"
            >
              Request cancel
            </Button>
          )}
        </div>
      </div>
    </div>

    <div className={`${fullBleedBorderBottomSectionClass} mt-6`} />

    <div className="flex flex-col gap-6 px-6 py-6">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium text-[#475467]">Item</p>
        <p className="text-sm text-[#475467]">{data.title}</p>
      </div>

      <div className="flex items-start gap-2">
        <ItemInfoField label="Price" value={data.price} />
        <ItemInfoField label="Phone number" value="—" />
      </div>

      <div className="flex items-start gap-2">
        <ItemInfoField label="Courier" value={data.courierName || "—"} />
        {data.expectedLabel && (
          <ItemInfoField
            label={data.expectedLabel}
            value={data.expectedValue || "—"}
          />
        )}
      </div>

      <ItemInfoField
        label="Tracking number"
        value={data.tracking || "—"}
        href={data.tracking ? `/track/${data.tracking}` : undefined}
      />

      <ItemInfoField
        label="External tracking link"
        value={data.externalTrackingLink || "—"}
        href={data.externalTrackingLink || undefined}
      />

      {data.configLabel && (
        <ItemInfoField label="Configuration" value={data.configLabel} />
      )}
    </div>

    <div className="flex flex-col gap-4 px-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-[#344054]">Order history</p>
        <p className="text-sm text-[#475467]">{data.historyCaption}</p>
      </div>
    </div>

    <div className={fullBleedBorderBottomSectionClass} />

    <div className="px-6 py-4">
      <ReferenceItemTimeline steps={data.history} />
    </div>

    {Array.isArray(notes) && notes.length > 0 && canSeeNotes && (
      <div className="mt-4 border-t border-border-secondary px-6 pt-4">
        <OrderNoteActivity notes={notes} focusedNoteIndex={focusedNoteIndex} />
      </div>
    )}
  </div>
);

export default ReferenceItemContent;
