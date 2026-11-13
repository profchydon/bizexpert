"use client";
import { useEffect } from "react";

import { useAuthUserDetail } from "@/utils/useAuthUser";

import type { CatalogRule } from "../../types";
import { ApproverTypeSection } from "./ApproverTypeSection";
import { ApprovalTypeSelect } from "./ApprovalTypeSelect";

export function WizardBudgetApproval({
  draft,
  currencySymbol,
  onChange,
}: {
  draft: CatalogRule;
  currencySymbol: string;
  onChange: (rule: CatalogRule) => void;
}) {
  const { getUserDetails } = useAuthUserDetail();
  const user = getUserDetails();
  const pinnedApproverId = user?.id;
  const budgetValue = draft.budget == null ? "" : String(draft.budget);

  useEffect(() => {
    if (!draft.requiresApproval) return;
    if (draft.approverType !== "ADMIN") {
      onChange({
        ...draft,
        approverType: "ADMIN",
        approverIds:
          draft.approverType === "LINE_MANAGER"
            ? []
            : (draft.approverIds ?? []),
      });
    }
  }, [draft.requiresApproval, draft.approverType]);

  return (
    <div className="flex flex-col gap-5">
      {draft.selectionMode === "OPEN" ? (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Budget per employee <span className="text-error-500">*</span>
          </label>
          <div className="flex h-11 items-center overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm transition focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-100">
            <span className="flex h-full items-center pl-3.5 pr-2 text-sm text-gray-500">
              {currencySymbol}
            </span>
            <input
              type="tel"
              placeholder="1,000.00"
              value={budgetValue}
              onChange={(event) => {
                const clean = event.target.value.replace(/[^\d.]/g, "");
                onChange({ ...draft, budget: clean ? Number(clean) : null });
              }}
              className="h-full min-w-0 flex-1 border-0 bg-transparent px-0 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0"
            />
            <span className="flex h-full items-center px-3 text-sm text-gray-500"></span>
          </div>
          <p className="text-sm text-gray-500">
            Required for open policies and applied to the total value of kits
            and storage selected.
          </p>
        </div>
      ) : null}
      <ApprovalTypeSelect
        value={draft.requiresApproval}
        onChange={(requiresApproval) =>
          onChange({
            ...draft,
            requiresApproval,
            approverType: requiresApproval ? "ADMIN" : null,
            approverIds: [],
          })
        }
      />
      {draft.requiresApproval ? (
        <ApproverTypeSection
          draft={draft}
          onChange={onChange}
          pinnedApproverId={pinnedApproverId}
        />
      ) : null}
    </div>
  );
}
