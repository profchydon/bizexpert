"use client";

import { Button } from "@/components/base/buttons/button";
import { DisabledWithTooltip } from "@/components/base/tooltip/disabled-with-tooltip";

export function OverviewInviteButton() {
  return (
    <DisabledWithTooltip isDisabled reason="Coming soon">
      <Button
        type="button"
        size="sm"
        isDisabled
        data-testid="overviewinvitebutton-button"
      >
        + Invite
      </Button>
    </DisabledWithTooltip>
  );
}
