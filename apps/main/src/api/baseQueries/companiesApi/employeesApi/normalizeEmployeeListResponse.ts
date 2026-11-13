import { IEmployees } from "@/types/employees";

export type EmployeeListPayload = {
  data: IEmployees[];
  total?: number;
  per_page?: number;
  current_page?: number;
  last_page?: number;
};

export function normalizeEmployeeListResponse(
  response: ServerResponse<IEmployees[] | EmployeeListPayload>,
): ServerResponse<EmployeeListPayload> {
  const payload = response.data;

  if (Array.isArray(payload)) {
    return {
      ...response,
      data: {
        data: payload,
        total: payload.length,
        current_page: 1,
        last_page: 1,
        per_page: payload.length,
      },
    };
  }

  return response as ServerResponse<EmployeeListPayload>;
}

export function resolveEmployeePaginateParam(
  paginate?: boolean,
): boolean | "false" {
  if (paginate === false) {
    return "false";
  }

  return paginate ?? true;
}
