"use client";

import Link from "next/link";
import { Button } from "@/components/base/buttons/button";
import routes from "@/routes";

export function FleetEmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white px-8 py-16 text-center">
      <h3 className="text-lg font-semibold text-gray-900">
        No devices reporting yet
      </h3>
      <p className="max-w-md text-sm text-gray-600">
        Add equipment to Device Fleet and install the Rayda agent to start
        collecting fleet telemetry.
      </p>
      <Button
        href={routes.All_Equipments}
        color="primary"
        size="md"
        data-testid="fleetemptystate-button"
      >
        Go to Device Fleet
      </Button>
      <Link
        href={routes.SETTINGS}
        className="text-sm font-medium text-primary-600 hover:text-primary-700"
      >
        Configure agent settings
      </Link>
    </div>
  );
}
