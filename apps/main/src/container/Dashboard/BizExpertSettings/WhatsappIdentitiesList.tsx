"use client";

import { Button } from "@/components/ui/button";
import type { Location, WhatsappIdentity } from "@/types/bizexpert";
import { WhatsappStatusBadge } from "./WhatsappStatusBadge";
import {
  settingsTableCountBadgeClass,
  settingsTableShellClass,
  settingsTableTitleClass,
  settingsTableToolbarClass,
} from "./settingsPageClasses";

type Props = {
  identities: WhatsappIdentity[];
  locations: Location[];
  onUnlink: (identity: WhatsappIdentity) => void;
};

function locationName(
  locations: Location[],
  locationId?: string | null,
): string {
  if (!locationId) return "No default location";
  return (
    locations.find((location) => location.id === locationId)?.name ??
    "Unknown location"
  );
}

export function WhatsappIdentitiesList({
  identities,
  locations,
  onUnlink,
}: Props) {
  return (
    <div className={settingsTableShellClass}>
      <div className={settingsTableToolbarClass}>
        <h2 className={settingsTableTitleClass}>
          Linked identities
          <span className={settingsTableCountBadgeClass}>
            {identities.length}
          </span>
        </h2>
      </div>
      <ul className="divide-y divide-gray-200">
        {identities.map((identity) => (
          <li
            key={identity.id}
            className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {identity.whatsappPhone}
              </p>
              <p className="mt-0.5 text-sm text-gray-500">
                {locationName(locations, identity.defaultLocationId)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <WhatsappStatusBadge isVerified={identity.isVerified} />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onUnlink(identity)}
              >
                Unlink
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
