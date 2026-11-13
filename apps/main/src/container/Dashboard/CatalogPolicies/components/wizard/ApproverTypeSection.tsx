"use client";

import { Info } from "lucide-react";

import type { CatalogRule } from "../../types";
import { AdditionalApproverField } from "./AdditionalApproverField";

export function ApproverTypeSection({
  draft,
  onChange,
  pinnedApproverId,
}: {
  draft: CatalogRule;
  onChange: (rule: CatalogRule) => void;
  pinnedApproverId?: string;
}) {
  const additionalApproverIds = (draft.approverIds ?? []).filter(
    (id) => id !== pinnedApproverId,
  );

  return (
    <div className="flex flex-col gap-5">
      <AdditionalApproverField
        excludeId={pinnedApproverId}
        selectedIds={additionalApproverIds}
        onChange={(ids) =>
          onChange({
            ...draft,
            approverType: "ADMIN",
            approverIds: ids,
          })
        }
      />
      <div className="flex gap-3 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-600">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>
          Approvals default to{" "}
          <span className="font-semibold text-gray-700">Admin</span> and{" "}
          <span className="font-semibold text-gray-700">Line manager</span> as
          well.
        </p>
      </div>
    </div>
  );
}
