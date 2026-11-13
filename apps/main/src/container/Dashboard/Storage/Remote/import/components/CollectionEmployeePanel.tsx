"use client";

import type { FC, ReactNode } from "react";
import { useEffect, useState } from "react";
import { Mail01, MarkerPin01, Phone } from "@untitledui/icons";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { EmployeePicker } from "@/container/Dashboard/Storage/Remote/support/DeviceAssignment/components/EmployeePicker";
import { useEmployeeDirectory } from "@/container/Dashboard/Storage/Remote/support/Employees/data/employee-directory";
import { getEmployeePhone } from "@/container/Dashboard/Storage/Remote/support/Employees/utils/employee-display";
import type { ImportCollection } from "../types";
import { EditEmployeeSlideout } from "./EditEmployeeSlideout";

interface Props {
  collection: ImportCollection;
  country?: string;
  onPatch: (patch: Partial<ImportCollection>) => void;
}

function Fact({
  icon: Icon,
  children,
}: {
  icon: FC<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-secondary">
      <Icon className="size-4 shrink-0 text-fg-quaternary" />
      <span className="truncate">{children}</span>
    </div>
  );
}

export function CollectionEmployeePanel({
  collection,
  country,
  onPatch,
}: Props) {
  const employees = useEmployeeDirectory();
  const [selectedId, setSelectedId] = useState<string | null>(
    collection.employeeId ?? null,
  );
  const [editing, setEditing] = useState(false);
  const employee = selectedId
    ? (employees.find((e) => e.id === selectedId) ?? null)
    : null;
  const inCountry = country
    ? employees.filter((e) => e.country === country)
    : employees;

  // Keep the import's collection contact synced to the chosen employee (and edits).
  useEffect(() => {
    if (employee)
      onPatch({
        employeeId: employee.id,
        contactName: employee.name,
        contactEmail: employee.email,
        contactPhone: getEmployeePhone(employee),
        address: employee.address,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    employee?.id,
    employee?.name,
    employee?.email,
    employee?.phone,
    employee?.address,
  ]);

  if (!employee) {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-secondary">
          Collect from employee
        </span>
        {inCountry.length === 0 ? (
          <p className="rounded-lg border border-dashed border-secondary p-3 text-sm text-tertiary">
            No employees based in {country ?? "this country"} yet. Switch to{" "}
            <span className="font-medium text-secondary">Custom address</span>{" "}
            to enter a pickup address.
          </p>
        ) : (
          <>
            <EmployeePicker
              selectedId={null}
              employees={employees}
              deviceCountry={country}
              showAddEmployeeAction={false}
              onSelect={(id) => setSelectedId(id)}
            />
            <p className="text-xs text-tertiary">
              Only employees based in {country ?? "the selected country"} can be
              selected — we&apos;ll use their address and contact details.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 rounded-xl border border-secondary p-4">
        <div className="flex items-start gap-3">
          <Avatar size="md" initials={employee.initials} />
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-semibold text-primary">
              {employee.name}
            </span>
            <span className="text-xs text-tertiary">
              {employee.role} · {employee.country}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Fact icon={Mail01}>{employee.email}</Fact>
          <Fact icon={Phone}>{getEmployeePhone(employee)}</Fact>
          <Fact icon={MarkerPin01}>{employee.address}</Fact>
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            color="secondary"
            onClick={() => setEditing(true)}
            data-testid="collectionemployeepanel-button"
          >
            Edit details
          </Button>
          <Button
            size="sm"
            color="link-gray"
            onClick={() => {
              setSelectedId(null);
              onPatch({ employeeId: undefined });
            }}
            data-testid="collectionemployeepanel-button-2"
          >
            Change employee
          </Button>
        </div>
      </div>
      <EditEmployeeSlideout
        employee={employee}
        isOpen={editing}
        onClose={() => setEditing(false)}
        onSaved={(u) =>
          onPatch({
            employeeId: u.id,
            contactName: u.name,
            contactEmail: u.email,
            contactPhone: getEmployeePhone(u),
            address: u.address,
          })
        }
      />
    </>
  );
}
