import type { FC } from "react";
import { Globe01, Heart, RefreshCcw02, Users01 } from "@untitledui/icons";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { TableCard } from "@/components/application/table/table";
import type { StorageSummary } from "../hooks/useStorageInventory";
import type { DonatedDevice } from "../types/storage";
import { formatDate } from "../utils/deriveDevice";
import { ImpactBreakdown } from "./ImpactBreakdown";

const RECIPIENT_LABEL: Record<DonatedDevice["recipientType"], string> = {
  ngo: "NGO",
  school: "School",
  individual: "Individual",
};

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: FC<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-secondary bg-primary p-5">
      <span className="flex size-9 items-center justify-center rounded-lg bg-brand-secondary text-brand-secondary">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-2xl font-semibold text-primary">{value}</p>
        <p className="mt-1 text-sm text-tertiary">{label}</p>
      </div>
    </div>
  );
}

export function ImpactTab({
  summary,
  donated,
}: {
  summary: StorageSummary;
  donated: DonatedDevice[];
}) {
  if (donated.length === 0) {
    return (
      <EmptyState size="md" className="py-16">
        <EmptyState.Header pattern="none">
          <EmptyState.Illustration type="cloud" color="gray" />
        </EmptyState.Header>
        <EmptyState.Content>
          <EmptyState.Title>No donated devices yet</EmptyState.Title>
          <EmptyState.Description>
            When you dispose of a device, we donate it through the Rayda Impact
            Program and track your impact here.
          </EmptyState.Description>
        </EmptyState.Content>
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Heart}
          label="Devices donated"
          value={String(summary.donatedCount)}
        />
        <StatCard
          icon={Globe01}
          label="Countries reached"
          value={String(new Set(donated.map((d) => d.country)).size)}
        />
        <StatCard
          icon={Users01}
          label="Estimated beneficiaries"
          value={String(summary.beneficiaries)}
        />
        <StatCard
          icon={RefreshCcw02}
          label="E-waste diverted"
          value={`${summary.ewasteKg} kg`}
        />
      </div>
      <ImpactBreakdown donated={donated} />
      <TableCard.Root>
        <TableCard.Header title="Donated devices" />
        <div className="flex flex-col">
          {donated.map((d) => (
            <div
              key={d.id}
              className="flex flex-wrap items-center gap-3 border-t border-secondary px-5 py-4 first:border-t-0"
            >
              <div className="flex min-w-[220px] flex-1 flex-col">
                <span className="text-sm font-medium text-primary">
                  {d.deviceName}
                </span>
                <span className="text-xs text-tertiary">
                  {d.deviceType} · {d.country}
                </span>
              </div>
              <span className="text-sm text-secondary">
                {d.recipient}{" "}
                <span className="text-quaternary">
                  ({RECIPIENT_LABEL[d.recipientType]})
                </span>
              </span>
              <span className="text-xs text-quaternary">
                {formatDate(d.transferDate)}
              </span>
            </div>
          ))}
        </div>
      </TableCard.Root>
    </div>
  );
}
