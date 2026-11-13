import type { IEmployees } from "@/types/employees";

export type SelectedEmployeeMap = Record<string, IEmployees>;
export type PinnedApprover = Pick<
  IEmployees,
  "email" | "first_name" | "id" | "last_name"
>;

export const cacheSelectedEmployees = ({
  current,
  employees,
  selected,
}: {
  current: SelectedEmployeeMap;
  employees: IEmployees[];
  selected: string[];
}) => {
  const next = { ...current };

  employees.forEach((employee) => {
    const id = String(employee.id);
    if (selected.includes(id)) next[id] = employee;
  });

  return next;
};

export const selectedEmployeesFromCache = (
  selected: string[],
  selectedById: SelectedEmployeeMap,
  pinnedApprover?: PinnedApprover,
) =>
  selected
    .map((id) =>
      pinnedApprover && id === String(pinnedApprover.id)
        ? (pinnedApprover as IEmployees)
        : selectedById[id],
    )
    .filter((employee): employee is IEmployees => Boolean(employee));

export function withPinnedApprover(selected: string[], pinnedId?: string) {
  if (!pinnedId || selected.includes(pinnedId)) return selected;
  return [pinnedId, ...selected];
}
