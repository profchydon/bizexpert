import type { ApprovalEmployee, ApprovalRecord, ApprovalSort } from "../types";
import { formatApprovalMoney, uniqueApprovalSources } from "../utils";
import { ApprovalStatusBadge, ItemSourceBadge } from "./Badges";
import {
  referenceNativeBodyCellClass,
  referenceNativeBodyRowClass,
  referenceNativeHeadCellClass,
  referenceNativeHeadRowClass,
  referenceNativeTableClass,
} from "@/components/application/table/reference-table-classes";

export function ApprovalsTable({
  employees,
  onSelect,
  onSortChange,
  records,
  sort,
}: {
  employees: Map<string, ApprovalEmployee>;
  onSelect: (id: string) => void;
  onSortChange: (sort: ApprovalSort) => void;
  records: ApprovalRecord[];
  sort: ApprovalSort;
}) {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-[900px] ${referenceNativeTableClass}`}>
        <thead>
          <tr className={referenceNativeHeadRowClass}>
            <Head
              id="employee"
              label="Employee"
              sort={sort}
              onSort={onSortChange}
            />
            <Head
              id="kit"
              label="Kit & policy"
              sort={sort}
              onSort={onSortChange}
            />
            <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
              Sources
            </th>
            <Head
              id="status"
              label="Status"
              sort={sort}
              onSort={onSortChange}
            />
            <Head id="total" label="Total" sort={sort} onSort={onSortChange} />
            <th className={referenceNativeHeadCellClass} />
          </tr>
        </thead>
        <tbody>
          {records.map((record) => {
            const employee = employees.get(record.employeeId);
            const sources = uniqueApprovalSources(record);
            return (
              <tr
                key={record.id}
                onClick={() => onSelect(record.id)}
                className={`cursor-pointer ${referenceNativeBodyRowClass}`}
              >
                <td className={referenceNativeBodyCellClass}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                      {employee?.initials ?? "-"}
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium text-gray-900">
                        {employee?.name ?? "-"}
                      </span>
                      <span className="truncate text-xs text-gray-500">
                        {employee?.role ?? "-"}
                      </span>
                    </span>
                  </div>
                </td>
                <td className={referenceNativeBodyCellClass}>
                  <span className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">
                      {record.kitName ?? "-"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {record.matchedRuleName ?? "-"}
                    </span>
                  </span>
                </td>
                <td className={referenceNativeBodyCellClass}>
                  <div className="flex flex-wrap gap-1">
                    {sources.length > 0 ? (
                      sources.map((source) => (
                        <ItemSourceBadge key={source} source={source} />
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </div>
                </td>
                <td className={referenceNativeBodyCellClass}>
                  <ApprovalStatusBadge status={record.status} />
                </td>
                <td
                  className={`${referenceNativeBodyCellClass} font-semibold text-primary`}
                >
                  {formatApprovalMoney({
                    amount: record.totalAmount,
                    currencyCode: record.currencyCode,
                    currencySymbol: record.currencySymbol,
                  })}
                </td>
                <td className={`${referenceNativeBodyCellClass} text-right`}>
                  <button className="text-sm font-semibold text-primary-700">
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Head({
  id,
  label,
  onSort,
  sort,
}: {
  id: ApprovalSort["column"];
  label: string;
  onSort: (sort: ApprovalSort) => void;
  sort: ApprovalSort;
}) {
  const direction =
    sort.column === id && sort.direction === "ascending"
      ? "descending"
      : "ascending";
  return (
    <th className={referenceNativeHeadCellClass}>
      <button
        type="button"
        onClick={() => onSort({ column: id, direction })}
        className="text-xs font-semibold text-quaternary"
      >
        {label}
      </button>
    </th>
  );
}
