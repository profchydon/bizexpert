"use client";

import { useMemo, useSyncExternalStore } from "react";
import { makePhoneFromId } from "../utils/employee-phone";
import { DUMMY_EMPLOYEES } from "./dummy-employees";
import type { Employee } from "./dummy-employees";
import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

interface EmployeeFormData {
  name: string;
  jobTitle: string;
  department: string;
  workEmail: string;
  address: string;
  country: string;
  phone: string;
}

export type DirectoryEmployeeFormData = EmployeeFormData;

const STORAGE_KEY = "rayda_local_employees";
const SERVER_SNAPSHOT: Employee[] = [];

let listeners: Array<() => void> = [];
let cache: Employee[] | null = null;

function isEmployee(value: unknown): value is Employee {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<Employee>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.initials === "string" &&
    typeof candidate.role === "string" &&
    typeof candidate.dept === "string" &&
    typeof candidate.email === "string" &&
    typeof candidate.address === "string" &&
    typeof candidate.country === "string" &&
    typeof candidate.flag === "string"
  );
}

function getServerSnapshot(): Employee[] {
  return SERVER_SNAPSHOT;
}

function getLocalEmployeesSnapshot(): Employee[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    cache = Array.isArray(parsed)
      ? parsed
          .filter(isEmployee)
          .map((e) => ({ ...e, phone: e.phone || makePhoneFromId(e.id) }))
      : [];
  } catch {
    cache = [];
  }
  return cache;
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function notify() {
  for (const listener of listeners) listener();
}

function persistLocalEmployees(employees: Employee[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  cache = employees;
  notify();
}

function makeInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function createLocalEmployee(data: EmployeeFormData, id?: string): Employee {
  const employeeId =
    id ??
    `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    id: employeeId,
    name: data.name.trim(),
    initials: makeInitials(data.name),
    role: data.jobTitle.trim() || "Employee",
    dept: data.department || "—",
    email: data.workEmail.trim(),
    address: data.address.trim() || "—",
    country: data.country || "—",
    flag: "",
    phone: data.phone.trim() || makePhoneFromId(employeeId),
  };
}

function addLocalEmployee(data: EmployeeFormData): Employee {
  const employee = createLocalEmployee(data);
  const next = [...getLocalEmployeesSnapshot(), employee];
  persistLocalEmployees(next);
  return employee;
}

// Upsert by id — replaces a local record, or appends a local override for a seed id.
function updateLocalEmployee(id: string, data: EmployeeFormData): Employee {
  const updated = createLocalEmployee(data, id);
  const locals = getLocalEmployeesSnapshot();
  const next = locals.some((e) => e.id === id)
    ? locals.map((e) => (e.id === id ? updated : e))
    : [...locals, updated];
  persistLocalEmployees(next);
  return updated;
}

function useLocalEmployees(): Employee[] {
  return useSyncExternalStore(
    subscribe,
    getLocalEmployeesSnapshot,
    getServerSnapshot,
  );
}

// Local records override seed records with the same id (so an edited seed employee shows once).
function mergeById(base: Employee[], overrides: Employee[]): Employee[] {
  const byId = new Map<string, Employee>();
  for (const e of base) byId.set(e.id, e);
  for (const e of overrides) byId.set(e.id, e);
  return Array.from(byId.values());
}

function useEmployeeDirectory(): Employee[] {
  const localEmployees = useLocalEmployees();
  const companyId = useWorkspaceCompanyId();
  const { data: getEmployees } = useGetEmployeesQuery(
    { companyId: companyId!, params: { paginate: false } },
    { skip: !companyId },
  );

  return useMemo(() => {
    const apiEmployees: Employee[] = (getEmployees?.data?.data ?? []).map(
      (emp) => ({
        id: emp.id,
        name:
          `${emp.first_name || ""} ${emp.last_name || ""}`.trim() ||
          emp.email ||
          "Unknown",
        initials: makeInitials(
          `${emp.first_name || ""} ${emp.last_name || ""}`.trim(),
        ),
        role: emp.job_title || "Employee",
        dept: emp.department?.name || "—",
        email: emp.email,
        address: emp.address || "—",
        country:
          typeof emp.country === "string"
            ? emp.country
            : (emp.country as any)?.name || (emp.country as any)?.label || "—",
        flag: "",
        phone: emp.phone || makePhoneFromId(emp.id),
      }),
    );

    return mergeById(apiEmployees, localEmployees);
  }, [getEmployees?.data?.data, localEmployees]);
}

function getEmployeeDirectorySnapshot(): Employee[] {
  return mergeById(DUMMY_EMPLOYEES, getLocalEmployeesSnapshot());
}

function findEmployeeById(
  employees: Employee[],
  employeeId: string,
): Employee | undefined {
  return employees.find((employee) => employee.id === employeeId);
}

function hasEmployeeInCountry(
  employees: Employee[],
  countryLabel: string,
): boolean {
  return employees.some((employee) => employee.country === countryLabel);
}

export {
  addLocalEmployee,
  findEmployeeById,
  getEmployeeDirectorySnapshot,
  hasEmployeeInCountry,
  updateLocalEmployee,
  useEmployeeDirectory,
  useLocalEmployees,
};
