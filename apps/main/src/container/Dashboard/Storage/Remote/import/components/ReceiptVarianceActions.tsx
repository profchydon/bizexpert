import { Button } from "@/components/base/buttons/button";
import type { IntakeOutcome } from "../types";

interface Props {
  variance: IntakeOutcome;
  resolved: boolean;
  onConfirm: () => void;
  onDispute: () => void;
  onAccept: () => void;
  onReturn: () => void;
}

export function ReceiptVarianceActions({
  variance,
  resolved,
  onConfirm,
  onDispute,
  onAccept,
  onReturn,
}: Props) {
  if (variance === "none") return null;
  if (resolved)
    return (
      <p className="text-sm font-medium text-success-primary">
        Variance resolved.
      </p>
    );

  if (variance === "shortfall") {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={onConfirm}
          data-testid="receiptvarianceactions-button"
        >
          Confirm shortfall
        </Button>
        <Button
          size="sm"
          color="secondary"
          onClick={onDispute}
          data-testid="receiptvarianceactions-button-2"
        >
          Dispute
        </Button>
      </div>
    );
  }
  if (variance === "surplus") {
    return (
      <Button
        size="sm"
        onClick={onConfirm}
        data-testid="receiptvarianceactions-button-3"
      >
        Review &amp; confirm
      </Button>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        onClick={onAccept}
        data-testid="receiptvarianceactions-button-4"
      >
        Accept device
      </Button>
      <Button
        size="sm"
        color="secondary-destructive"
        onClick={onReturn}
        data-testid="receiptvarianceactions-button-5"
      >
        Return
      </Button>
    </div>
  );
}
