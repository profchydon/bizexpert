import type { ReactNode } from "react";
import { Avatar } from "@/components/base/avatar/avatar";
import type { Employee } from "../../support/Employees/data/dummy-employees";
import { CountryFlag } from "../CountryFlag";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-xs text-quaternary">{label}</span>
      <span className="text-right text-sm text-secondary">{children}</span>
    </div>
  );
}

/** Read-only confirmation of who and where a stored device will ship to. No editable fields. */
export function DeployRecipientSummary({ employee }: { employee: Employee }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-secondary bg-secondary p-4">
      <div className="flex items-center gap-3">
        <Avatar size="md" initials={employee.initials} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-primary">
            {employee.name}
          </p>
          <p className="truncate text-xs text-tertiary">
            {employee.role} · {employee.country}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 border-t border-secondary pt-3">
        <Row label="Email">{employee.email}</Row>
        <Row label="Ships to">
          <span className="inline-flex items-center justify-end gap-1.5">
            <CountryFlag
              country={employee.country}
              className="size-3.5 shrink-0 rounded-full"
            />
            {employee.address}
          </span>
        </Row>
      </div>
    </div>
  );
}
