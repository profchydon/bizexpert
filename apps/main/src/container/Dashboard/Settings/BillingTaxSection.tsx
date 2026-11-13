"use client";

import { TaxDisplayCard } from "./TaxDisplayCard";
import { TaxJurisdictionCard } from "./TaxJurisdictionCard";

// Billing and tax settings tab. Two rail sections stacked top to bottom: how tax is shown (the
// display-mode draft plus its worked example) and the read-only jurisdiction driven by the billing
// entity, with a demo preview state.
export default function BillingTaxSection() {
  return (
    <div className="flex flex-col gap-6">
      <TaxDisplayCard />
      <TaxJurisdictionCard />
    </div>
  );
}
