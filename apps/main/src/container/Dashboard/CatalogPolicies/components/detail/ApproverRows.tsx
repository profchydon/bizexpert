"use client";

import Link from "next/link";
import { User } from "lucide-react";

import type { CatalogRuleApprover } from "../../types";
import {
  formatCatalogApproverLabel,
  getCatalogApproverHref,
} from "../../utilsApprovers";

export function ApproverRows({
  approvers,
}: {
  approvers?: CatalogRuleApprover[];
}) {
  if (!approvers?.length) {
    return (
      <span className="text-sm font-medium leading-5 text-gray-900">-</span>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {approvers.map((approver) => (
        <Link
          key={approver.id}
          href={getCatalogApproverHref(approver.id)}
          className="flex w-full items-center gap-3 rounded-full border border-gray-200 bg-gray-50 py-1 pl-1 pr-1 transition hover:bg-gray-100"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-primary-600 [&>svg]:h-3.5 [&>svg]:w-3.5">
            <User />
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-700">
            {formatCatalogApproverLabel(approver)}
          </span>
          <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700">
            View
          </span>
        </Link>
      ))}
    </div>
  );
}
