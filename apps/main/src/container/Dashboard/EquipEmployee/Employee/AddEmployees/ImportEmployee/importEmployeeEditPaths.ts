export function importEmployeeListPath(employeepage_instance: boolean) {
  return employeepage_instance
    ? "/dashboard/employees"
    : "/dashboard/equip-employee/employees";
}

export function importEmployeeEditPath(
  employeeId: string,
  employeepage_instance: boolean,
) {
  return `${importEmployeeListPath(employeepage_instance)}?employee_id=${employeeId}&edit=true`;
}
