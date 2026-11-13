import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const billingSource = readFileSync(
  join(dir, "WizardBillingFields.tsx"),
  "utf8",
);
const cardSource = readFileSync(join(dir, "WizardRadioCard.tsx"), "utf8");
const indicatorSource = readFileSync(
  join(dir, "WizardRadioIndicator.tsx"),
  "utf8",
);
const confirmSource = readFileSync(
  join(dir, "WizardStepDelegationConfirm.tsx"),
  "utf8",
);
const wizardHookSource = readFileSync(
  join(dir, "../../hooks/useSubsidiaryWizard.ts"),
  "utf8",
);

describe("WizardBillingFields", () => {
  it("uses full-width radio cards with top-right indicators", () => {
    assert.match(billingSource, /WizardRadioCard/);
    assert.match(billingSource, /Billing responsibility/);
    assert.match(
      billingSource,
      /Another entity in the account pays\. Currency and payment method are inherited\./,
    );
    assert.doesNotMatch(billingSource, /RadioGroupItem/);
  });

  it("loads billing entities from the whole account, not the selected country", () => {
    assert.match(billingSource, /useBillingEntityOptions/);
    assert.match(billingSource, /filterByCountry: false/);
    assert.match(
      billingSource,
      /No self-billing entities are available in this account yet\./,
    );
    assert.doesNotMatch(billingSource, /filterByCountry: true/);
    assert.match(confirmSource, /filterByCountry: false/);
    assert.match(wizardHookSource, /filterByCountry: false/);
  });
});

describe("WizardRadioCard", () => {
  it("makes the entire card the selectable control", () => {
    assert.match(
      cardSource,
      /RadioGroupPrimitive\.Item value=\{value\} asChild/,
    );
    assert.match(cardSource, /<button/);
    assert.match(cardSource, /WizardRadioIndicator/);
    assert.match(cardSource, /absolute right-4 top-4/);
  });
});

describe("WizardRadioIndicator", () => {
  it("matches the reference filled-ring selected state", () => {
    assert.match(indicatorSource, /bg-primary-600 ring-primary-600/);
    assert.match(indicatorSource, /bg-white ring-gray-300/);
    assert.match(indicatorSource, /size-4/);
  });
});
