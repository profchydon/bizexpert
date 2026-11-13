"use client";

import { CreditCard, Lock } from "lucide-react";

interface Props {
  name: string;
  currency: string | null;
}

export function WizardStepCardCapture({ name, currency }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 ring-4 ring-primary-100">
          <CreditCard className="size-5 text-primary-700" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">
            Add a card for {name || "this entity"}
          </p>
          <p className="text-sm text-gray-600">
            Billed in {currency ?? "your currency"}. This entity keeps its own
            card on file.
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-600">
        Selecting complete card capture creates the entity, then starts secure
        card capture on Stripe&apos;s hosted page. You&apos;ll return to Account
        management when finished.
      </p>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Lock className="size-4" />
        Payments are processed securely by Stripe. Rayda never stores your card
        number.
      </div>
    </div>
  );
}
