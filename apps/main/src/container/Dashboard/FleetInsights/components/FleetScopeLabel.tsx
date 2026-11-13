"use client";

import type { FleetScope } from "@/types/telemetry";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";

export function FleetScopeLabel({ scope }: Readonly<{ scope?: FleetScope }>) {
  const { access, isGlobalWorkspace } = useActiveWorkspace();

  if (access.actingRole === "office") {
    return (
      <p className="text-sm text-gray-500">
        Showing devices for your assigned office
      </p>
    );
  }

  if (!isGlobalWorkspace) {
    return (
      <p className="text-sm text-gray-500">Showing devices for this entity</p>
    );
  }

  if (scope?.account_wide) {
    return <p className="text-sm text-gray-500">Showing all entities</p>;
  }

  return <p className="text-sm text-gray-500">Showing scoped fleet</p>;
}
