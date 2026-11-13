"use client";

import { CoinsStacked01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { DisabledWithTooltip } from "@/components/base/tooltip/disabled-with-tooltip";

interface Props {
  onRequestQuote: () => void;
  onSkip: () => void;
  onBack: () => void;
}

export function DisposeBuybackStep({ onSkip, onBack }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-3 rounded-lg border border-secondary p-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-success-secondary text-success-primary">
          <CoinsStacked01 className="size-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-primary">
            Recover value before you dispose
          </p>
          <p className="mt-1 text-sm text-tertiary">
            Your plan is eligible for buyback. Request a quote and Rayda will
            assess the device — accepted value is credited to your Rayda wallet.
            Disposal pauses until you respond.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <DisabledWithTooltip
          isDisabled
          reason="Coming soon"
          triggerClassName="w-full"
        >
          <Button
            size="md"
            isDisabled
            className="w-full"
            data-testid="disposebuybackstep-button"
          >
            Request a buyback quote
          </Button>
        </DisabledWithTooltip>
        <Button
          size="md"
          color="secondary"
          onClick={onSkip}
          className="w-full"
          data-testid="disposebuybackstep-button-2"
        >
          Skip buyback and dispose
        </Button>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="self-start text-sm font-semibold text-tertiary transition hover:text-primary"
      >
        Back
      </button>
    </div>
  );
}
