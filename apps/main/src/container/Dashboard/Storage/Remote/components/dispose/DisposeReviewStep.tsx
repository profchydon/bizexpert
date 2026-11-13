"use client";

import { useGetServiceFeesQuery } from "@/api/baseQueries/feesApi/getServiceFees";
import { Button } from "@/components/base/buttons/button";
import { useWorkspaceCurrencySymbol } from "@/hooks/useWorkspaceCurrencySymbol";
import { ERASURE_FEE } from "../../data/plans";
import type { DisposalMethod, StoredDevice } from "../../types/storage";
import { formatFeePerDevice } from "../../utils/storagePricing";
import { CheckFreshness } from "../CheckFreshness";
import { GradeBadge } from "../StorageBadges";
import { DisposalMethodChoice } from "./DisposalMethodChoice";

interface Props {
  device: StoredDevice;
  alreadyErased: boolean;
  method: DisposalMethod;
  onMethod: (method: DisposalMethod) => void;
  onCancel: () => void;
  onContinue: () => void;
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

export function DisposeReviewStep({
  device,
  alreadyErased,
  method,
  onMethod,
  onCancel,
  onContinue,
}: Props) {
  const { data: serviceFees } = useGetServiceFeesQuery();
  const erasureFee = serviceFees?.data?.Dispose ?? ERASURE_FEE;
  const currencySymbol = useWorkspaceCurrencySymbol();
  const isDonate = method === "donate";
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-tertiary">
        Choose how to retire {device.deviceName} from storage.
      </p>

      <DisposalMethodChoice value={method} onChange={onMethod} />

      <section className="flex flex-col gap-2 rounded-lg border border-secondary p-4">
        <Row label="Device">{device.deviceName}</Row>
        <Row label="Serial">{device.serialNumber}</Row>
        <Row label="Condition">
          <span className="flex items-center justify-end gap-2">
            {device.grade ? (
              <GradeBadge grade={device.grade} label={device.gradeLabel} />
            ) : (
              <span className="text-xs text-quaternary">Ungraded</span>
            )}
            <CheckFreshness device={device} />
          </span>
        </Row>
        <Row label="Location">{device.country}</Row>
      </section>

      <div className="flex items-center justify-between gap-3 rounded-lg bg-secondary p-3">
        <span className="text-sm text-secondary">
          {isDonate ? "Certified erasure" : "Secure destruction"}
        </span>
        <span className="text-sm font-semibold text-primary">
          {isDonate && alreadyErased
            ? "Free — already erased (certificate on file)"
            : formatFeePerDevice(erasureFee, currencySymbol)}
        </span>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          size="md"
          color="secondary"
          onClick={onCancel}
          data-testid="disposereviewstep-button"
        >
          Cancel
        </Button>
        <Button
          size="md"
          onClick={onContinue}
          data-testid="disposereviewstep-button-2"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
