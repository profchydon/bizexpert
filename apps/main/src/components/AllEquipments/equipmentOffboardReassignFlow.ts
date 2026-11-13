import type { IEquipment } from "@/types/equipments";
import type { IEmployees } from "@/types/employees";
import { UNASSIGNED_ORDER_SUMMARY_KEY } from "@/utils/getInitials";
import { isAssignedDevice } from "@/container/Dashboard/Employees/OffboardDevices/offboardPricing";

export type OffboardDispositionValidation =
  | {
      ok: true;
      assigneeId: string;
      deviceIds: string[];
    }
  | {
      ok: false;
      message: string;
    };

export type OffboardReassignValidation = OffboardDispositionValidation;

export function resolveOffboardReassignEquipment(
  item: IEquipment | undefined,
  selectedRows: IEquipment[],
) {
  if (selectedRows.length > 0) return selectedRows;
  return item ? [item] : [];
}

function getAssigneeId(equipment: IEquipment) {
  const assigneeId = equipment.assignee?.id;
  if (!assigneeId || assigneeId === UNASSIGNED_ORDER_SUMMARY_KEY) {
    return null;
  }
  return String(assigneeId);
}

export function validateOffboardReassignSelection(
  equipment: IEquipment[],
): OffboardReassignValidation {
  if (equipment.length === 0) {
    return {
      ok: false,
      message: "Select at least one assigned device to off-board.",
    };
  }

  const eligible = equipment.filter(
    (item) => item.id && isAssignedDevice(item) && getAssigneeId(item),
  );

  if (eligible.length === 0) {
    return {
      ok: false,
      message: "Only assigned equipment can be off-boarded for reassignment.",
    };
  }

  const assigneeIds = [
    ...new Set(eligible.map((item) => getAssigneeId(item) as string)),
  ];

  if (assigneeIds.length > 1) {
    return {
      ok: false,
      message:
        "Select equipment assigned to the same employee to off-board for reassignment.",
    };
  }

  return {
    ok: true,
    assigneeId: assigneeIds[0],
    deviceIds: eligible.map((item) => String(item.id)),
  };
}

export function findEmployeeForOffboard(
  employeeId: string,
  employees: IEmployees[],
) {
  return employees.find((employee) => String(employee.id) === employeeId);
}

export function buildEmployeeStubFromEquipment(
  equipment: IEquipment,
  employeeId: string,
): IEmployees {
  const assigneeName = equipment.assignee?.name?.trim() ?? "";
  const [firstName = "Employee", ...rest] = assigneeName.split(/\s+/);

  return {
    id: employeeId,
    first_name: firstName,
    last_name: rest.join(" "),
    email: equipment.assignee?.email ?? "",
    personal_email: null,
    address: equipment.assignee?.address ?? "",
    country_id: "",
    phone: "",
    job_title: "",
    sso_id: null,
    employment_type: "",
    tax_number: null,
    level: "",
    department_id: "",
    departments: [],
    status: "active",
    landmark: null,
    stage: "",
    email_verified_at: null,
    remember_token: null,
    created_at: "",
    updated_at: "",
    deleted_at: null,
    laravel_through_key: "",
    roles: [],
    user_company: {} as IEmployees["user_company"],
    currency_code: "",
  };
}

export function resolveOffboardEmployeeRecord(
  employeeId: string,
  equipment: IEquipment[],
  employees: IEmployees[],
) {
  return (
    findEmployeeForOffboard(employeeId, employees) ??
    buildEmployeeStubFromEquipment(
      equipment.find((item) => getAssigneeId(item) === employeeId) ??
        equipment[0],
      employeeId,
    )
  );
}
