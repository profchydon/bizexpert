export enum SignatureStatus {
  NOT_REQUESTED = "not_requested",
  PARTIALLY_REQUESTED = "partially_requested",
  REQUESTED = "requested",
}

export const signatureStatusMap: Record<
  SignatureStatus | "true" | "false",
  {
    className: string;
    label: string;
    variant: string;
  }
> = {
  [SignatureStatus.PARTIALLY_REQUESTED]: {
    className: "w-fit",
    label: "Partial required",
    variant: "awaiting_border",
  },
  [SignatureStatus.REQUESTED]: {
    className: "w-fit",
    label: "Signature required",
    variant: "blue_border",
  },
  [SignatureStatus.NOT_REQUESTED]: {
    className: "w-fit",
    label: "Not required",
    variant: "gray_border",
  },
  // Legacy boolean support
  true: {
    className: "w-fit",
    label: "Signature required",
    variant: "blue_border",
  },
  false: {
    className: "w-fit",
    label: "Not required",
    variant: "gray_border",
  },
};
