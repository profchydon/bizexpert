"use client";

import {
  BatteryCharging01,
  CreditCard02,
  ShieldTick,
  Signal01,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import routes from "@/routes";

const FEATURES = [
  {
    icon: ShieldTick,
    text: "Compliance at a glance: encryption, firewall, antivirus, and screen lock on every device.",
  },
  {
    icon: BatteryCharging01,
    text: "Battery, storage, and OS patch health, so you replace before things fail.",
  },
  {
    icon: Signal01,
    text: "Live sync status across the fleet, with stale devices clearly flagged.",
  },
];

export function EquipmentTelemetryLockedState() {
  return (
    <section className="flex flex-col items-center rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-xs">
      <FeaturedIcon
        icon={Signal01}
        size="lg"
        color="brand"
        theme="light"
        className="rounded-full"
      />
      <h2 className="mt-5 text-lg font-semibold text-gray-900">
        See inside every device with Telemetry
      </h2>
      <p className="mt-1 max-w-md text-sm text-gray-600">
        The Rayda agent reports device health, compliance, and installed
        software. Telemetry is part of the Manage plan and above.
      </p>
      <ul className="mt-6 flex w-full max-w-md flex-col gap-3 text-left">
        {FEATURES.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-start gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-50">
              <Icon className="size-4 text-fg-brand-primary" />
            </span>
            <span className="text-sm text-gray-700">{text}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Button
          size="md"
          color="primary"
          iconLeading={CreditCard02}
          href={routes.SETTINGS_SUBSCRIPTION}
          data-testid="telemetrylockedstate-button"
        >
          Upgrade to Manage
        </Button>
      </div>
    </section>
  );
}
