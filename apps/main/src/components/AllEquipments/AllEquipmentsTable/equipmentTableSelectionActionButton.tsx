"use client";

import { Button } from "@/components/base/buttons/button";
import { DisabledWithTooltip } from "@/components/base/tooltip/disabled-with-tooltip";
import { Offboard_asset } from "@/types/offboarding";
import type { ComponentType, PropsWithChildren } from "react";

export function toOffboardingList(
  data: Offboard_asset[] | Offboard_asset | undefined | null,
) {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

export function SelectionActionGroup({ children }: PropsWithChildren) {
  return <div className="flex flex-wrap items-center gap-2">{children}</div>;
}

export function SelectionActionButton({
  isDisabled,
  reason,
  onPress,
  testId,
  icon: Icon,
  label,
}: {
  isDisabled: boolean;
  reason?: string | null;
  onPress: () => void;
  testId: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
}) {
  const button = (
    <Button
      size="sm"
      color="secondary"
      iconLeading={Icon}
      isDisabled={isDisabled}
      onPress={isDisabled ? undefined : onPress}
      data-testid="equipmenttableselectionactionbutton-button"
    >
      {label}
    </Button>
  );

  return (
    <DisabledWithTooltip isDisabled={isDisabled} reason={reason}>
      {button}
    </DisabledWithTooltip>
  );
}
