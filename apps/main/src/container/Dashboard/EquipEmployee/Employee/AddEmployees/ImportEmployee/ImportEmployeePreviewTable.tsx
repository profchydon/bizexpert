"use client";

import { Button } from "@/components/base/buttons/button";
import type { IEmployees } from "@/types/employees";
import { removeUserscore } from "@/utils/underScoreTransformer";
import {
  importEmployeePreviewBodyRowClass,
  importEmployeePreviewEmptyStateClass,
  importEmployeePreviewHeadRowClass,
  importEmployeePreviewTableClass,
  importEmployeePreviewTableShellClass,
} from "./importEmployeePreviewTableClasses";

type Props = {
  rows: IEmployees[];
  levelsById: (id: string) => string | null | undefined;
  departmentById: (id: string) => string | null | undefined;
  onRemove: (employeeId: string) => void;
  onEdit: (employeeId: string) => void;
};

const PLACEHOLDER = "----";

function displayValue(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : PLACEHOLDER;
}

export function ImportEmployeePreviewTable({
  rows,
  levelsById,
  departmentById,
  onRemove,
  onEdit,
}: Props) {
  if (rows.length === 0) {
    return (
      <div className={importEmployeePreviewEmptyStateClass}>
        No data found in file.
      </div>
    );
  }

  const sortedRows = rows.slice().sort((a, b) => Number(a.id) - Number(b.id));

  return (
    <div className={importEmployeePreviewTableShellClass}>
      <table className={importEmployeePreviewTableClass}>
        <thead>
          <tr className={importEmployeePreviewHeadRowClass}>
            <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">
              Employee Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">
              Level
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">
              Contact Data
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">
              Address
            </th>
            <th className="px-6 py-3" />
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((employee) => {
            const levelLabel = employee.level
              ? levelsById(employee.level)
              : undefined;
            const departmentLabel = employee.department_id
              ? departmentById(employee.department_id)
              : undefined;

            return (
              <tr
                key={employee.id ?? employee.email}
                className={importEmployeePreviewBodyRowClass}
              >
                <td className="max-w-[200px] px-6 py-4">
                  <p className="truncate text-sm font-semibold text-primary">
                    {displayValue(
                      [employee.first_name, employee.last_name]
                        .filter(Boolean)
                        .join(" "),
                    )}
                  </p>
                  <p className="mt-0.5 truncate text-sm text-tertiary">
                    {displayValue(employee.job_title)}
                  </p>
                </td>
                <td className="max-w-[200px] px-6 py-4">
                  <p className="truncate text-sm text-primary">
                    {displayValue(levelLabel)}
                  </p>
                  <p className="mt-0.5 truncate text-sm text-tertiary">
                    {displayValue(departmentLabel)}
                  </p>
                </td>
                <td className="max-w-[200px] px-6 py-4">
                  <p className="truncate text-sm text-primary">
                    {displayValue(employee.email)}
                  </p>
                  <p className="mt-0.5 truncate text-sm text-tertiary">
                    {displayValue(
                      employee.phone ? String(employee.phone) : undefined,
                    )}
                  </p>
                </td>
                <td className="max-w-[200px] px-6 py-4">
                  <p
                    className="truncate text-sm text-primary"
                    title={employee.address || undefined}
                  >
                    {displayValue(employee.address)}
                  </p>
                  <p className="mt-0.5 truncate text-sm text-tertiary">
                    {displayValue(removeUserscore(employee.employment_type))}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      color="link-gray"
                      onPress={() => onRemove(employee.id)}
                      data-testid="importemployeepreviewtable-button"
                    >
                      Delete
                    </Button>
                    <Button
                      size="sm"
                      color="link-color"
                      onPress={() => onEdit(employee.id)}
                      data-testid="importemployeepreviewtable-button-2"
                    >
                      Edit
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
