"use client";

import { ArrowLeft, ArrowRight } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import type { SupportedCountry } from "../data/supportedCountries";
import { type WizardStep, useImportWizard } from "../hooks/useImportWizard";
import type { ImportCollection, ImportRow } from "../types";
import { AddDevicesStep } from "./AddDevicesStep";
import { CollectionStep } from "./CollectionStep";
import { CountryStep } from "./CountryStep";
import { ImportStepHeader } from "./ImportStepHeader";
import { ReviewStep } from "./ReviewStep";

interface Props {
  onSubmit: (
    country: SupportedCountry,
    rows: ImportRow[],
    collection: ImportCollection,
  ) => void;
  onRegisterInterest: (countries: string[]) => void;
  onCancel: () => void;
  isCancelLoading?: boolean;
}

export function ImportWizard({
  onSubmit,
  onRegisterInterest,
  onCancel,
  isCancelLoading,
}: Props) {
  const w = useImportWizard();

  const next = () => {
    if (w.step < 3) return w.setStep((w.step + 1) as WizardStep);
    if (w.country) onSubmit(w.country, w.validRows, w.collection);
  };
  const back = () =>
    w.step === 0 ? onCancel() : w.setStep((w.step - 1) as WizardStep);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <ImportStepHeader
        step={w.step}
        onStepClick={(i) => i < w.step && w.setStep(i as WizardStep)}
      />
      <div className="min-h-[22rem]">
        {w.step === 0 && (
          <CountryStep
            selected={w.country}
            onSelect={w.setCountry}
            onRegisterInterest={onRegisterInterest}
          />
        )}
        {w.step === 1 && (
          <AddDevicesStep
            rows={w.rows}
            issues={w.issues}
            validCount={w.validCount}
            invalidCount={w.invalidCount}
            onChange={w.setRows}
          />
        )}
        {w.step === 2 && (
          <CollectionStep
            collection={w.collection}
            onPatch={w.patchCollection}
            country={w.country?.country}
          />
        )}
        {w.step === 3 && w.country && (
          <ReviewStep
            country={w.country}
            devices={w.validRows}
            collection={w.collection}
          />
        )}
      </div>
      <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-secondary bg-primary py-4">
        <Button
          size="md"
          color="secondary"
          iconLeading={w.step === 0 ? undefined : ArrowLeft}
          isLoading={w.step === 0 ? isCancelLoading : false}
          onClick={back}
          data-testid="importwizard-button"
        >
          {w.step === 0 ? "Cancel" : "Back"}
        </Button>
        <Button
          size="md"
          iconTrailing={w.step === 3 ? undefined : ArrowRight}
          onClick={next}
          isDisabled={!w.canContinue}
          data-testid="importwizard-button-2"
        >
          {w.step === 3 ? "Submit import request" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
