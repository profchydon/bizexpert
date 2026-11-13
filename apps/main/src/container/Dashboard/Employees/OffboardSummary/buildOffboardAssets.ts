import type { IEmployees } from "@/types/employees";
import type { ActionType, Offboard_asset } from "@/types/offboarding";
import type { Disposition, OffboardReviewEmployee } from "@/types/offboard";

export const DISPOSITION_ACTION: Record<Disposition, ActionType> = {
  STORE: "Store",
  REASSIGN: "Transfer",
  DISPOSE: "Archive",
};

type Assignee = NonNullable<Offboard_asset["assignee"]>;

const buildAssignee = (
  reviewEmployee: OffboardReviewEmployee,
  full?: IEmployees,
): Assignee => {
  if (full) {
    const name = `${full.first_name ?? ""} ${full.last_name ?? ""}`.trim();
    return {
      id: String(full.id),
      name: name || reviewEmployee.name,
      email: full.email ?? "",
      country: full.country ?? reviewEmployee.country ?? "",
      country_code: full.country_code ?? "",
      address: full.address ?? "",
      employment_type: full.employment_type ?? "",
      phone: full.phone ?? "",
      job_title: full.job_title ?? reviewEmployee.role ?? "",
      offboardEmployee: true,
    };
  }

  return {
    id: reviewEmployee.id,
    name: reviewEmployee.name,
    email: "",
    country: reviewEmployee.country ?? "",
    country_code: "",
    address: "",
    employment_type: "",
    phone: "",
    job_title: reviewEmployee.role ?? "",
    offboardEmployee: true,
  };
};

export const buildOffboardAssets = (
  review: OffboardReviewEmployee[],
  employees: IEmployees[],
): Offboard_asset[] => {
  const employeeById = new Map(
    employees.map((employee) => [String(employee.id), employee]),
  );

  return review.flatMap((reviewEmployee) => {
    const assignee = buildAssignee(
      reviewEmployee,
      employeeById.get(reviewEmployee.id),
    );
    const collectionDate = reviewEmployee.window?.start;

    return reviewEmployee.devices.map((device) => ({
      id: device.equipmentId || device.id,
      image_url: device.imageUrl ?? "",
      title: device.name,
      year: "",
      make: "",
      actionType: DISPOSITION_ACTION[device.disposition],
      factoryReset: device.wipeType === "Full Factory Reset",
      assignee,
      assets: [],
      ...(collectionDate ? { collectionDate } : {}),
      ...(reviewEmployee.window
        ? { collectionWindow: reviewEmployee.window }
        : {}),
      ...(device.reassignTarget
        ? {
            receiver: {
              id: device.reassignTarget.id,
              first_name: device.reassignTarget.name,
              last_name: "",
              country: device.reassignTarget.country,
            } as unknown as IEmployees,
          }
        : {}),
    }));
  });
};
