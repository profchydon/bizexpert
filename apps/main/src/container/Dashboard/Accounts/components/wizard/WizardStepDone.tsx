import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { CardCaptureOutcome } from "../../types";

interface Props {
  name: string;
  outcome: CardCaptureOutcome;
}

export function WizardStepDone({ name, outcome }: Props) {
  const stalled = outcome === "stalled";

  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      {stalled ? (
        <AlertTriangle className="size-12 text-warning-600" />
      ) : (
        <CheckCircle2 className="size-12 text-success-600" />
      )}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {stalled
            ? `${name || "Entity"} created, card pending`
            : `${name || "Entity"} is operational`}
        </h3>
        <p className="mt-1 max-w-sm text-sm text-gray-600">
          {stalled
            ? "The entity is visible in your account but is blocked from billable activity until card capture is completed. You can retry card capture from its detail page."
            : "The entity is live and bills independently, with its own currency, card on file, and a fresh Day-60 credit clock."}
        </p>
      </div>
    </div>
  );
}
