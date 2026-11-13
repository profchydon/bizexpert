"use client";

import { ProgressBarCircle } from "@/components/base/progress-indicators/progress-circles";
import type { FleetPosture } from "@/types/telemetry";
import {
  fleetToneChipClass,
  fleetToneHeadline,
  fleetToneLabel,
  type FleetTone,
} from "../utils/fleetTone";

export function FleetPostureBand({
  posture,
  tone,
  passRate,
}: Readonly<{
  posture?: FleetPosture;
  tone: FleetTone;
  passRate: number | null;
}>) {
  const percent =
    passRate == null
      ? 0
      : passRate <= 1
        ? Math.round(passRate * 100)
        : Math.round(passRate);
  const passing = posture?.passing_checks ?? 0;
  const applicable = posture?.applicable_checks ?? 0;
  const reporting = posture?.reporting_devices ?? 0;

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <ProgressBarCircle
          value={percent}
          size="md"
          label="Posture"
          valueFormatter={(value) => `${Math.round(value)}%`}
        />
        <div className="flex flex-1 flex-col gap-2">
          <span
            className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${fleetToneChipClass(tone)}`}
          >
            {fleetToneLabel(tone)}
          </span>
          <h2 className="text-xl font-semibold text-gray-900">
            {fleetToneHeadline(tone)}
          </h2>
          <p className="text-sm text-gray-600">
            {passing} of {applicable} applicable checks passing across{" "}
            {reporting} reporting device{reporting === 1 ? "" : "s"}
          </p>
        </div>
      </div>
    </section>
  );
}
