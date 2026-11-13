"use client";

import { useMemo, useState } from "react";
import type { SupportedCountry } from "../data/supportedCountries";
import type { ImportCollection, ImportRow } from "../types";
import { validateRows } from "../utils/csv";

export type WizardStep = 0 | 1 | 2 | 3;

const EMPTY_COLLECTION: ImportCollection = {
  address: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  window: "",
};

export function useImportWizard() {
  const [step, setStep] = useState<WizardStep>(0);
  const [country, setCountry] = useState<SupportedCountry | null>(null);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [collection, setCollection] =
    useState<ImportCollection>(EMPTY_COLLECTION);

  const issues = useMemo(() => validateRows(rows), [rows]);
  const validCount = rows.filter((r) => !issues.has(r.id)).length;
  const invalidCount = rows.length - validCount;
  const validRows = rows.filter((r) => !issues.has(r.id));

  const canContinue = useMemo(() => {
    if (step === 0) return Boolean(country);
    if (step === 1) return validCount > 0;
    if (step === 2)
      return Boolean(
        collection.address.trim() &&
        collection.contactName.trim() &&
        collection.contactEmail.trim() &&
        collection.contactPhone.trim(),
      );
    return true;
  }, [step, country, validCount, collection]);

  const patchCollection = (patch: Partial<ImportCollection>) =>
    setCollection((c) => ({ ...c, ...patch }));

  return {
    step,
    setStep,
    country,
    setCountry,
    rows,
    setRows,
    collection,
    patchCollection,
    issues,
    validCount,
    invalidCount,
    validRows,
    canContinue,
  };
}
