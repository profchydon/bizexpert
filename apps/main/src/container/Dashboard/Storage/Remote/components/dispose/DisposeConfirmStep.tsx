"use client";

import { useGetServiceFeesQuery } from "@/api/baseQueries/feesApi/getServiceFees";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { useWorkspaceCurrencySymbol } from "@/hooks/useWorkspaceCurrencySymbol";
import { ERASURE_FEE } from "../../data/plans";
import type { DisposalMethod, StoredDevice } from "../../types/storage";
import { formatFeePerDevice } from "../../utils/storagePricing";

interface Props {
  device: StoredDevice;
  alreadyErased: boolean;
  method: DisposalMethod;
  acknowledged: boolean;
  onAcknowledge: (value: boolean) => void;
  error: string | null;
  isLoading?: boolean;
  onBack: () => void;
  onConfirm: () => void;
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-tertiary">{label}</span>
      <span className="text-right text-sm font-medium text-primary">
        {children}
      </span>
    </div>
  );
}

export function DisposeConfirmStep({
  device,
  alreadyErased,
  method,
  acknowledged,
  onAcknowledge,
  error,
  isLoading = false,
  onBack,
  onConfirm,
}: Props) {
  const { data: serviceFees } = useGetServiceFeesQuery();
  const erasureFee = serviceFees?.data?.Dispose ?? ERASURE_FEE;
  const currencySymbol = useWorkspaceCurrencySymbol();
  const isDonate = method === "donate";
  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-2 rounded-lg border border-secondary p-4">
        <Row label="Device">{device.deviceName}</Row>
        <Row label={isDonate ? "Certified erasure" : "Secure destruction"}>
          {isDonate && alreadyErased
            ? "Free — already erased"
            : formatFeePerDevice(erasureFee, currencySymbol)}
        </Row>
        <Row label={isDonate ? "After erasure" : "Deliverable"}>
          {isDonate
            ? "Enrolled in the Rayda Impact Program"
            : "Certificate of destruction"}
        </Row>
      </section>

      <Checkbox
        isSelected={acknowledged}
        onChange={onAcknowledge}
        label={
          isDonate
            ? "I understand this device will be erased and donated, and cannot be recovered."
            : "I understand this device will be permanently destroyed, and cannot be recovered."
        }
        data-testid="disposeconfirmstep-checkbox"
      />

      {error && <p className="text-sm text-error-primary">{error}</p>}

      <div className="flex justify-between gap-3">
        <Button
          size="md"
          color="secondary"
          isDisabled={isLoading}
          onClick={onBack}
          data-testid="disposeconfirmstep-button"
        >
          Back
        </Button>
        <Button
          size="md"
          color="primary-destructive"
          onClick={onConfirm}
          isDisabled={!acknowledged || isLoading}
          isLoading={isLoading}
          data-testid="disposeconfirmstep-button-2"
        >
          Confirm disposal
        </Button>
      </div>
    </div>
  );
}
