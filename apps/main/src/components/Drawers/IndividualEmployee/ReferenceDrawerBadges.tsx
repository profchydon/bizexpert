import { ReactNode } from "react";
import { CheckCircle2, ClipboardCheck, RefreshCcw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type StatusTone = {
  label: string;
  className: string;
  icon: ReactNode;
  tooltip: string;
};

const STATUS_TONES: Record<string, StatusTone> = {
  verification_pending: {
    label: "Verification pending",
    className: "bg-[#fef6ee] text-[#b93815] ring-[#f9dbaf]",
    icon: <ClipboardCheck className="h-3 w-3" />,
    tooltip:
      "Delivery details unconfirmed. Order proceeds automatically after 24 hours.",
  },
  in_progress: {
    label: "In progress",
    className: "bg-[#fffaeb] text-[#b54708] ring-[#fedf89]",
    icon: <RefreshCcw className="h-3 w-3" />,
    tooltip: "Delivery is in progress for this employee.",
  },
  completed: {
    label: "Completed",
    className: "bg-[#ecfdf3] text-[#067647] ring-[#abefc6]",
    icon: <CheckCircle2 className="h-3 w-3" />,
    tooltip: "All items have been delivered to this employee.",
  },
};

const DEFAULT_STATUS: StatusTone = STATUS_TONES.in_progress;

const SIGNATURE_TONES = {
  required: {
    label: "Signature required",
    className: "bg-[#e7f0ff] text-[#0948b5] ring-[#8fb9ff]",
    tooltip: "A recipient signature is required upon delivery.",
  },
  not_required: {
    label: "Not required",
    className: "bg-[#fafafa] text-[#414651] ring-[#e9eaeb]",
    tooltip: "No signature needed - items will be left at the address.",
  },
} as const;

export const ReferenceStatusBadge = ({ status }: { status?: string }) => {
  const tone = STATUS_TONES[status?.toLowerCase() || ""] ?? DEFAULT_STATUS;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={`inline-flex cursor-default whitespace-nowrap items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${tone.className}`}
          >
            {tone.icon}
            {tone.label}
          </span>
        </TooltipTrigger>
        <TooltipContent>{tone.tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const ACTION_TONES: Record<string, { label: string; className: string }> = {
  reassign: { label: "Reassign", className: "bg-[#e7f0ff] text-[#0948b5]" },
  resale: { label: "Resale", className: "bg-[#ecfdf3] text-[#067647]" },
  storage: { label: "Storage", className: "bg-[#fafafa] text-[#414651]" },
  buy_to_storage: {
    label: "Buy to Storage",
    className: "bg-[#f4f3ff] text-[#6941c6]",
  },
  archive: { label: "Archive", className: "bg-[#fef3f2] text-[#b42318]" },
};

export const ReferenceActionTypeBadge = ({ type }: { type?: string }) => {
  const tone = type ? ACTION_TONES[type] : undefined;
  if (!tone) return <span className="text-sm text-[#98a2b3]">-</span>;
  return (
    <span
      className={`inline-flex whitespace-nowrap items-center rounded-full px-2 py-0.5 text-xs font-medium ${tone.className}`}
    >
      {tone.label}
    </span>
  );
};

export const ReferenceSignatureBadge = ({
  signatureRequested,
}: {
  signatureRequested: boolean;
}) => {
  const tone = signatureRequested
    ? SIGNATURE_TONES.required
    : SIGNATURE_TONES.not_required;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={`inline-flex cursor-default whitespace-nowrap items-center rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tone.className}`}
          >
            {tone.label}
          </span>
        </TooltipTrigger>
        <TooltipContent>{tone.tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
