"use client";

import { Button } from "@/components/base/buttons/button";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import routes from "@/routes";

export function FleetNotAuthorizedState() {
  const { push, isPending } = useTransitionRouter();

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white px-8 py-16 text-center">
      <h3 className="text-lg font-semibold text-gray-900">Not authorized</h3>
      <p className="max-w-md text-sm text-gray-600">
        You do not have access to fleet telemetry for this scope.
      </p>
      <Button
        color="primary"
        size="md"
        isLoading={isPending}
        onClick={() => push(routes.OVERVIEW)}
        data-testid="fleetnotauthorizedstate-button"
      >
        Return to Overview
      </Button>
    </div>
  );
}
