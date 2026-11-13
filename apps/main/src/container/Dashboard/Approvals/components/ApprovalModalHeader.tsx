import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import routes from "@/routes";
import type { ApprovalEmployee, ApprovalRecord } from "../types";
import { uniqueApprovalSources } from "../utils";
import { ApprovalStatusBadge, ItemSourceBadge } from "./Badges";
import { ModalPill } from "./ApprovalModalParts";
import { GitBranch02, XClose } from "./UntitledIcons";

const dash = "-";

export function ApprovalModalHeader({
  disableLinks = false,
  employee,
  onClose,
  record,
}: {
  disableLinks?: boolean;
  employee?: ApprovalEmployee;
  onClose: () => void;
  record: ApprovalRecord;
}) {
  const sources = uniqueApprovalSources(record);
  const kitId = record.kitId ?? record.items.find((item) => item.kitId)?.kitId;
  const employeeDetails = [employee?.role, employee?.level, employee?.country]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="relative shrink-0 bg-gray-50 px-6 pb-5 pt-6 md:px-8 md:pb-6 md:pt-7">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close approval card"
        className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-500"
      >
        <XClose size={18} />
      </button>
      <div className="flex flex-wrap items-center gap-2">
        <ApprovalStatusBadge status={record.status} />
      </div>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-200 text-base font-medium text-gray-700">
            {employee?.initials ?? dash}
          </span>
          <div className="min-w-0">
            <DialogTitle className="truncate text-xl font-medium text-gray-900">
              {employee?.name ?? dash}
            </DialogTitle>
            <DialogDescription className="mt-1 truncate text-sm text-gray-500">
              {employeeDetails || dash}
            </DialogDescription>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ModalPill
            tone="brand"
            href={!disableLinks && kitId ? routes.KIT_DETAIL(kitId) : undefined}
          >
            {record.kitName ?? dash}
          </ModalPill>
          <ModalPill
            tone="gray"
            icon={<GitBranch02 size={13} />}
            href={
              !disableLinks && record.catalogId
                ? routes.CATALOG_POLICY_DETAIL(record.catalogId)
                : undefined
            }
          >
            {record.matchedRuleName ?? dash}
          </ModalPill>
          {sources.map((source) => (
            <ItemSourceBadge key={source} source={source} />
          ))}
        </div>
      </div>
    </div>
  );
}
