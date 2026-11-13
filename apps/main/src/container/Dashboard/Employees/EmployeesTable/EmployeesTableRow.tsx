"use client";

import Link from "next/link";
import ReactCountryFlag from "react-country-flag";
import { Avatar } from "@/components/base/avatar/avatar";
import { removeUserscore } from "@/utils/underScoreTransformer";
import {
  resolveCountryCode,
  resolveCountryText,
} from "@/utils/resolveCountryText";
import type { IEmployees } from "@/types/employees";
import EmployeeDevicesCell from "./EmployeeDevicesCell";
import EmployeeRowActions from "./EmployeeRowActions";
import { RowSelectCheckbox } from "./selectionCheckboxes";
import {
  EMPLOYEES_COLUMN_TEMPLATE,
  employeesTableRowClass,
} from "./employeesTableClasses";

type DepartmentResolver = (id?: string) => string | null | undefined;

type Props = {
  employee: IEmployees;
  departmentById: DepartmentResolver;
  selectedFilterValue: "active" | "archived";
  canOffboard: boolean;
  canEquip: boolean;
  onEdit: () => void;
  onEquip: () => void;
  onOffboard: () => void;
  isEquipLoading?: boolean;
  isOffboardLoading?: boolean;
  viewHref: string;
};

const EmployeesTableRow = ({
  employee,
  departmentById,
  selectedFilterValue,
  canOffboard,
  canEquip,
  viewHref,
  onEdit,
  onEquip,
  onOffboard,
  isEquipLoading,
  isOffboardLoading,
}: Props) => {
  const initials = `${employee.first_name?.[0] ?? ""}${employee.last_name?.[0] ?? ""}`;
  const fullName =
    `${employee.first_name ?? ""} ${employee.last_name ?? ""}`.trim();
  const employmentType = employee.employment_type
    ? removeUserscore(employee.employment_type)
    : "---------------";
  const departmentName =
    departmentById(employee.departments?.[0]?.id) ?? "---------------";
  const levelLabel = employee.level
    ? removeUserscore(employee.level)
    : "---------------";
  const countryName = resolveCountryText(employee.country) ?? "";
  const countryCode = resolveCountryCode(
    employee.country_code,
    employee.country,
  );

  return (
    <div
      className={employeesTableRowClass}
      style={{ gridTemplateColumns: EMPLOYEES_COLUMN_TEMPLATE }}
    >
      <RowSelectCheckbox employee={employee} />

      <div className="flex min-w-0 items-center gap-3">
        <Avatar size="md" initials={initials} />
        <div className="min-w-0">
          <Link
            href={viewHref}
            className="block truncate font-medium text-primary hover:underline"
          >
            {fullName}
          </Link>
          <p className="truncate text-sm text-tertiary">{employmentType}</p>
        </div>
      </div>

      <div className="min-w-0">
        <p className="truncate font-medium text-primary">{levelLabel}</p>
        <p className="truncate text-sm text-tertiary">{departmentName}</p>
      </div>

      <div className="min-w-0">
        <p className="truncate font-medium text-primary">{employee.email}</p>
        <p className="truncate text-sm text-tertiary tabular-nums">
          {employee.phone ?? ""}
        </p>
      </div>

      <EmployeeDevicesCell row={employee} />

      <div className="flex min-w-0 items-center gap-2">
        {countryCode ? (
          <ReactCountryFlag
            countryCode={countryCode}
            svg
            className="size-6 shrink-0 overflow-hidden rounded-full ring-1 ring-secondary"
            style={{ width: 24, height: 24 }}
          />
        ) : (
          <span className="inline-block size-6 shrink-0 rounded-full bg-tertiary" />
        )}
        <span className="truncate text-tertiary">{countryName}</span>
      </div>

      <div className="justify-self-end">
        <EmployeeRowActions
          viewHref={viewHref}
          isArchived={selectedFilterValue === "archived"}
          canEquip={canEquip}
          canOffboard={canOffboard}
          onEdit={onEdit}
          onEquip={onEquip}
          onOffboard={onOffboard}
          isEquipLoading={isEquipLoading}
          isOffboardLoading={isOffboardLoading}
        />
      </div>
    </div>
  );
};

export default EmployeesTableRow;
