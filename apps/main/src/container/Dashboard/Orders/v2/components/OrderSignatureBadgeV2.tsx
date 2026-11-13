import React from "react";
import CustomTooltip from "@/components/CustomTooltip";
import { cn } from "@/lib/utils";

type SignatureKey = "not_required" | "partial_required" | "required";

const SIGNATURE_CONFIG: Record<
  SignatureKey,
  { label: string; className: string; tooltip: string }
> = {
  not_required: {
    label: "Not required",
    className: "bg-gray-50 text-gray-700 ring-gray-200",
    tooltip: "No signature needed — items will be left at the address.",
  },
  partial_required: {
    label: "Partial required",
    className: "bg-purple-50 text-purple-700 ring-purple-700/20",
    tooltip: "Some items require a recipient signature, others do not.",
  },
  required: {
    label: "Signature required",
    className: "bg-primary-50 text-primary-700 ring-primary-200",
    tooltip: "A recipient signature is required upon delivery for all items.",
  },
};

function resolveSignatureKey(
  signatureRequested: boolean | string | null | undefined,
  signatureStatus?: string | null,
): SignatureKey {
  if (signatureStatus === "partial_required") return "partial_required";
  if (signatureStatus === "required") return "required";
  if (signatureStatus === "not_required") return "not_required";
  if (signatureRequested === true || signatureRequested === "requested")
    return "required";
  if (signatureRequested === "partially_requested") return "partial_required";
  return "not_required";
}

interface Props {
  signatureRequested?: boolean | string | null;
  signatureStatus?: string | null;
  className?: string;
}

const OrderSignatureBadgeV2: React.FC<Props> = ({
  signatureRequested,
  signatureStatus,
  className,
}) => {
  const config =
    SIGNATURE_CONFIG[resolveSignatureKey(signatureRequested, signatureStatus)];

  return (
    <CustomTooltip content={config.tooltip}>
      <span
        className={cn(
          "inline-flex cursor-default items-center whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset",
          config.className,
          className,
        )}
      >
        {config.label}
      </span>
    </CustomTooltip>
  );
};

export { resolveSignatureKey };
export default OrderSignatureBadgeV2;
