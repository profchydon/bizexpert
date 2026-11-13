"use client";

import { currencySymbol } from "@/utils/currencySymbol";
import { ERASURE_FEE } from "../data/plans";
import { useGetServiceFeesQuery } from "@/api/baseQueries/feesApi/getServiceFees";
import { AlertTriangle } from "@untitledui/icons";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { EmployeePicker } from "@/container/Dashboard/Storage/Remote/support/DeviceAssignment/components/EmployeePicker";
import type { Employee } from "../support/Employees/data/dummy-employees";
import type { StoredDevice } from "../types/storage";
import { DeviceAvatar } from "./DeviceAvatar";

interface Props {
  devices: StoredDevice[];
  employees: Employee[];
  assignments: Record<string, string | null>;
  wipeSelections?: Record<string, boolean>;
  onAssign: (deviceId: string, employeeId: string | null) => void;
  onAssignAll: (employeeId: string) => void;
  onWipeChange?: (deviceId: string, wipe: boolean) => void;
}

export function BulkDeployAssign({
  devices,
  employees,
  assignments,
  wipeSelections,
  onAssign,
  onAssignAll,
  onWipeChange,
}: Props) {
  const { data: serviceFees } = useGetServiceFeesQuery();
  const factoryResetFee = serviceFees?.data?.Factory_Reset ?? ERASURE_FEE;
  // Reflect the shared person in the "assign all" control only when every row matches.
  const ids = devices.map((d) => assignments[d.id] ?? null);
  const shared =
    ids[0] != null && ids.every((id) => id === ids[0]) ? ids[0] : null;

  return (
    <div className="flex flex-col gap-3">
      {/* The "assign all at once" shortcut only makes sense for 2+ devices. */}
      {devices.length > 1 && (
        <div className="flex flex-col gap-2 rounded-lg bg-secondary p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-primary">
              Send all {devices.length} to one employee
            </p>
            <p className="text-xs text-tertiary">
              Auto-fills every device below — you can still change any
              individually.
            </p>
          </div>
          <div className="w-full sm:w-[260px] sm:shrink-0">
            <EmployeePicker
              selectedId={shared}
              employees={employees}
              allowCrossCountryFallback
              showAddEmployeeAction={false}
              onSelect={(id) => onAssignAll(id)}
            />
          </div>
        </div>
      )}

      <ul className="flex flex-col divide-y divide-secondary rounded-lg border border-secondary">
        {devices.map((d) => {
          const empId = assignments[d.id] ?? null;
          const emp = empId ? employees.find((e) => e.id === empId) : null;
          const crossBorder = !!emp && emp.country !== d.country;
          return (
            <li key={d.id} className="flex flex-col px-4 py-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <DeviceAvatar
                    image={d.image}
                    assetType={d.assetType}
                    name={d.deviceName}
                    size="md"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-primary">
                      {d.deviceName}
                    </p>
                    <p className="truncate text-xs text-tertiary">
                      {d.serialNumber} · {d.country}
                    </p>
                  </div>
                </div>
                {/* Full employee list in every picker, so any employee can take any device. */}
                <div className="w-full sm:w-[260px] sm:shrink-0">
                  <EmployeePicker
                    selectedId={empId}
                    employees={employees}
                    deviceCountry={d.country}
                    allowCrossCountryFallback
                    showAddEmployeeAction={false}
                    onSelect={(id) => onAssign(d.id, id)}
                  />
                  {crossBorder && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-warning-primary">
                      <AlertTriangle className="size-3 shrink-0" /> Ships
                      cross-border
                    </p>
                  )}
                </div>
              </div>
              {d.wipeStatus === "not_wiped" && onWipeChange && (
                <div className="mt-3.5 border-t border-secondary pt-3.5">
                  <Checkbox
                    isSelected={wipeSelections?.[d.id] ?? false}
                    onChange={(v) => onWipeChange(d.id, v)}
                    label="Wipe before sending"
                    hint={`Full Factory Reset · adds ${currencySymbol(d.currency)}${factoryResetFee}`}
                    data-testid="bulkdeployassign-checkbox"
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
