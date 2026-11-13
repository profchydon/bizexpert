"use client";

import Link from "next/link";
import { Badge } from "@/components/base/badges/badges";
import { useFleetSummary } from "@/container/Dashboard/FleetInsights/hooks/useFleetSummary";
import { useEntitlementOn } from "@/container/Dashboard/Settings/Subscription/useCompanyEntitlements";
import {
  fleetToneChipClass,
  fleetToneLabel,
} from "@/container/Dashboard/FleetInsights/utils/fleetTone";
import routes from "@/routes";

function formatPercent(value: number | null | undefined): string {
  if (value == null) return "—";
  const percent = value <= 1 ? value * 100 : value;
  return `${Math.round(percent)}%`;
}

export function FleetHealthStrip() {
  const access = useEntitlementOn("telemetry_agent");
  const { payload, tone, insightCount, isLoading, isError } = useFleetSummary();

  if (!access.ready || !access.on || isLoading || isError || !payload) {
    return null;
  }

  const posture = payload.controls?.posture;
  const summary = payload.summary;
  const stats = payload.stats;
  const encryptedRate =
    summary.device_count > 0
      ? (summary.encrypted_device_count / summary.device_count) * 100
      : null;

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900">Fleet health</h3>
        <Link
          href={routes.FLEET_INSIGHTS}
          className="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          View fleet insights
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <Metric
          label="Compliance posture"
          value={formatPercent(posture?.pass_rate)}
          extra={
            <span
              className={`rounded-full border px-2 py-0.5 text-xs font-medium ${fleetToneChipClass(tone)}`}
            >
              {fleetToneLabel(tone)}
            </span>
          }
        />
        <Metric label="Encrypted" value={formatPercent(encryptedRate)} />
        <Metric label="OS updates" value="Not collected" />
        <Metric label="Battery health" value="Not collected" />
        <Metric
          label="Need attention"
          value={`${stats?.needs_attention_count ?? 0} of ${stats?.vault_count ?? 0}`}
        />
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">Insights</span>
          <Badge color="gray" size="sm" type="pill-color">
            {insightCount} insight{insightCount === 1 ? "" : "s"}
          </Badge>
        </div>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  extra,
}: Readonly<{
  label: string;
  value: string;
  extra?: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-500">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-900">{value}</span>
        {extra}
      </div>
    </div>
  );
}
