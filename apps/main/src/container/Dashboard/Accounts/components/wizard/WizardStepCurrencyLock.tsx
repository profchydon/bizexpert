import { AlertTriangle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { wizardCheckboxClass } from "./wizardFieldClasses";

interface Props {
  currency: string | null;
  confirmed: boolean;
  onConfirmedChange: (value: boolean) => void;
  showErrors: boolean;
}

export function WizardStepCurrencyLock({
  currency,
  confirmed,
  onConfirmedChange,
  showErrors,
}: Props) {
  const currencyLabel = currency ?? "this currency";
  const confirmInvalid = showErrors && !confirmed;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-3 rounded-xl bg-warning-50 p-4">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning-600" />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-gray-900">
            This currency is permanent
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{currencyLabel}</span>{" "}
            will be locked as this entity&apos;s billing currency. It can&apos;t
            be changed later. Every office under it inherits it, and correcting
            it requires creating a new entity.
          </p>
        </div>
      </div>

      <div id="wf-confirm" className="flex flex-col gap-1.5">
        <div className="flex items-start gap-3">
          <Checkbox
            id="currency-lock-confirm"
            checked={confirmed}
            onCheckedChange={(checked) => onConfirmedChange(checked === true)}
            className={wizardCheckboxClass}
            data-testid="wizardstepcurrencylock-checkbox"
          />
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="currency-lock-confirm"
              className="cursor-pointer text-sm font-semibold leading-snug text-gray-900"
            >
              I understand {currencyLabel} is permanent
            </Label>
            <p className="text-sm text-gray-500">
              You can still go back and change the currency until you confirm
              here.
            </p>
          </div>
        </div>
        {confirmInvalid && (
          <p className="text-sm text-error-600">Confirm to continue.</p>
        )}
      </div>
    </div>
  );
}
