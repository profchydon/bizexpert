import type { ReactNode } from "react";
import Link from "next/link";
import ReactCountryFlag from "react-country-flag";
import type { IEmployees } from "@/types/employees";
import { removeUserscore } from "@/utils/underScoreTransformer";
import {
  resolveCountryCode,
  resolveCountryText,
} from "@/utils/resolveCountryText";

export type EmployeeProfileField = {
  label: string;
  value: ReactNode;
};

const managerName = (manager?: Partial<IEmployees> | null) => {
  if (!manager) return "—";
  return (
    [manager.first_name, manager.last_name].filter(Boolean).join(" ") ||
    manager.email ||
    "—"
  );
};

const formatValue = (value?: string | null) => value?.trim() || "—";

const officeValue = (
  officeName: string | undefined,
  officeHref: string | null | undefined,
) => {
  const name = formatValue(officeName);
  if (name === "—" || !officeHref) return name;
  return (
    <Link href={officeHref} className="text-primary-700 hover:underline">
      {name}
    </Link>
  );
};

export const buildPrimaryProfileFields = (
  employee?: IEmployees,
  officeHref?: string | null,
): EmployeeProfileField[] => {
  const countryName = resolveCountryText(employee?.country);
  const countryCode = resolveCountryCode(
    employee?.country_code,
    employee?.country,
  );

  return [
    {
      label: "Line Manager",
      value: managerName(employee?.manager),
    },
    {
      label: "Location",
      value: countryCode ? (
        <span className="flex items-center gap-2">
          <ReactCountryFlag
            countryCode={countryCode}
            svg
            className="size-5 shrink-0 overflow-hidden rounded-full ring-1 ring-secondary"
          />
          {formatValue(countryName)}
        </span>
      ) : (
        formatValue(countryName)
      ),
    },
    {
      label: "Office",
      value: officeValue(employee?.office?.name, officeHref),
    },
    {
      label: "Role",
      value: formatValue(employee?.job_title),
    },
    {
      label: "Department",
      value: formatValue(employee?.departments?.[0]?.name),
    },
    {
      label: "Employee type",
      value: employee?.employment_type
        ? removeUserscore(employee.employment_type)
        : "—",
    },
    {
      label: "Employee level",
      value: formatValue(employee?.level),
    },
  ];
};
