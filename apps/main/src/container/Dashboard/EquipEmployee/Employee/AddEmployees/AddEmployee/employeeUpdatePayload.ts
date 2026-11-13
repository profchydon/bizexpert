type Option = {
  label: string;
  value: string;
};

type EmployeeUpdateFormValues = Record<string, any>;

type EmployeeIdentityContext = {
  countryOptions?: Option[];
  currentEmployee?: any;
  departmentOptions?: Option[];
  levelOptions?: Option[];
};

function resolveOptionId(value: unknown, options: Option[] = []) {
  if (typeof value !== "string" || value.trim() === "") return value;

  const byValue = options.find((option) => option.value === value);
  if (byValue) return byValue.value;

  const byLabel = options.find((option) => option.label === value);
  return byLabel?.value ?? value;
}

function resolveEmployeeManagerId(value: unknown, employee?: any) {
  if (typeof value !== "string" || value.trim() === "") return value;

  const manager = employee?.line_manager ?? employee?.manager;
  if (!manager) return value;

  const managerName = [manager.first_name, manager.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (
    value === manager.id ||
    value === manager.email ||
    value === managerName
  ) {
    return manager.id;
  }

  return value;
}

function resolveEmployeeDepartmentId(value: unknown, employee?: any) {
  const departments = employee?.departments ?? [];
  const firstDepartmentId = departments[0]?.id;

  if (typeof value !== "string" || value.trim() === "") {
    return firstDepartmentId ?? value;
  }

  const department = departments.find(
    (item: any) => value === item.id || value === item.name,
  );

  return department?.id ?? value;
}

function resolveEmployeeLevelId(
  value: unknown,
  employee: any,
  levelOptions: Option[] = [],
) {
  const resolvedValue = resolveOptionId(value, levelOptions);
  if (
    typeof resolvedValue === "string" &&
    resolvedValue.trim() !== "" &&
    resolvedValue !== value
  ) {
    return resolvedValue;
  }

  const currentLevel = employee?.level_position;
  if (typeof value === "string" && currentLevel) {
    if (value === currentLevel.id || value === currentLevel.name) {
      return currentLevel.id;
    }
  }

  return resolvedValue;
}

function buildEmployeeUpdatePayload(
  values: EmployeeUpdateFormValues,
  context: EmployeeIdentityContext,
) {
  return {
    ...values,
    country_id: resolveOptionId(values.country_id, context.countryOptions),
    department_id: resolveEmployeeDepartmentId(
      resolveOptionId(values.department_id, context.departmentOptions),
      context.currentEmployee,
    ),
    level: resolveEmployeeLevelId(
      values.level,
      context.currentEmployee,
      context.levelOptions,
    ),
    manager_id: resolveEmployeeManagerId(
      values.manager_id,
      context.currentEmployee,
    ),
  };
}

export { buildEmployeeUpdatePayload, resolveOptionId };
export type { EmployeeIdentityContext, EmployeeUpdateFormValues, Option };
