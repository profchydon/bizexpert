"use client";

import { useState } from "react";
import type { OfficeDraft, OfficeParent } from "../../types";

export function useOfficeWizard(fixedParentId?: string) {
  const [draft, setDraft] = useState<OfficeDraft>({
    name: "",
    parentId: fixedParentId ?? null,
    type: "physical",
    address: "",
    adminNames: [],
  });

  function update(patch: Partial<OfficeDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  function reset() {
    setDraft({
      name: "",
      parentId: fixedParentId ?? null,
      type: "physical",
      address: "",
      adminNames: [],
    });
  }

  const addressNeeded = draft.type === "physical";
  const valid =
    !!draft.parentId &&
    draft.name.trim().length > 0 &&
    draft.adminNames.length > 0 &&
    (!addressNeeded || draft.address.trim().length > 0);

  function firstInvalidField(): string | null {
    if (!draft.parentId) return "parent";
    if (!draft.name.trim()) return "name";
    if (addressNeeded && !draft.address.trim()) return "address";
    if (draft.adminNames.length === 0) return "adminNames";
    return null;
  }

  return { draft, update, reset, valid, firstInvalidField };
}

export function parentAtLimit(
  parent: OfficeParent | undefined,
  limit: number,
): boolean {
  return !!parent && parent.officesCount >= limit;
}
