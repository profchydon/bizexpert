"use client";

import { LockKeyhole } from "lucide-react";

import type { ApprovalRecord } from "../types";
import { formatApprovalDateTime } from "../utils";
import { ApprovalModalItems } from "./ApprovalModalItems";

export function RejectedApprovalContent({
  record,
}: {
  record: ApprovalRecord;
}) {
  return (
    <div className="relative h-[320px] overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20 blur-sm">
        <ApprovalModalItems historical record={record} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="flex w-full max-w-md flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-error-50 text-error-600">
            <LockKeyhole className="h-5 w-5" />
          </span>
          <h3 className="mt-4 text-base font-semibold text-gray-900">
            Approval rejected
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Rejected on {formatApprovalDateTime(record.updatedAt)}.
          </p>
          <div className="mt-6 w-full rounded-lg border border-error-200 bg-error-50 p-4 text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-error-700">
              Reason for rejection
            </p>
            <p className="mt-1 text-sm font-normal text-error-700">
              {record.rejectionReason ?? "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
