"use client";

import { currencySymbol } from "@/utils/currencySymbol";
import { ERASURE_FEE } from "../../data/plans";
import { useGetServiceFeesQuery } from "@/api/baseQueries/feesApi/getServiceFees";
import { AlertTriangle } from "@untitledui/icons";
import { Checkbox } from "@/components/base/checkbox/checkbox";

function WipeBanner({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-warning-300 bg-warning-50 p-4">
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning-primary" />
        <div>
          <p className="text-sm font-semibold text-primary">{title}</p>
          <p className="mt-0.5 text-sm text-secondary">{body}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

/** Single-device deploy gate — shown when the device entered storage without a wipe. */
export function DeployWipePrompt({
  checked,
  currency,
  onChange,
}: {
  checked: boolean;
  currency?: string | null;
  onChange: (checked: boolean) => void;
}) {
  const { data: serviceFees } = useGetServiceFeesQuery();
  const factoryResetFee = serviceFees?.data?.Factory_Reset ?? ERASURE_FEE;
  return (
    <WipeBanner
      title="Still has company data"
      body="This device was not wiped before it was moved to storage. We recommend a full factory reset before it ships to a new employee."
    >
      <Checkbox
        isSelected={checked}
        onChange={onChange}
        label="Wipe before sending"
        hint={`Full Factory Reset · adds ${currencySymbol(currency)}${factoryResetFee}`}
        data-testid="wipeprompts-checkbox"
      />
      {!checked && (
        <p className="text-xs text-warning-primary">
          The device will ship as-is, with its data intact.
        </p>
      )}
    </WipeBanner>
  );
}

/** Bulk-deploy banner — the per-device wipe checkboxes live on the device rows below. */
export function BulkWipeBanner({ count }: { count: number }) {
  return (
    <WipeBanner
      title={`${count} of the selected devices still ${count === 1 ? "has" : "have"} company data`}
      body="They were not wiped before they were moved to storage. Tick the ones you want factory reset before shipping — unticked devices ship as-is, with their data intact."
    />
  );
}
